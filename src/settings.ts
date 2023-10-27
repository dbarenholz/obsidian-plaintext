import PlaintextPlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";
import { removeObsidianExtensions, removeOtherExtensions } from "./helper";
import { PlaintextNotice } from "./notice";

/**
 * Plaintext plugin settings.
 *
 * Currently, there are only settings on whether to print debug prints to console,
 * and a list of extensions that should be considered plaintext.
 *
 * @version 0.3.0
 * @author dbarenholz
 */
export interface PlaintextSettings {
	// Whether or not you want to actively destroy other plugins by demolishing their views.
	overrideViewsFromOtherPlugins: boolean;

	// Extensions to be seen as plaintext documents.
	extensions: string[];
}

/**
 * The defaults:
 * * don't destroy other plugins
 * * no extensions to consider for the plaintext plugin.
 *
 * @version 0.3.0
 * @author dbarenholz
 */
export const DEFAULT_SETTINGS: PlaintextSettings = {
	overrideViewsFromOtherPlugins: false,
	extensions: [],
};

/**
 * Process the user-inputted extensions
 *
 * @param _this passes "this" because JS is stupid in anonymous functions.
 */
const processExts = async (_this: PlaintextSettingTab) => {
	// Get the currently enabled extensions from the plaintext plugin.
	let currentExtensionList = Array.from(_this.plugin.settings.extensions);
	currentExtensionList =
		currentExtensionList == null || currentExtensionList == undefined
			? []
			: Array.from(new Set(currentExtensionList));

	// Grab the set of new extensions
	let newExtensionList =
		_this.changes == null || _this.changes == undefined
			? []
			: _this.changes
					.split(",") // split on comma
					.map((s) => s.toLowerCase().trim()) // convert to lowercase and remove spaces
					.filter((s) => s != ""); // remove empty elements

	// Remove obsidian extensions from it
	newExtensionList = removeObsidianExtensions(newExtensionList);

	// If set to NOT destroy, remove other extensions
	if (!_this.plugin.settings.overrideViewsFromOtherPlugins) {
		newExtensionList = removeOtherExtensions(
			newExtensionList,
			_this.app.plugins.enabledPlugins
		);
	}

	// Find which extensions to add.
	const extensionsToAdd = newExtensionList.filter(
		(ext) => !currentExtensionList.includes(ext)
	);

	// Actually add the extensions
	_this.plugin.registerViewsForExtensions(extensionsToAdd);

	// Find which extensions to remove.
	const extensionsToRemove = currentExtensionList.filter(
		(ext) => !newExtensionList.includes(ext)
	);

	// Actually remove the extensions
	_this.plugin.deregisterViewsForExtensions(extensionsToRemove);

	// Save settings
	const updated_exts = currentExtensionList
		.concat(extensionsToAdd)
		.filter((ext) => !extensionsToRemove.includes(ext));

	_this.plugin.settings.extensions = updated_exts;
	await _this.plugin.saveSettings();

	// Communicate that extensions have been updated.
	new PlaintextNotice(
		_this.plugin,
		`Extensions updated to: ${_this.plugin.settings.extensions}`
	);
};

/**
 * The settings tab itself.
 *
 * @version 0.3.0
 * @author dbarenholz
 */
export class PlaintextSettingTab extends PluginSettingTab {
	// The plugin itself (cannot be private due to processExts method)
	plugin: PlaintextPlugin;

	// Changes made to the extension array (cannot be private due to processExts method)
	changes: string;

	// Constructor: Creates a settingtab for this plugin.
	constructor(app: App, plugin: PlaintextPlugin) {
		super(app, plugin);
		this.plugin = plugin;
		this.changes = "";
	}

	display(): void {
		// Retrieve the container element
		const { containerEl } = this;
		containerEl.empty();

		// Write the title of the settings page.
		containerEl.createEl("h2", { text: "Plaintext" });

		// Add deprecation message here too
		new Setting(containerEl)
			.setName("Notice")
			.setDesc(this.plugin.deprecationFragment());

		// Add extension setting
		new Setting(containerEl)
			.setName("Extensions")
			.setDesc(
				"List of extensions to interpret as plaintext, comma-separated." +
					" Will automatically convert to a set when reopening the Obsidian Plaintext settings window." +
					" Obsidian's default extensions and extensions other plugins use are filtered out by default!"
			)
			.addText((text) => {
				text.setPlaceholder("Extensions")
					.setValue(
						Array.from(this.plugin.settings.extensions).toString()
					)
					.onChange(
						(value) => (this.changes = value.toLowerCase().trim())
					);

				// Need to use anonymous function calling separate function
				text.inputEl.onblur = async () => {
					await processExts(this);
				};
			});

		// Add destroy setting
		new Setting(containerEl)
			.setName("Destroy Other Plugins")
			.setDesc(
				"There may be other plugins that already have registered extensions." +
					" By turning this setting ON, you willingly disregard those plugins, and will highly likely break them." +
					" **ONLY TURN THIS ON IF YOU KNOW WHAT YOU'RE DOING!**"
			)
			.addToggle((toggle) => {
				toggle.setValue(
					this.plugin.settings.overrideViewsFromOtherPlugins
				);
				toggle.onChange(async (destroy) => {
					this.plugin.settings.overrideViewsFromOtherPlugins =
						destroy;
					if (destroy) {
						new PlaintextNotice(
							this.plugin,
							"Happily overriding views made by other plugins.Are you really sure you want this?"
						);
					} else {
						new PlaintextNotice(
							this.plugin,
							"Disallow overrinding views made by other plugins. YOU NEED TO DISABLE AND RE-ENABLE PLUGINS!"
						);
					}
					await this.plugin.saveSettings();
				});
			});
	}
}
