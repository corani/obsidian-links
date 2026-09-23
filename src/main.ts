import { Plugin, MarkdownView } from "obsidian";
import { LinksSettings, DEFAULT_SETTINGS, LinksSettingTab } from "./settings";
import { updateView, removeFromView } from "./renderer";

export default class LinksPlugin extends Plugin {
	settings: LinksSettings = DEFAULT_SETTINGS;
	private debounceTimer: ReturnType<typeof setTimeout> | null = null;

	async onload() {
		await this.loadSettings();
		this.addSettingTab(new LinksSettingTab(this.app, this));

		const schedule = (delay = 100) => {
			if (this.debounceTimer) clearTimeout(this.debounceTimer);
			this.debounceTimer = setTimeout(() => this.updateAllViews(), delay);
		};

		this.registerEvent(this.app.workspace.on("layout-change", () => schedule()));
		this.registerEvent(this.app.workspace.on("active-leaf-change", () => schedule()));
		this.registerEvent(this.app.workspace.on("file-open", () => schedule()));
		this.registerEvent(this.app.metadataCache.on("changed", () => schedule()));
		this.registerEvent(this.app.workspace.on("editor-change", () => schedule(this.settings.refreshInterval)));

		this.app.workspace.onLayoutReady(() => schedule());
	}

	onunload() {
		if (this.debounceTimer) clearTimeout(this.debounceTimer);
		this.app.workspace.iterateAllLeaves(leaf => {
			if (leaf.view instanceof MarkdownView) removeFromView(leaf.view);
		});
	}

	updateAllViews() {
		this.app.workspace.iterateAllLeaves(leaf => {
			if (leaf.view instanceof MarkdownView) {
				updateView(this.app, leaf.view, this.settings, this);
			}
		});
	}

	async loadSettings() {
		this.settings = Object.assign({}, DEFAULT_SETTINGS, await this.loadData());
	}

	async saveSettings() {
		await this.saveData(this.settings);
	}
}
