# Plaintext for Obsidian

This is an [Obisidan](https://obsidian.md) plugin that allows you to open _any_ file as plaintext. It has been developed for Obsidian **v0.13.14**, and tested on **Windows**.

Honestly, as long as you can run any Obsidian version you can _probably_ run this plugin as well. The only requirements are that we can register extensions (this existed in v0.12.12 for instance), and that the `viewRegistry` exists, which I'm assuming has been there since the beginning of Obsidian. But, this is all speculation!

**NOTE: There are other plugins that allow you to edit specific files. MAKE SURE TO NOT TYPE THEIR EXTENSIONS INTO THE SETTINGS FIELD FOR THIS PLUGIN. I cannot (yet) check for specific plugins that have their own view for a particular extension, and as such this plugin WILL overwrite the view, and break the other extension. If you do this by accident, open the plugin folder (`.obsidian/plugins/obsidian-plaintext/`), and remove from the `data.json` file the extensions that you typed by mistake.**

## Installing

Interested in editing files in Obsidian? Great. Grab the latest release from the [releases](#) page, and copy `main.js` and `manifest.json` to `.obsidian/plugins/obsidian-plaintext/`. That's it!

When approved, you can also install this through Obsidian by searching for **plaintext**.

## Roadmap

For now, nothing is planned. If you're interested in features, please make an issue on Github!

## Contributing

Happy to accept PRs on issues!

## Pricing

This is free. Keep your money, I don't want it.

## Changelog

**Version 0.2.0 (current)**:

- Long overdue: plugin is enabled for mobile!
- We have over 500 downloads!

**Version 0.1.0**:

- Complete rewrite of registering and deregistering.
- Now _actually_ removes views when deregistering a particular extension.
- Correctly filters out default obsidian extensions: No more accidentally overwriting the default markdown editor.

**Version 0.0.2**:

- First actual release.
- Code is functional! You can open and edit files as plaintext.

**Version 0.0.1**:

- Not a release.
- Initial testing code.
- This included the functionality for parsing user-inputted extensions.
