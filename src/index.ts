import { REST, Routes, Client, Events, GatewayIntentBits } from "discord.js";
import * as dotenv from "dotenv";
import { commandsComplex } from "./commands";
dotenv.config();

const {
	TOKEN, 
	CLIENT_ID
} = process.env;

async function main() {

	// Initialise a way to access the Discord REST API.
	// Discord.js as a library covers this for us, so handy!
	const rest = new REST({ version: "10" }).setToken(TOKEN as string);

	// Tell Discord the latest version of the app's commands, 
	// so that users can see command suggestions & command descriptions.
	try {
		
		console.log("Started refreshing application (/) commands.");

		// This simplifying of the `commandsComplex` array is not
		// strictly required, but it's useful for debugging and
		// ensures that Discord only receives relevant info
		// when we register the commands.
		// We just need a name and description for each command,
		// when doing command registration.
		let commandsToRegister = commandsComplex.map((commandObj) => {
				return {
					name: commandObj.name,
					description: commandObj.description
				}
			});

		console.log("Commands to register:");
		console.log(JSON.stringify(commandsToRegister, null, 4));

		await rest.put(Routes.applicationCommands(CLIENT_ID as string), {
			body: commandsToRegister,
		});

		console.log("Successfully reloaded application (/) commands.");
	} catch (error) {
		console.error(error);
	}

	// Initialise the bot/app.
	const client = new Client({ intents: [GatewayIntentBits.Guilds] });

	// Discord bots use event-driven communication.
	// They must be online for anything to happen.

	// So, as a sanity-check: 
	// confirm that the bot has logged-in to Discord when the project is running.
	client.on(Events.ClientReady, (readyClient) => {
		console.log(`Logged in as ${readyClient.user.tag}!`);
	});

	// Here is the main juicy bit of the bot: interactions.
	// Whenever an interaction event happens, such as a user using a bot command,
	// this code should have an event listener ready and waiting for that event.
	client.on(Events.InteractionCreate, async (interaction) => {
		
		// Interaction events are actually a huge, broad type of event.
		// We want to make bot functionality based on chat commands, 
		// such as a user entering `/ping` into a server where this bot is listening.
		// So, if the event is not a chat input command, skip the rest of this code.
		if (!interaction.isChatInputCommand()) return;

		// If the event IS a chat input command, 
		// then we can start doing something with that.
		// We need to at least read the command as the first step.
		if (interaction.commandName === "ping") {
			// Send off a basic reply.
			await interaction.reply("Pong!");
			// Add a return for safety so we don't trigger any following code.
			return;
		}

		// Yes, this means we would need to do conditional logic 
		// for any command we want the bot to be able to do.
		// You could do if or if-else chains like the above ping command, sure.
		// Or you could do cases or other fancy logic to help keep code concise.
		let matchingCommand = commandsComplex.find((commandObj) => {
			return commandObj.name == interaction.commandName;
		});
		if (matchingCommand) {
			console.log(`Command activated: ${matchingCommand.name}`);
			let commandResult = await matchingCommand.operation();
			await interaction.reply(
				{
					content: commandResult.bodyTextContent || "",
					files: commandResult.attachmentFileUrls,
				}
			)
		}
	});

	client.login(TOKEN);
}

main();
