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

  loadPreamble(mjx, preamble) {
        mjx.startup.input.forEach((conf) => {
          conf._parseOptions.options.maxBuffer = 20 * 1024;
          conf._parseOptions.options.maxMacros = 1e4;
        });
  }
  async onload() {
      var mjx = window.MathJax;
      const preamble = await this.app.vault.adapter.read("Meta/preamble.sty");
      await mjx.startup.promise;
      mjx.startup.document.safe.allow = {
      // mjx.startup.output.factory.jax.document.safe.allow = {
		URLs: "safe",
		classes: "all",
		classIDs: "all",
		styles: "all"
      };
      this.injectCustomMacros(mjx);
  	  console.log("MathHax Plugin was loaded!");
      this.loadPreamble(preamble);
	  console.log("Preamble loaded");
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
