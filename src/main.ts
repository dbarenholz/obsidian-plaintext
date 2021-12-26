import { Plugin, WorkspaceLeaf, ViewCreator } from "obsidian";
import { removeObsidianExtensions } from "./helper";
import { PlaintextSettings, PlaintextSettingTab, DEFAULT_SETTINGS } from "./settings";
import PlaintextView from "./view";

/**
 * Plaintext plugin.
 *
 * Allows you to edit files with specified extensions as if they are plaintext files.
 * There are _absolutely no_ checks to see whether or not you should actually do so. 
 * 
 * Use common sense, and don't edit `.exe` or similar binaries.
 *
 * @author dbarenholz
 * @version 0.1.0
 */
export default class PlaintextPlugin extends Plugin {
  // The settings of the plugin.
  public settings: PlaintextSettings;

  /**
   * Code that runs (once) when plugin is loaded.
   */
  async onload(): Promise<void> {
    console.log("[Plaintext]: loaded plugin.");

    // Load the settings
    await this.loadSettings();

    // Add settings tab
    this.addSettingTab(new PlaintextSettingTab(this.app, this));

    // Add extensions that we need to add.
    this.addExtensions(this.settings.extensions);
  }

  /**
   * Code that runs (once) when the plugin is unloaded.
   */
  onunload(): void {
    // cleanup
    this.removeExtensions(this.settings.extensions);
    console.log("[Plaintext]: unloaded plugin.");
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
   *
   * @param leaf The leaf to create the view at
   * @returns Plaintext view
   */
  viewCreator: ViewCreator = (leaf: WorkspaceLeaf): PlaintextView => {
    return new PlaintextView(leaf);
  };

  /**
   * Registers extensions, and makes views for them.
   * 
   * @param exts The extensions to register and add views for.
   */
  addExtensions = (exts: string[]): void => {
    // Remove obsidian exts just in case
    exts = removeObsidianExtensions(exts)

    // Loop through extensions
    exts.forEach((ext) => {
      // Try to register view
      try {
        this.registerView(ext, this.viewCreator);
      } catch {
        if (this.settings.debug) {
          console.log(`[Plaintext]: Extension '${ext}' already has a view registered, ignoring...`);
        }
      }

      // Try to register extension
      try {
        // Note: viewtype is set to 'ext' here for possible future expansion to include syntax highlighting based on extension type.
        this.registerExtensions([ext], ext);
      } catch {
        if (this.settings.debug) {
          console.log(`[Plaintext]: Extension '${ext}' is already registered, ignoring...`);
        }
      }

      // Logging
      if (this.settings.debug) {
        console.log(`[Plaintext]: added=${ext}`);
      }
    })
  };

  /**
   * Deregisters extensions, and removes views made for them.
   * 
   * @param exts The extensions to deregister and remove views for.
   */
  removeExtensions = (exts: string[]): void => {
    // Remove obsidian exts just in case
    exts = removeObsidianExtensions(exts)

    // Try to deregister the views
    exts.forEach((ext) => {
      // Before unregistering the view: close active leaf if of type ext
      if (ext == this.app.workspace.activeLeaf.view.getViewType()) {
        this.app.workspace.activeLeaf.detach();
      }

      try {
        this.app.viewRegistry.unregisterView(ext)
      } catch {
        if (this.settings.debug) {
          console.log(`[Plaintext]: View for extension '${ext}' cannot be deregistered...`);
        }
      }
    });

    // Try to deregister the extensions
    try {
      this.app.viewRegistry.unregisterExtensions(exts)
    } catch {
      if (this.settings.debug) {
        console.log(`[Plaintext]: Cannot deregister extensions...`);
      }
    }

    // Logging
    if (this.settings.debug) {
      console.log(`[Plaintext]: removed=${exts}`);
    }
  };
}
