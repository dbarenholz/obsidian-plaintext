import PlaintextPlugin from "./main";
import { App, PluginSettingTab, Setting, ToggleComponent } from "obsidian";
import { obsidianExts, otherExts, otherExtsSet, removeObsidianExtensions, removeOtherExtensions } from "./helper";
import { nextTick } from "process";

/**
 * Plaintext plugin settings.
 * 
 * Currently, there are only settings on whether to print debug prints to console,
 * and a list of extensions that should be considered plaintext.
 *
 * @version 0.2.0
 * @author dbarenholz
 */
export interface PlaintextSettings {
  // Whether or not you want to actively destroy other plugins by demolishing their views.
  destroyOtherPlugins: boolean;

  // Extensions to be seen as plaintext documents.
  extensions: string[];
}

/**
 * The defaults: don't destroy other plugins, no extensions to consider for the plaintext plugin.
 *
 * @version 0.2.0
 * @author dbarenholz
 */
export const DEFAULT_SETTINGS: PlaintextSettings = {
  destroyOtherPlugins: false,
  extensions: [],
};

/**
 * Processes all extensions. 
 * @param _this the settings tab
 * 
 * @version 0.2.0
 * @author dbarenholz
 */
const processExts = async (_this: PlaintextSettingTab) => {
  // Get the currently enabled extensions from the plaintext plugin.
  let current_exts = Array.from(_this.plugin.settings.extensions);
  current_exts =
    current_exts == [] || current_exts == null || current_exts == undefined
      ? []
      : Array.from(new Set(current_exts));

  // DEBUG
  // console.log(`[Plaintext]: Current exts=${Array.from(_this.plugin.settings.extensions).toString()}`);

  // Grab the set of new extensions
  let new_exts = _this.changes == null || _this.changes == undefined ? [] : _this.changes
    .split(",") // split on comma
    .map((s) => s.toLowerCase().trim()) // convert to lowercase and remove spaces
    .filter((s) => s != "") // remove empty elements

  // Remove obsidian extensions from it
  new_exts = removeObsidianExtensions(new_exts)

  // If set to NOT destroy, remove other extensions
  if (!_this.plugin.settings.destroyOtherPlugins) {
    new_exts = removeOtherExtensions(new_exts)
  }

  // DEBUG
  // console.log(`[Plaintext]: New exts=${new_exts}`);

  // Find which extensions to add.
  let to_add = new_exts.filter(nExt => !current_exts.includes(nExt))

  // DEBUG
  // console.log(`[Plaintext]: add=${to_add}`);

  // Actually add the extensions
  _this.plugin.addExtensions(to_add)

  // Find which extensions to remove.
  let to_remove = current_exts.filter(cExt => !new_exts.includes(cExt))

  // DEBUG
  // console.log(`[Plaintext]: remove=${to_remove}`);

  // Actually remove the extensions
  _this.plugin.removeExtensions(to_remove)

  // Save settings
  const updated_exts = current_exts.concat(to_add).filter((ext) => !to_remove.includes(ext))
  _this.plugin.settings.extensions = updated_exts;
  await _this.plugin.saveSettings();

  // TODO: Somehow update visible extensions in settings
}

/**
 * The settings tab itself.
 *
 * @version 0.2.0
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
    this.changes = null;
  }

  display(): void {
    // Retrieve the container element
    let { containerEl } = this;
    containerEl.empty();

    // Write the title of the settings page.
    containerEl.createEl("h2", { text: "Plaintext" });

    // Add extension setting
    new Setting(containerEl)
      .setName("Extensions")
      .setDesc(
        "List of extensions to interpret as plaintext, comma-separated."
        + " Will automatically convert to a set when reopening the Obsidian Plaintext settings window."
        + " Obsidian's default extensions and extensions other plugins use are filtered out by default!"
      )
      .addText((text) => {
        text
          .setPlaceholder("Extensions")
          .setValue(Array.from(this.plugin.settings.extensions).toString())
          .onChange((value) => (this.changes = value.toLowerCase().trim()));


        // Need to use anonymous function calling separate function
        text.inputEl.onblur = async () => { await processExts(this) }
      });


    // Add destroy setting
    new Setting(containerEl)
      .setName("Destroy Other Plugins")
      .setDesc(
        "There may be other plugins that already have registered extensions."
        + " By turning this setting ON, you willingly disregard those plugins, and will highly likely break them."
        + " **ONLY TURN THIS ON IF YOU KNOW WHAT YOU'RE DOING!"
      ).addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.destroyOtherPlugins);
        toggle.onChange(async (destroy) => {
          this.plugin.settings.destroyOtherPlugins = destroy
          if (destroy) {
            console.log(`[Plaintext]: Happily destroying plugins.`);
          } else {
            console.log(`[Plaintext]: Protects your from destroying other plugins.`);
            // TODO: Somehow remove potentially created views, created by this plugin.
          }
          await this.plugin.saveSettings();
        })
      })

  }
}
