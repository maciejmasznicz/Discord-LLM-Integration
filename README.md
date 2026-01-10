# A side project integrating Discord.JS with Ollama LLMs and and MySQL for saving chat history with AI Assistant.

## Inside of a main folder create .env file where you provide exact variables:

> DISCORD_TOKEN=\
> DISCORD_CLIENT_ID=\
> DISCORD_GUILD_ID=\
> MYSQL_HOST=\
> MYSQL_USER=\
> MYSQL_PASSWORD=\
> MYSQL_DATABASE=\
> OLLAMA_HOST=\
> OLLAMA_MODEL=\
> OLLAMA_VISION_MODEL=\
> OLLAMA_VISION_SYSTEM_PROMPT\
> OLLAMA_SYSTEM_PROMPT=

## Run `pnpm run deploy` for slash command deployment to specific guild.

## Next just run `pnpm start` and all of that shoud work.

### Available commands

> /ask (Prompts AI assistant)\
> /recognize (Recognize image using Vision LLM)\
> /info (Prints out info)
