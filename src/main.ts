import { Plugin, WorkspaceLeaf, ViewCreator } from "obsidian";
import { obsidianExts } from "./helper";
import { PlaintextSettings, PlaintextSettingTab, DEFAULT_SETTINGS } from "./settings";
import PlaintextView from "./view";

/**
 * Plaintext plugin.
 *
 * This plugin allows you to edit specified extensions as plaintext files.
 * It does NOT check if a file is binary or textual!
 *
 * @author dbarenholz
 * @version 0.1.0
 */
export default class PlaintextPlugin extends Plugin {
  public settings: PlaintextSettings;

  /**
   * Code that runs (once) when plugin is loaded.
   */
  async onload(): Promise<void> {
    console.log("Obsidian Plaintext: loaded plugin.");

    // Load the settings
    await this.loadSettings();

    // Add settings tab
    this.addSettingTab(new PlaintextSettingTab(this.app, this));

    // Do the work
    this.processExts(this.settings.extensions);
  }

  /**
   * Code that runs (once) when the plugin is unloaded.
   */
  onunload(): void {
    console.log("Obsidian Plaintext: unloaded plugin.");
  }

  /**
   * Loads the settings.
   */
  async loadSettings(): Promise<void> {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  /**
   * Saves the settings.
   */
  async saveSettings(): Promise<void> {
    await this.saveData(this.settings);
  }

  /**
   * Creates a view for a plaintext file.
   * Plaintext views have <b>NO</b> syntax highlighting or other fancy features!
   *
   * @param leaf The leaf to create the view at
   * @param ext Plaintext extension
   * @returns Plaintext view
   */
  viewCreator: ViewCreator = (leaf: WorkspaceLeaf, ext?: string): PlaintextView => {
    return new PlaintextView(leaf, ext);
  };

  /**
   * Processes the extensions.
   *
   * @param exts extensions
   */
  processExts = (exts: string[]): void => {
    if (exts.length == 0) {
      console.log("Plaintext: No extensions to process.");
      return;
    }

    for (const ext of exts) {
      // Disallow using obsidian defaults
      if (ext in obsidianExts) {
        if (this.settings.debug) {
          console.log(`Plaintext: Extension '${ext}' is used by Obsidian already! Don't override Obsidian.`);
        }
      }

      // Try to register view
      try {
        this.registerView(ext, this.viewCreator);
      } catch {
        if (this.settings.debug) {
          console.log(`Plaintext: Extension '${ext}' already has a view registered, ignoring...`);
        }
      }

      // Try to register extension
      try {
        this.registerExtensions([ext], ext);
      } catch {
        if (this.settings.debug) {
          console.log(`Plaintext: Extension '${ext}' is already registered, ignoring...`);
        }
      }
    }
  };
}
