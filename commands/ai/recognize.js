import { SlashCommandBuilder } from "discord.js";
import { ollama } from "../../config/ollama.config.js";

export default {
  data: new SlashCommandBuilder()
    .setName("recognize")
    .setDescription("Recognizes image content.")
    .addAttachmentOption((option) =>
      option
        .setName("image")
        .setDescription("Image attachment.")
        .setRequired(true)
    )
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
    const attachment = interaction.options.getAttachment("image");

    const imageResponse = await fetch(attachment.url);
    const arrayBuffer = await imageResponse.arrayBuffer();
    const base64Image = Buffer.from(arrayBuffer).toString("base64");

    const response = await ollama.client.chat({
      model: ollama.visionModel,
      messages: [
        { role: "system", content: ollama.visionSystemPrompt },
        {
          role: "user",
          content: "My name is " + interaction.user.displayName + ".",
        },
        {
          role: "user",
          content: prompt,
          images: [base64Image],
        },
      ],
      stream: false,
    });

    await interaction.editReply(
      response.message.content + "\n\n" + attachment.url
    );
  },
};
