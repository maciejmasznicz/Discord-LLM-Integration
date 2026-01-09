import { SlashCommandBuilder, EmbedBuilder } from "discord.js";
import { ollama } from "../../config/ollama.config.js";

const exampleEmbed = new EmbedBuilder()
  .setColor(0x0099ff)
  .setTitle("Info")
  .addFields(
    {
      name: "Ollama Host",
      value: ollama.host,
      inline: true,
    },
    {
      name: "LLM",
      value: ollama.model,
      inline: true,
    },
    {
      name: "Vision LLM",
      value: ollama.visionModel,
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
