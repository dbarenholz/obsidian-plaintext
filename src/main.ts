// TODO: Do I need a custom view type?
// import { VIEW_TYPE_PLAINTEXT } from "constants";
import { Plugin, WorkspaceLeaf } from "obsidian";
import { PlaintextSettings, PlaintextSettingTab, DEFAULT_SETTINGS } from "./settings";
import PlaintextView from "./view";

/**
 * The plugin class, extends Obsidian Plugin.
 *
 * @author dbarenholz
 */
export default class PlaintextPlugin extends Plugin {
  public settings: PlaintextSettings;
  private view: PlaintextView;

  async onload() {
    console.log("Obsidian Plaintext: loaded plugin.");

    await this.loadSettings();

    this.addSettingTab(new PlaintextSettingTab(this.app, this));

    // Adds an item to the status bar (bottom row of the screen)
    // TODO: When editing a file in plaintext mode, add item stating "editing plaintext"
    // this.addStatusBarItem().setText("Plain Text");

    // Stuff for editor
    // this.registerCodeMirror((cm: CodeMirror.Editor) => {
    //   console.log("codemirror", cm);
    // });

    // TODO: Do I need this? If so, how does it work?
    // this.registerView(VIEW_TYPE_PLAINTEXT, (leaf: WorkspaceLeaf) => (this.view = new PlaintextView(leaf)));

    // Relevant items have class: nav-file-title is-unsupported
    const items = document.getElementsByClassName("nav-file-title is-unsupported");
    const numItems = items.length;
    for (let i = 0; i < numItems; i++) {
      const thing = items.item(i) as HTMLElement;
      this.registerDomEvent(thing, "click", (evt: MouseEvent) => {
        // TODO: Test if this prevents defaukt behaviour
        evt.stopImmediatePropagation();
        // TODO: Open the actual file
        console.log("TODO: Open the file.");

        // TODO: Do I need a custom leaf type?
        this.app.workspace.createLeafBySplit(null, "vertical", false);
      });
    }
  }

  onunload() {
    console.log("Obsidian Plaintext: unloaded plugin.");
  }

  async loadSettings() {
    this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
  }

  async saveSettings() {
    await this.saveData(this.settings);
  }
}
