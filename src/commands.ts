import { getRandomPokemon } from "./utils/pokeapiFunctions";
import { pongFunction } from "./utils/pongFunctions";

// Basically the same as the original code from the Discord.js docs:
export const commandsSimple = [
	{
		name: "ping",
		description: "Replies with Pong!",
	},
];


// Now the real fun stuff begins:

// Declare a type for the wider app to work with;
// We will create an array of commands, 
// and all commands will have these properties:
export type CommandType = {
	name: string;
	description: string;
	operation: () => Promise<OperationResultType>;
}

// Commands do things. This type dictates
// the information and contents returned
// by each command.
export type OperationResultType = {
	bodyTextContent?: string;
	attachmentFileUrls?: string[];
}

// Put all of our custom complex pieces together:
// We have an array of commands,
// and we can consistently, reliably, and safely
// work with the data defined here.
export const commandsComplex: CommandType[] = [
	{
		name: "ping",
		description: "Replies with 'Pong!'",
		operation: pongFunction
	},
	{
		name: "randompokemon",
		description: "Retrieve a random Pokemon from PokeAPI.",
		operation: getRandomPokemon
	},
];




