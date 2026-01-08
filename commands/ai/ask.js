import { SlashCommandBuilder } from "discord.js";
import { Ollama } from "ollama";
import dotenv from "dotenv";

dotenv.config();

const client = new Ollama({
  host: process.env.OLLAMA_HOST,
});

const conversations = new Map();

export default {
  data: new SlashCommandBuilder()
    .setName("ask")
    .setDescription("Asks your LLM.")
    .addStringOption((option) =>
      option
        .setName("prompt")
        .setDescription("Your prompt.")
        .setMaxLength(2_000)
        .setRequired(true)
    ),

  async execute(interaction) {
    await interaction.deferReply();

    const prompt = interaction.options.getString("prompt");
    const userId = interaction.user.id;

    if (!conversations.has(userId)) {
      conversations.set(userId, [
        { role: "system", content: process.env.OLLAMA_SYSTEM_PROMPT },
        {
          role: "user",
          content: "My name is " + interaction.user.displayName + ".",
        },
      ]);
    }

    const history = conversations.get(userId);
    history.push({ role: "user", content: prompt });

    const response = await client.chat({
      model: process.env.OLLAMA_MODEL,
      messages: history,
      stream: false,
    });

    history.push({ role: "assistant", content: response.message.content });

    const suffix =
      "\n>>> Message had more than 2000 characters (discord limitations), so it was trimmed.";

    if (response.message.content.length > 2000) {
      response.message.content =
        response.message.content.substring(0, 2000 - suffix.length) + suffix;
      history.push({ role: "system", content: suffix });
    }

    //pagination (future improvement)

    await interaction.editReply(response.message.content);
  },
};
