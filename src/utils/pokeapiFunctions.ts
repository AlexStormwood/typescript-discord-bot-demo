import { OperationResultType } from "../commands";


export async function getRandomPokemon(): Promise<OperationResultType> {
	let randomNumberInPokedexRange = Math.floor(Math.random() * 1025) + 1;

	let apiResponse = await fetch("https://pokeapi.co/api/v2/pokemon/" + randomNumberInPokedexRange);
	let apiData = await apiResponse.json();

	return {
		bodyTextContent: apiData.name,
		attachmentFileUrls: [
			apiData.sprites.other.home.front_default
		]
	}
}