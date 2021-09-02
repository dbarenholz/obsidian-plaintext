import CodeMirror from "codemirror";
import { TextFileView, WorkspaceLeaf } from "obsidian";

/**
 * The view used for plaintext files.
 * Editing is facilitated with a codemirror instance, with minimal settings.
 *
 * @author dbarenholz
 * @version 0.0.2
 */
export default class PlaintextView extends TextFileView {
  // Internal codemirror instance
  codeMirror: CodeMirror.Editor;

  // Current file extension
  ext: string;

  // Constructor
  constructor(leaf: WorkspaceLeaf, ext: string) {
    // Call super
    super(leaf);

    // Create code mirror instance and add listener to it.
    // TODO: Check if this theme needs to be added or not
    // this.codeMirror = CodeMirror(this.contentEl, {
    //   theme: "obsidian",
    // });
    this.codeMirror = CodeMirror(this.contentEl);
    this.codeMirror.on("changes", this.changed);

    // Save extension
    this.ext = ext;
  }

  /**
   * Event handler for CodeMirror editor. Requests a save.
   * @param _ unused
   * @param __  unused
   */
  changed = async (_: CodeMirror.Editor, __: CodeMirror.EditorChangeLinkedList[]): Promise<void> => {
    this.requestSave();
  };

  /**
   * Event handler for resizing a view. Refreshes codemirror.
   */
  onResize(): void {
    this.codeMirror.refresh();
  }

  /**
   * Getter for the data in the view.
   * Called when saving the contents.
   *
   * @returns The file contents as string.
   */
  getViewData = (): string => {
    return this.codeMirror.getValue();
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
      // Hardcoded MIME type. Everything is plain text.
      this.codeMirror.swapDoc(CodeMirror.Doc(data, "text/plain"));
    } else {
      this.codeMirror.setValue(data);
    }
  };

  // Clearing this particular item is setting the value to an empty string
  clear = (): void => {
    this.codeMirror.setValue("");
    this.codeMirror.clearHistory();
  };

  // This method doesn't really do much for our usecase...
  canAcceptExtension(extension: string): boolean {
    return extension == this.ext;
  }

  // Returns the extension
  getViewType(): string {
    return this.ext;
  }

  // Returns the basename of the open file, or "plaintext" if it doesn't exist
  getDisplayText(): string {
    return this.file ? this.file.basename : "plaintext (no file)";
  }
}
