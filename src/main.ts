import {
	Plugin,
	WorkspaceLeaf,
	TFolder,
	TAbstractFile,
	normalizePath,
} from "obsidian";
import {
	removeObsidianExtensions,
	removeOtherExtensions,
	craftLogMessage,
} from "./helper";
import {
	PlaintextSettings,
	PlaintextSettingTab,
	DEFAULT_SETTINGS,
} from "./settings";
import { PlaintextView } from "./view";
import { CreateNewPlaintextFileModal } from "./modal";

/**
 * Plaintext plugin.
 *
 * Allows you to edit files with specified extensions as if they are plaintext files.
 * There are a few checks to see whether or not you should actually do so:
 * 1. Default obsidian extensions are automatically filtered out.
 * 2. By default, extensions that other plugins use (e.g. csv or fountain) are filtered out.
 *    There's an option to "override" the views that those other plugins make
 *    in case you prefer to use the PlaintextView.
 *
 * There are NO checks to see if the file you wish to edit is actually a plaintext file.
 * Use common sense, and don't edit obviously non-plaintext files.
 *
 * @author dbarenholz
 * @version 0.3.0
 */
export default class PlaintextPlugin extends Plugin {
	public settings: PlaintextSettings;

	async onload(): Promise<void> {
		console.log(craftLogMessage(this, "loaded plugin"));

		// 1. Load Settings
		await this.loadSettings();
		this.addSettingTab(new PlaintextSettingTab(this.app, this));

		// 2. Add commands; automatically cleaned up
		this.addCommand({
			id: "new-plaintext-file",
			name: "Create new plaintext file",
			callback: () => {
				this.createNewFile(app.vault.getRoot());
			},
		});

		// 3. Add events; automatically cleaned up
		this.registerEvent(
			this.app.workspace.on("file-menu", (menu, file) => {
				// But not if clicked on folder
				if (!(file instanceof TFolder)) {
					return;
				}
				menu.addItem((item) => {
					item.setTitle("New plaintext file")
						.setIcon("file-plus")
						.onClick(async () => this.createNewFile(file));
				});
			})
		);

		// 4. Other initialization
		this.registerViewsForExtensions(this.settings.extensions);
	}

	onunload(): void {
		this.deregisterViewsForExtensions(this.settings.extensions);
		console.log(craftLogMessage(this, "unloaded plugin"));
	}

	async loadSettings(): Promise<void> {
		this.settings = Object.assign(
			{},
			DEFAULT_SETTINGS,
			await this.loadData()
		);
	}

	async saveSettings(): Promise<void> {
		await this.saveData(this.settings);
	}

	removeConflictingExtensions = (exts: string[]): string[] => {
		// Remove default obisidian extensions from list
		exts = removeObsidianExtensions(exts);

		// If we are not destroying other plugins
		if (!this.settings.overrideViewsFromOtherPlugins) {
			// Then also remove those extensions
			exts = removeOtherExtensions(exts, app.plugins.enabledPlugins);
		}
		return exts;
	};

	viewCreator = (leaf: WorkspaceLeaf) => new PlaintextView(leaf);

	registerViewsForExtensions = (exts: string[]): void => {
		exts = this.removeConflictingExtensions(exts);

		exts.forEach((ext) => {
			// Try to register view
			try {
				this.registerView(`${ext}-view`, this.viewCreator);
			} catch {
				console.log(
					craftLogMessage(
						this,
						`Extension '${ext}' already has a view registered, ignoring...`
					)
				);
			}

			// Try to register extension
			try {
				this.registerExtensions([ext], `${ext}-view`);
			} catch {
				console.log(
					craftLogMessage(
						this,
						`Extension '${ext}' is already registered`
					)
				);
				if (this.settings.overrideViewsFromOtherPlugins) {
					console.log(
						craftLogMessage(
							this,
							`Attempting to override '${ext}'.`
						)
					);
					try {
						// deregister the thing
						this.app.viewRegistry.unregisterExtensions(exts);
						// then register for myself
						this.registerExtensions([ext], `${ext}-view`);
					} catch {
						console.log(
							craftLogMessage(
								this,
								`Could not override '${ext}'; did not register!`
							)
						);
					}
				}
			}

			// DEBUG
			console.log(craftLogMessage(this, `added=${ext}`));
		});
	};

	deregisterViewsForExtensions = (exts: string[]): void => {
		// Only do work if there is work
		if (exts.length == 0) {
			return;
		}

		exts = this.removeConflictingExtensions(exts);

		exts.forEach((ext) => {
			// Before unregistering the view: close active leaf if of type ext
			// Thank you Licat#1607: activeLeaf could be null here causing a crash => Replaced with getActiveViewOfType
			const view = this.app.workspace.getActiveViewOfType(PlaintextView);
			if (view) {
				view.leaf.detach();
			}

			try {
				this.app.viewRegistry.unregisterView(`${ext}-view`);
			} catch {
				console.log(
					craftLogMessage(
						this,
						`View for extension '${ext}' cannot be deregistered...`
					)
				);
			}
		});

		// Try to deregister the extensions
		try {
			this.app.viewRegistry.unregisterExtensions(exts);
		} catch {
			console.log(
				craftLogMessage(this, `Cannot deregister extensions...`)
			);
		}

		// DEBUG
		console.log(craftLogMessage(this, `removed=${exts}`));
	};

	createNewFile = async (file: TAbstractFile): Promise<void> => {
		console.log(craftLogMessage(this, "Create new plaintext file"));

		new CreateNewPlaintextFileModal(
			this.app,
			"plaintext file.txt",
			async (res) => {
				// Retrieve filename from user input
				const filename = normalizePath(`${file.path}/${res}`);

				// Create TFile from it
				let newFile = null;

				try {
					newFile = await this.app.vault.create(filename, "");
				} catch {
					console.log(craftLogMessage(this, "File already exists"));
					return;
				}

				// Create a new leaf
				const newLeaf = this.app.workspace.getLeaf(true);

				// Set the type
				await newLeaf.setViewState({ type: "text/plain" });

				// Focus it
				await newLeaf.openFile(newFile);
			}
		).open();
	};
}
