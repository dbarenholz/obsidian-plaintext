import { App, Modal, Setting } from "obsidian";

/**
 * Modal to create a new Plaintext file.
 *
 * Code from here: https://github.com/GamerGirlandCo/obsidian-fountain-revived/blob/main/src/createModal.ts
 * Changes made according to https://marcus.se.net/obsidian-plugin-docs/examples/insert-link
 *
 * @version 0.3.0
 * @author dbarenholz
 */
export class CreateNewPlaintextFileModal extends Modal {
	filename: string;
	onSubmit: (filename: string) => void;

	constructor(
		app: App,
		defaultFilename: string,
		onSubmit: (result: string) => Promise<void>
	) {
		super(app);
		this.filename = defaultFilename;
		this.onSubmit = onSubmit;
	}

	onOpen() {
		const { contentEl } = this;
		contentEl.createEl("h3", { text: "New Plaintext File" });
		new Setting(contentEl)
			.setName("File Name (include extension!)")
			.addText((text) =>
				text.setValue(this.filename).onChange((value) => {
					this.filename = value;
				})
			);
		new Setting(contentEl).addButton((btn) =>
			btn
				.setButtonText("Create")
				.setCta()
				.onClick(() => this.createFile(this.filename))
		);
		contentEl.createEl("span", {
			text: "If you used the file browser, then the file will be created in the selected folder. If you used the command, it will be created in the main vault folder.",
		});

		// Listen to keyboard events
		contentEl.onkeydown = (e: KeyboardEvent) => {
			if (e.key === "Enter") this.createFile(this.filename);
			if (e.key === "Escape") this.close();
		};
	}

	createFile(filename: string) {
		this.onSubmit(filename);
		this.close();
	}

	onClose() {
		const { contentEl } = this;
		contentEl.empty();
	}
}
