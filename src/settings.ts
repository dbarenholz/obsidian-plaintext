import PlaintextPlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";
import { removeObsidianExtensions } from "./helper";
import { nextTick } from "process";

/**
 * Plaintext plugin settings.
 * 
 * Currently, there are only settings on whether to print debug prints to console,
 * and a list of extensions that should be considered plaintext.
 *
 * @version 0.1.0
 * @author dbarenholz
 */
export interface PlaintextSettings {
  // Whether or not to print debug prints.
  debug: boolean;

  // Extensions to be seen as plaintext documents.
  extensions: string[];
}

/**
 * The defaults: no debugging, and no extensions to consider for the plaintext plugin.
 *
 * @version 0.1.0
 * @author dbarenholz
 */
export const DEFAULT_SETTINGS: PlaintextSettings = {
  debug: false,
  extensions: [],
};

/**
 * The settings tab itself.
 *
 * @version 0.1.0
 * @author dbarenholz
 */
export class PlaintextSettingTab extends PluginSettingTab {
  // The plugin itself
  private plugin: PlaintextPlugin;

  // Changes made to the extension array
  private changes: string;

  // Constructor: Creates a settingtab for this plugin.
  constructor(app: App, plugin: PlaintextPlugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.changes = null;
  }
  /**
   * The method called to display the settingtab.
   */
  display(): void {
    // Retrieve the container element
    let { containerEl } = this;
    containerEl.empty();

    // Write the title of the settings page.
    containerEl.createEl("h2", { text: "Plaintext" });

    // Add debug setting
    new Setting(containerEl)
      .setName("Debug")
      .setDesc("Turn on for debug prints in console.")
      .addToggle((toggle) => {
        toggle.setValue(this.plugin.settings.debug);
        toggle.onChange(async (debug) => {
          this.plugin.settings.debug = debug;
          console.log(`Obsidian Plaintext: Set debug to ${debug}`);
          await this.plugin.saveSettings();
        });
      });

    // Add extension setting
    new Setting(containerEl)
      .setName("Extensions")
      .setDesc(
        "List of extensions to interpret as plaintext, comma-separated."
        + " Will automatically convert to a set when reopening the Obsidian Plaintext settings window."
        + " Obsidian's default extensions are filtered out!"
      )
      .addText((text) => {
        text
          .setPlaceholder("Extensions")
          .setValue(Array.from(this.plugin.settings.extensions).toString())
          .onChange((value) => (this.changes = value.toLowerCase().trim()));


        // Can't seem to set to a separate function due to incorrect `this`
        text.inputEl.onblur = async () => {
          // Get the currently enabled extensions from the plaintext plugin.
          let current_exts = Array.from(this.plugin.settings.extensions);
          current_exts =
            current_exts == [] || current_exts == null || current_exts == undefined
              ? []
              : Array.from(new Set(current_exts));

          if (this.plugin.settings.debug) {
            console.log(`[Plaintext]: Current exts=${Array.from(this.plugin.settings.extensions).toString()}`);
          }

          // Grab the set of new extensions
          let new_exts = this.changes == null || this.changes == undefined ? [] : removeObsidianExtensions(this.changes
            .split(",") // split on comma
            .map((s) => s.toLowerCase().trim()) // convert to lowercase and remove spaces
            .filter((s) => s != "")); // remove empty elements

          if (this.plugin.settings.debug) {
            console.log(`[Plaintext]: New exts=${new_exts}`);
          }

          // Find which extensions to add.
          let to_add = new_exts.filter(nExt => !current_exts.includes(nExt))

          if (this.plugin.settings.debug) {
            console.log(`[Plaintext]: add=${to_add}`);
          }

          // Actually add the extensions
          this.plugin.addExtensions(to_add)

          // Find which extensions to remove.
          let to_remove = current_exts.filter(cExt => !new_exts.includes(cExt))

          if (this.plugin.settings.debug) {
            console.log(`[Plaintext]: remove=${to_remove}`);
          }

          // Actually remove the extensions
          this.plugin.removeExtensions(to_remove)

          // Save settings
          const updated_exts = current_exts.concat(to_add).filter((ext) => !to_remove.includes(ext))
          this.plugin.settings.extensions = updated_exts;
          await this.plugin.saveSettings();
        }
      });
  }
}
