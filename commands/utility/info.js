import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import dotenv from "dotenv";

dotenv.config();

const exampleEmbed = new EmbedBuilder()
  .setColor(0x0099ff)
  .setTitle("Info")
  .addFields(
    {
      name: "Ollama Host",
      value: process.env.OLLAMA_HOST || "Not set",
      inline: true,
    },
    {
      name: "Selected LLM",
      value: process.env.OLLAMA_MODEL || "Not set",
      inline: true,
    },
    {
      name: "Source Code",
      value:
        "This project is completely open source. You can find the code [here](https://github.com/maciejmasznicz/Discord-LLM-Integration).",
    }
  )
  .setTimestamp();

export default {
  data: new SlashCommandBuilder()
    .setName("info")
    .setDescription("Provides information about the application."),
  async execute(interaction) {
    await interaction.reply({ embeds: [exampleEmbed] });
  },
};
