import { OperationResultType } from "../commands";

export async function pongFunction(): Promise<OperationResultType> {
	return {
		bodyTextContent: "Pong!"
	};
};