import { Plugin, App, PluginManifest } from 'obsidian';
import { createXparseConfiguration } from './xparse';
import { createCounterConfiguration } from './counters';
import { createForloopConfiguration } from './forloop';
import { createToggleConfiguration } from './toggles';
import { createAsargConfiguration } from './asarg';
import { MathJax } from './bindings';


export const MATH_HAX = 'mathhax';

export default class MathHaxPlugin extends Plugin {
	app: App;

	constructor(app: App, manifest: PluginManifest) {
		super(app, manifest);
		this.app = app;
	}

	loadPreamble(mjx: MathJax, preamble: String) {
		if (mjx.tex2chtml == undefined) {
			mjx.startup.ready = () => {
				mjx.startup.defaultReady();
				mjx.startup.input.forEach((conf) => { conf._parseOptions.options.maxBuffer = 20 * 1024; conf._parseOptions.options.maxMacros = 10000; });

				mjx.tex2chtml(preamble);
			};
		} else {
			mjx.tex2chtml(preamble);
			mjx.startup.input.forEach((conf) => { conf._parseOptions.options.maxBuffer = 20 * 1024; conf._parseOptions.options.maxMacros = 10000; });
		}
	}

	async onload() {
		const preamble = await this.app.vault.adapter.read("Meta/preamble.sty");

		this.app.workspace.onLayoutReady(() => {
			this.hijackMathJax(window.MathJax);
			this.loadPreamble(window.MathJax, preamble);
			console.log("MathHax Plugin was loaded!");
		});

	}

	private async hijackMathJax(mjx: MathJax) {
		await mjx.startup.promise;
		// Deactivate Safe mode because we want power!
		mjx.startup.output.factory.jax.document.safe.allow = {
			URLs: "safe",
			classes: "all",
			classIDs: "all",
			styles: "all"
		}

		// Inject custom macros
		this.injectCustomMacros(mjx);
	}


	/**
	 * Updates the `tagSide` option of MathJax.
	 * 
	 * @param mjx MathJax instance
	 */

	private injectCustomMacros(mjx: MathJax) {
		// create and register our macro-map

		const handlers = mjx.startup.input.first()?.configuration.handlers
		if (handlers === undefined) return // Input object hasn't been initialized

		createXparseConfiguration(mjx);
		createCounterConfiguration(mjx);
		createForloopConfiguration(mjx);
		createToggleConfiguration(mjx);
		createAsargConfiguration(mjx);
	}

	/**
	 * Called when the plugin is unloaded/disabled.
	 */
	onunload() {
		const mjx = window.MathJax;

		// Reactivate Safe mode
		mjx.startup.output.factory.jax.document.safe.allow = {
			URLs: "safe",
			classes: "safe",
			classIDs: "safe",
			styles: "safe"
		}
	}
}
