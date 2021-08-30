import { ItemView, WorkspaceLeaf } from "obsidian";
import { VIEW_TYPE_PLAINTEXT } from "./constants";

export default class PlaintextView extends ItemView {
  getViewType(): string {
    return VIEW_TYPE_PLAINTEXT;
  }

  getDisplayText(): string {
    throw new Error("Method not implemented.");
  }

  constructor(leaf: WorkspaceLeaf) {
    super(leaf);
  }
}
