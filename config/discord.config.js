import dotenv from "dotenv";

dotenv.config({ encoding: "utf8", path: ".env", debug: true });

//validation
const requiredEnv = ["DISCORD_TOKEN", "DISCORD_CLIENT_ID", "DISCORD_GUILD_ID"];

const missingEnv = requiredEnv.filter((key) => !process.env[key]);

if (missingEnv.length > 0) {
  throw new Error(
    `Missing required DISCORD_ env vars: ${missingEnv.join(", ")}`
  );
}

// conifg export
export const discord = {
  token: process.env.DISCORD_TOKEN,
  clientId: process.env.DISCORD_CLIENT_ID,
  guildId: process.env.DISCORD_GUILD_ID,
};
