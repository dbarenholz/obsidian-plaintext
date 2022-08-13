/**
 * Extensions obsidian supports natively.
 * Taken from the help page: https://help.obsidian.md/Advanced+topics/Accepted+file+formats
 * 
 * @version 0.2.0
 * @author dbarenholz
 * @since 2022/08/13
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
  "mov",
  "mkv",
  "pdf",
]);

/**
 * Takes in a list of extensions, and removes extensions if they are present in the obsidianExts set.
 * 
 * @param exts  extensions to process.
 * @returns All extensions in exts, except if they're present in obsidianExts.
 */
export const removeObsidianExtensions = (exts: string[]): string[] => {
  return exts.filter(ext => !obsidianExts.has(ext))
}

/**
 * Maps pluginIds to extensions that they use.
 * These extensions will be filtered out by default.
 * 
 * @version 0.2.0
 * @author dbarenholz
 * @since 2022/08/13
 */
export const otherExts: Map<string, string> = new Map([
  // https://github.com/deathau/cooklang-obsidian
  ["cooklang-obsidian", "cook"],
  // https://github.com/deathau/csv-obsidian
  ["csv-obsidian", "csv"],
  // https://github.com/caronchen/obsidian-chartsview-plugin
  ["obsidian-chartsview-plugin", "csv"],
  // https://github.com/Darakah/obsidian-fountain
  ["obsidian-fountain", "fountain"],
  // https://github.com/deathau/ini-obsidian
  ["ini-obsidian", "ini"],
  // https://github.com/deathau/txt-as-md-obsidian
  ["txt-as-md-obsidian", "txt"],
  // https://github.com/mkozhukharenko/mdx-as-md-obsidian
  ["mdx-as-md-obsidian", "mdx"],
  // https://github.com/ryanpcmcquen/obsidian-org-mode
  ["obsidian-org-mode", "org"],
  // https://github.com/tgrosinger/ledger-obsidian
  ["ledger-obsidian", "ledger"],
  // https://github.com/zsviczian/obsidian-excalidraw-plugin
  ["obsidian-excalidraw-plugin", "excalidraw"],
]);

// Helper to make removeOtherExtensions easier.
export const otherExtsSet: Set<string> = new Set(Array.from(otherExts.values()))

/**
 * Takes in a list of extensions, and removes extensions if they are present in the values of otherExts.
 * 
 * @param exts extensions to process.
 * @returns All extensions in exts, except if they're present in the values of otherExts.
 */
export const removeOtherExtensions = (exts: string[]): string[] => {
  return exts.filter(ext => !otherExtsSet.has(ext))
}

/**
 * Add typings for a better developer experience.
 */
declare module 'obsidian' {
  interface App {
    // Thank you javalent#3452 for suggestions on better typing
    viewRegistry: {
      unregisterView: (e: string) => void
      unregisterExtensions: (e: string[]) => void
    },
    plugins: {
      manifests: [{
        id: string
      }]
    }
  }

  interface View {
    file: {
      extension: string
    }
  }
}