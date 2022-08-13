import { Plugin, WorkspaceLeaf, ViewCreator } from "obsidian";
import { removeObsidianExtensions, removeOtherExtensions } from "./helper";
import { PlaintextSettings, PlaintextSettingTab, DEFAULT_SETTINGS } from "./settings";
import { PlaintextView } from "./view";

/**
 * Plaintext plugin.
 *
 * Allows you to edit files with specified extensions as if they are plaintext files.
 * There are _absolutely no_ checks to see whether or not you should actually do so. 
 * 
 * Use common sense, and don't edit `.exe` or similar binaries.
 *
 * @author dbarenholz
 * @version 0.2.0
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
   * Processes the list of extensions that the user inputs, and removes conflicting ones that should not be added.
   * 
   * @param exts Extensions that are about to be added.
   * @returns A finalised list of exts to add.
   */
  processConflictingExtensions = (exts: string[]): string[] => {
    exts = removeObsidianExtensions(exts)
    if (!this.settings.destroyOtherPlugins) {
      exts = removeOtherExtensions(exts)
    }
    return exts
  }

  /**
   * Registers extensions, and makes views for them.
   * 
   * @param exts The extensions to register and add views for.
   */
  addExtensions = (exts: string[]): void => {
    // Process extensions that may conflict with Obsidian or enabled plugins
    exts = this.processConflictingExtensions(exts)

    // Loop through extensions
    exts.forEach((ext) => {
      // Try to register view
      try {
        this.registerView(ext, this.viewCreator);
      } catch {
        console.log(`[Plaintext]: Extension '${ext}' already has a view registered, ignoring...`);
      }

      // Try to register extension
      try {
        // Note: viewtype is set to 'ext' here for possible future expansion to include syntax highlighting based on extension type.
        this.registerExtensions([ext], ext);
      } catch {
        console.log(`[Plaintext]: Extension '${ext}' is already registered, ignoring...`);
      }

      // DEBUG
      console.log(`[Plaintext]: added=${ext}`);
    })
  };

  /**
   * Deregisters extensions, and removes views made for them.
   * 
   * @param exts The extensions to deregister and remove views for.
   */
  removeExtensions = (exts: string[]): void => {
    // Process extensions that may conflict with Obsidian or enabled plugins
    exts = this.processConflictingExtensions(exts)

    // Try to deregister the views
    exts.forEach((ext) => {
      // Before unregistering the view: close active leaf if of type ext
      // Thank you Licat#1607: activeLeaf could be null here causing a crash => Replaced with getActiveViewOfType
      const view = this.app.workspace.getActiveViewOfType(PlaintextView)
      if (view && ext == view.getViewType()) {
        this.app.workspace.activeLeaf.detach();
      }

      try {
        this.app.viewRegistry.unregisterView(ext)
      } catch {
        console.log(`[Plaintext]: View for extension '${ext}' cannot be deregistered...`);

      }
    });

    // Try to deregister the extensions
    try {
      this.app.viewRegistry.unregisterExtensions(exts)
    } catch {
      console.log(`[Plaintext]: Cannot deregister extensions...`);

    }

    // DEBUG
    console.log(`[Plaintext]: removed=${exts}`);

  };

}
