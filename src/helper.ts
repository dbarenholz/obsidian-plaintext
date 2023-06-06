import PlaintextPlugin from "./main";

/**
 * Extensions obsidian supports natively.
 * Taken from the help page: https://help.obsidian.md/Advanced+topics/Accepted+file+formats
 *
 * @author dbarenholz
 * @version 0.3.0
 *
 * @since 2023/06/01
 */
export const OBSIDIAN_EXTENSIONS: Set<string> = new Set([
	"md",

	"png",
	"webp",
	"jpg",
	"jpeg",
	"gif",
	"bmp",
	"svg",

	"mp3",
	"webm",
	"wav",
	"m4a",
	"ogg",
	"3gp",
	"flac",

	"mp4",
	"webm",
	"ogv",
	"mov",
	"mkv",

	"pdf",
]);

/**
 * Maps pluginIds to extensions that they use.
 * These extensions will be filtered out by default.
 *
 * @author dbarenholz
 * @version 0.3.0
 *
 * @since 2022/08/13
 */
export const PROBLEMATIC_PLUGINS: Map<string, string> = new Map([
	// https://github.com/deathau/cooklang-obsidian
	["cooklang-obsidian", "cook"],
	// https://github.com/deathau/csv-obsidian
	["csv-obsidian", "csv"],
	// https://github.com/caronchen/obsidian-chartsview-plugin
	["obsidian-chartsview-plugin", "csv"],
	// https://github.com/Darakah/obsidian-fountain
	["obsidian-fountain", "fountain"],
	// https://github.com/deathau/ini-obsidian
	["ini-obsidian", "ini"],
	// https://github.com/deathau/txt-as-md-obsidian
	["txt-as-md-obsidian", "txt"],
	// https://github.com/mkozhukharenko/mdx-as-md-obsidian
	["mdx-as-md-obsidian", "mdx"],
	// https://github.com/ryanpcmcquen/obsidian-org-mode
	["obsidian-org-mode", "org"],
	// https://github.com/tgrosinger/ledger-obsidian
	["ledger-obsidian", "ledger"],
	// https://github.com/zsviczian/obsidian-excalidraw-plugin
	["obsidian-excalidraw-plugin", "excalidraw"],
]);

export const removeObsidianExtensions = (exts: string[]): string[] => {
	return exts.filter((ext) => !OBSIDIAN_EXTENSIONS.has(ext));
};

/**
 * Remove extensions registered by other plugins
 *
 * @param exts current list of extensions (unfiltered)
 * @param enabledPlugins set of enabled plugins (app.plugins.enabledPlugins)
 * @returns list of extensions without those used by any other enabled plugin
 */
export const removeOtherExtensions = (
	exts: string[],
	enabledPlugins: Set<string>
): string[] => {
	for (const enabledPlugin of enabledPlugins) {
		// Grab the extension to remove if it exists
		const extToRemove = PROBLEMATIC_PLUGINS.has(enabledPlugin)
			? PROBLEMATIC_PLUGINS.get(enabledPlugin)
			: null;
		// Remove if it exists
		if (extToRemove) {
			exts = exts.filter((ext) => ext !== extToRemove);
		}
	}

	return exts;
};

export const craftLogMessage = (
	plugin: PlaintextPlugin,
	message: string | DocumentFragment
): string => {
	const VERSION = plugin.manifest.version;
	return `[Plaintext v${VERSION}]:  ${message}`;
};

/**
 * Add typings for a better developer experience.
 */
declare module "obsidian" {
	interface App {
		// Thank you javalent#3452 for suggestions on better typing
		viewRegistry: {
			unregisterView: (e: string) => void;
			unregisterExtensions: (e: string[]) => void;
		};
		plugins: {
			manifests: [
				{
					id: string;
				}
			];
			enabledPlugins: Set<string>;
		};
	}

	interface View {
		file: {
			basename: string;
			extension: string;
		};
	}
}
