import { SlashCommandBuilder } from "discord.js";
import { ollama } from "../../config/ollama.config.js";
import Database from "../../database/mysql.config.js";

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

    if (!(await Database.checkUserExists(userId))) {
      await Database.insertChatHistory(userId, "system", ollama.systemPrompt);
      await Database.insertChatHistory(
        userId,
        "user",
        "My name is " + interaction.user.displayName + "."
      );
    }

    await Database.insertChatHistory(userId, "user", prompt);
    const history = await Database.getChatHistory(userId);

    const response = await ollama.client.chat({
      model: ollama.model,
      messages: history,
      stream: false,
    });

    const suffix =
      "\n>>> Message had more than 2000 characters (discord limitations), so it was trimmed.";

    if (response.message.content.length > 2000) {
      response.message.content =
        response.message.content.substring(0, 2000 - suffix.length) + suffix;
    }

    await Database.insertChatHistory(
      userId,
      "assistant",
      response.message.content
    );

    await interaction.editReply(response.message.content);
  },
};
