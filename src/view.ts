import CodeMirror from "codemirror";
import { TextFileView, WorkspaceLeaf } from "obsidian";

/**
 * The view used for plaintext files. Uses a CodeMirror 5 instance. 
 * Perhaps this can be updated to CodeMirror 6 in the future.
 *
 * @author dbarenholz
 * @version 0.1.0
 */
export default class PlaintextView extends TextFileView {
  // Internal codemirror instance
  public cm: CodeMirror.Editor;

  // Constructor
  constructor(leaf: WorkspaceLeaf) {
    // Call super
    super(leaf);

    // Create code mirror instance and add listener to it.
    this.cm = CodeMirror(this.contentEl);
    this.cm.on("changes", this.changed);
  }

  /**
   * Event handler for CodeMirror editor.
   * Requests a save.
   * 
   * @param _ unused
   * @param __  unused
   */
  changed = async (_: CodeMirror.Editor, __: CodeMirror.EditorChangeLinkedList[]): Promise<void> => {
    this.requestSave();
  };

  /**
   * Event handler for resizing a view.
   * Refreshes codemirror instance.
   */
  onResize(): void {
    this.cm.refresh();
  }

  /**
   * Getter for the data in the view.
   * Called when saving the contents.
   *
   * @returns The file contents as string.
   */
  getViewData = (): string => {
    return this.cm.getValue();
  };

  /**
   * Setter for the data in the view.
   * Called when loading file contents.
   *
   * If clear is set, then it means we're opening a completely different file.
   * In that case, you should call clear(), or implement a slightly more efficient
   * clearing mechanism given the new data to be set.
   *
   * @param data
   * @param clear
   */
  setViewData = (data: string, clear?: boolean): void => {
    if (clear) {
      this.cm.swapDoc(CodeMirror.Doc(data, "text/plain")); // everything is plaintext
    } else {
      this.cm.setValue(data);
    }
  };

  /**
   * Clears the current codemirror instance.
   */
  clear = (): void => {
    this.cm.setValue("");
    this.cm.clearHistory();
  };

  /**
   * Provides a boolean to indicate if a particular extension can be opened in this instance.
   * 
   * @param extension the extension to check
   * @returns `true` if `extension` is identical to `this.ext`, `false` otherwise.
   */
  canAcceptExtension(extension: string): boolean {
    return extension == this.file.extension;
  }

  /**
   * Returns the viewtype of this codemirror instance.
   * The viewtype is the extension of the file that is opened.
   * 
   * @returns The viewtype (file extension) of this codemirror instance.
   */
  getViewType(): string {
    return this.file ? this.file.extension : "text/plain (no file)";
  }

  /**
   * Returns a string indicating which file is currently open, if any.
   * If no file is open, returns that.
   * 
   * @returns A string indicating the opened file, if any.
   */
  getDisplayText(): string {
    return this.file ? this.file.basename : "text/plain (no file)";
  }
}
