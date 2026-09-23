import { App, PluginSettingTab, Setting } from "obsidian";
import type LinksPlugin from "./main";

export interface LinksSettings {
	sectionTitle: string;
	limit: number;
	refreshInterval: number;
}

export const DEFAULT_SETTINGS: LinksSettings = {
	sectionTitle: "Links",
	limit: 0,
	refreshInterval: 500,
};

export class LinksSettingTab extends PluginSettingTab {
	constructor(app: App, private plugin: LinksPlugin) {
		super(app, plugin);
	}

	display(): void {
		const { containerEl } = this;
		containerEl.empty();

		new Setting(containerEl)
			.setName("Section title")
			.setDesc("Heading shown above the backlinks and outlinks callouts.")
			.addText(t => t
				.setPlaceholder(DEFAULT_SETTINGS.sectionTitle)
				.setValue(this.plugin.settings.sectionTitle)
				.onChange(async v => {
					this.plugin.settings.sectionTitle = v || DEFAULT_SETTINGS.sectionTitle;
					await this.plugin.saveSettings();
					this.plugin.updateAllViews();
				}));

		new Setting(containerEl)
			.setName("Limit")
			.setDesc("Max entries per callout. Leave empty or 0 for no limit.")
			.addText(t => t
				.setPlaceholder("all")
				.setValue(this.plugin.settings.limit > 0 ? String(this.plugin.settings.limit) : "")
				.onChange(async v => {
					const n = parseInt(v, 10);
					this.plugin.settings.limit = (!v.trim() || isNaN(n) || n < 1) ? 0 : n;
					await this.plugin.saveSettings();
					this.plugin.updateAllViews();
				}));

		new Setting(containerEl)
			.setName("Refresh interval")
			.setDesc("Debounce delay in milliseconds for updates while editing.")
			.addText(t => t
				.setPlaceholder(String(DEFAULT_SETTINGS.refreshInterval))
				.setValue(String(this.plugin.settings.refreshInterval))
				.onChange(async v => {
					const n = parseInt(v, 10);
					this.plugin.settings.refreshInterval = isNaN(n) || n < 0 ? DEFAULT_SETTINGS.refreshInterval : n;
					await this.plugin.saveSettings();
				}));
	}
}
