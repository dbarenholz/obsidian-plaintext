# Plaintext for Obsidian

**This plugin has been archived in favour of [better alternatives](obsidian://show-plugin?id=vscode-editor).**

This is an [Obisidan](https://obsidian.md) plugin that allows you to open _any_ file as plaintext.
It has been developed for Obsidian **v1.3.5**, and tested on **Windows**.

Honestly, as long as you can run any Obsidian version you can _probably_ run this plugin as well.
The only requirements are that we can register extensions (this existed in v0.12.12 for instance), and that the `viewRegistry` exists, which I'm assuming has been there since the beginning of Obsidian.
But, this is all speculation!

## Usage

Type your desired file formats into the extensions text field in the settings, then click outside of the text field and watch the magic happen.
Since 0.2.0 by default you can no longer accidentally break other plugins with views. Of course, if you desire, they will be breakable.

**For any version BEFORE 0.2.0: There are other plugins that allow you to edit specific files. MAKE SURE TO NOT TYPE THEIR EXTENSIONS INTO THE SETTINGS FIELD FOR THIS PLUGIN. I cannot (yet) check for specific plugins that have their own view for a particular extension, and as such this plugin WILL overwrite the view, and break the other extension. If you do this by accident, open the plugin folder (`.obsidian/plugins/obsidian-plaintext/`), and remove from the `data.json` file the extensions that you typed by mistake.**~~

## Installing

Interested in editing files in Obsidian? Great.
Grab the latest release from the [releases](https://github.com/dbarenholz/obsidian-plaintext/releases) page, and copy `main.js` and `manifest.json` to `.obsidian/plugins/obsidian-plaintext/`. That's it!

You can also install the plugin through Obsidian by searching for **plaintext**.

## Roadmap

For now, nothing is planned. If you're interested in features, please make an issue on Github!

## Contributing

Happy to accept PRs on issues!

## Pricing

This is free. Keep your money, I don't want it.

## Changelog

**Version 0.3.0 (current)**:

-  Rewrite to use CM6 in stead of CM5. A first step towards https://github.com/dbarenholz/obsidian-plaintext/issues/1.
-  Fixed https://github.com/dbarenholz/obsidian-plaintext/issues/5 by upgrading to CM6.
-  Fixed https://github.com/dbarenholz/obsidian-plaintext/issues/11 - shame on me for getting the logic wrong.
-  Possibly implement https://github.com/dbarenholz/obsidian-plaintext/issues/7? I don't have Obsidian on my phone, so let me know :).


**Version 0.2.0**:

-   Long overdue: plugin is enabled for mobile!
-   Extra protection: by default, extensions that other plugins add (such as .csv) are not allowed anymore!
-   We have over 500 downloads!

**Version 0.1.0**:

-   Complete rewrite of registering and deregistering.
-   Now _actually_ removes views when deregistering a particular extension.
-   Correctly filters out default obsidian extensions: No more accidentally overwriting the default markdown editor.

**Version 0.0.2**:

-   First actual release.
-   Code is functional! You can open and edit files as plaintext.

**Version 0.0.1**:

-   Not a release.
-   Initial testing code.
-   This included the functionality for parsing user-inputted extensions.
