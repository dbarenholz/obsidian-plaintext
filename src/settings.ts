import PlaintextPlugin from "./main";
import { App, PluginSettingTab, Setting } from "obsidian";

/**
 * Possible settings for the plaintext plugin.
 *
 * @version 0.0.1
 * @author dbarenholz
 */
export interface PlaintextSettings {
  // Whether or not to print debug prints.
  debug: boolean;

  // Extensions to be seen as plaintext documents.
  extensions: string[];
}

/**
 * Default settings.
 *
 * @version 0.0.1
 * @author dbarenholz
 */
export const DEFAULT_SETTINGS: PlaintextSettings = {
  debug: false,
  extensions: [],
};

/**
 * The settings tab itself.
 *
 * @version 0.0.1
 * @author dbarenholz
 */
export class PlaintextSettingTab extends PluginSettingTab {
  plugin: PlaintextPlugin;
  changes: string;

  constructor(app: App, plugin: PlaintextPlugin) {
    super(app, plugin);
    this.plugin = plugin;
    this.changes = null;
  }

  display(): void {
    let { containerEl } = this;

    containerEl.empty();

    containerEl.createEl("h2", { text: "Obsidian Plaintext" });

    // Debug settings
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

    // Extension settings
    new Setting(containerEl)
      .setName("Plaintext Extensions")
      .setDesc(
        "List of extensions to interpret as plaintext, comma-separated. Will automatically convert to a set when reopening the Obsidian Plaintext settings window"
      )
      .addText((text) => {
        text
          .setPlaceholder("Extensions")
          .setValue(Array.from(this.plugin.settings.extensions).toString())
          .onChange((value) => (this.changes = value.toLowerCase().trim()));

        text.inputEl.onblur = async () => {
          // Grab set of saved extensions
          let current_exts = Array.from(this.plugin.settings.extensions);
          current_exts =
            current_exts == [] || current_exts == null || current_exts == undefined
              ? []
              : Array.from(new Set(current_exts));

          if (this.plugin.settings.debug) {
            console.log(`Current exts: ${Array.from(this.plugin.settings.extensions).toString()}`);
          }

          // Grab set of new extensions
          let new_exts = this.changes
            .split(",") // split on comma
            .map((s) => s.toLowerCase().trim()) // convert to lowercase and remove spaces
            .filter((s) => s != ""); // remove empty elements

          // Set-ify
          new_exts = Array.from(new Set(new_exts));

          if (this.plugin.settings.debug) {
            console.log(`New exts: ${new_exts}`);
          }

          // Extensions that should be added
          let to_add: string[] = [];

          new_exts.forEach((nExt) => {
            // New is also present in current -- no change
            if (current_exts.includes(nExt)) {
              // do nothing
            } else {
              // New is NOT present in current -- ADD!
              to_add.push(nExt);
            }
          });

          if (this.plugin.settings.debug) {
            console.log(`To add: ${to_add}`);
          }

          // Extensions that should be removed
          let to_remove: string[] = [];

          current_exts.forEach((cExt) => {
            // Current is also present in new -- no change
            if (new_exts.includes(cExt)) {
              // do nothing
            } else {
              // Current is NOT present in new -- REMOVE!
              to_remove.push(cExt);
            }
          });

          if (this.plugin.settings.debug) {
            console.log(`To remove: ${to_remove}`);
          }

          // Actually add the extensions
          to_add.forEach((nExt) => {
            current_exts.push(nExt);

            if (this.plugin.settings.debug) {
              console.log(`Added: ${nExt}`);
            }
          });

          // Actually remove the extensions
          to_remove.forEach((cExt) => {
            current_exts.remove(cExt);

            if (this.plugin.settings.debug) {
              console.log(`Removed: ${cExt}`);
            }
          });

          // Save settings
          this.plugin.settings.extensions = current_exts;
          await this.plugin.saveSettings();
        };
      });
    // .addButton((button) => {
    //   button
    //     .setButtonText("Update")
    //     .setTooltip("Updates the extensions")
    //     .onClick(async () => {
    //       // If changes are null, do nothing
    //       if (this.changes == null && this.plugin.settings.debug) {
    //         console.log("Obsidian Plaintext: No changes made.");
    //         await this.plugin.saveSettings();
    //         return;
    //       }

    // });
  }
}
