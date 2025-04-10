/**
 * Initializer Module
 * Responsible for initializing the Fastcord application
 */

import { version } from "fastcord-build-info";
import { connectDebugger, patchLogs } from "../debugger";
import { getRegisteredApp } from "./appRegistry";

/**
 * Initialize the Fastcord application
 * Executes the registered app function and handles any errors
 */
export async function initializeFastcord(): Promise<void> {
	try {
		if (window.__DEV__) {
			await connectDebugger();
			patchLogs();
		}

		const appFunction = getRegisteredApp();
		await appFunction();
	} catch (e: unknown) {
		const stack = e instanceof Error ? e.stack : undefined;
		console.error(e, stack);
		alert(
			"An error occurred while initializing Fastcord. Check the console for more information.",
		);
	}
}
