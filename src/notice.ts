import { Notice } from "obsidian";
import { craftLogMessage } from "./helper";
import PlaintextPlugin from "./main";

const DEFAULT_NOTICE_TIMEOUT_SECONDS = 5;

/**
 * A very simple notice.
 * Uses a helper function to craft a message, so that
 * the messages in the console and notices are consistent.
 *
 * @version 0.3.0
 * @author dbarenholz
 */
export class PlaintextNotice extends Notice {
	constructor(
		plugin: PlaintextPlugin,
		message: string | DocumentFragment,
		timeout = DEFAULT_NOTICE_TIMEOUT_SECONDS
	) {
		super(message, timeout * 1000);
		const msg = craftLogMessage(plugin, message);
		console.log(msg);
	}
}
