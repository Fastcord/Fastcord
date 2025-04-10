import { after } from "spitroast";

export let socket: WebSocket;

type Message = {
	type: string;
	payload: unknown;
};

export const connectDebugger = async () => {
	if (socket !== undefined && socket.readyState !== WebSocket.CLOSED)
		socket.close();

	socket = new WebSocket("ws://192.168.31.134:8080");

	socket.addEventListener("open", () => {
		console.log("Debugger connected!");
	});

	socket.addEventListener("message", (message: MessageEvent<Message>) => {
		try {
			console.log("Received message:", message.data);
			switch (message.type) {
				case "evaluate": {
					const payload = message.data as { expression: string };
					const expression = payload.expression;

					// biome-ignore lint/security/noGlobalEval: This is a debugger and is not used in production code paths
					// biome-ignore lint/style/noCommaOperator: This is a debugger and is not used in production code paths
					(0, eval)(expression);
					return;
				}
				default: {
					console.log("Unknown packet type", message.type);
					return;
				}
			}
		} catch (e) {
			console.error(e);
		}
	});

	socket.addEventListener("error", (err: { message: string }) => {
		console.error(`Debugger error: ${err.message}`);
	});
};

export function patchLogs() {
	const unpatch = after("nativeLoggingHook", globalThis, (args) => {
		if (socket?.readyState === WebSocket.OPEN)
			socket.send(
				JSON.stringify({
					type: "log",
					payload: {
						message: args[0],
						level: args[1],
						timestamp: Date.now(),
					},
				}),
			);
	});

	return () => {
		socket?.close();
		unpatch();
	};
}
