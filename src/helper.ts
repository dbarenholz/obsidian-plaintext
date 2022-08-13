import PlaintextPlugin from "./main";

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
 * SVG icon used as button to create new plaintext file.
 */
export const plaintextFileButtonIcon = '<svg xmlns="http://www.w3.org/2000/svg" aria-hidden="true" role="img" width="1em" height="1em" preserveAspectRatio="xMidYMid meet" viewBox="0 0 1024 1024"><rect x="0" y="0" width="1024" height="1024" fill="none" stroke="none" /><path fill="currentColor" d="M854.6 288.6L639.4 73.4c-6-6-14.1-9.4-22.6-9.4H192c-17.7 0-32 14.3-32 32v832c0 17.7 14.3 32 32 32h640c17.7 0 32-14.3 32-32V311.3c0-8.5-3.4-16.7-9.4-22.7zM790.2 326H602V137.8L790.2 326zm1.8 562H232V136h302v216a42 42 0 0 0 42 42h216v494zM504 618H320c-4.4 0-8 3.6-8 8v48c0 4.4 3.6 8 8 8h184c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8zM312 490v48c0 4.4 3.6 8 8 8h384c4.4 0 8-3.6 8-8v-48c0-4.4-3.6-8-8-8H320c-4.4 0-8 3.6-8 8z"/></svg>'

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