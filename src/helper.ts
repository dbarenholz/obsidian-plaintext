/**
 * Extensions obsidian supports natively.
 * Taken from the help page: https://help.obsidian.md/Advanced+topics/Accepted+file+formats
 * 
 * @version 0.1.0
 * @author dbarenholz
 * @since 2021/12/26
 */
export const obsidianExts: Set<string> = new Set([
  "md",
  "png",
  "jpg",
  "jpeg",
  "gif",
  "bmp",
  "svg",
  "mp3",
  "webm",
  "wav",
  "m4a",
  "ogg",
  "3gp",
  "flac",
  "mp4",
  "webm",
  "ogv",
  "pdf",
]);

/**
 * Takes in a list of extensions, and removes extensions if they are present in the obsidianExts set.
 * 
 * @param exts  extensions to process
 * @returns All extensions in exts, except if they're present in obsidianExts.
 */
export const removeObsidianExtensions = (exts: string[]): string[] => {
  return exts.filter(ext => !obsidianExts.has(ext));
}

declare module 'obsidian' {
  interface App {
    viewRegistry: {
      unregisterView: CallableFunction // ƒ (e){delete this.viewByType[e]}
      unregisterExtensions: CallableFunction // ƒ (e){for(var t=0,n=e;t<n.length;t++){var i=n[t];delete this.typeByExtension[i]}this.trigger("extensions-updated")}
    }
  }
  interface View {
    file: {
      extension: string
    }
  }
}