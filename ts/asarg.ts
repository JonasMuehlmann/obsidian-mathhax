
import { TeX } from 'mathjax-full/ts/input/tex';
import { MathJax } from 'ts/bindings';

import { Macro } from 'mathjax-full/ts/input/tex/Symbol';
import { MacroMap as MacroMapT } from 'mathjax-full/ts/input/tex/SymbolMap';
import { ParseMethod } from 'mathjax-full/ts/input/tex/Types';
import TexError from 'mathjax-full/ts/input/tex/TexError';
import TexParser from 'mathjax-full/ts/input/tex/TexParser';
// import { ParseUtil } from 'mathjax-full/ts/input/tex/ParseUtil';
import ParseUtil from "mathjax-full/ts/input/tex/ParseUtil"
import { Configuration, CommandMap } from './bindings/input/tex';

let asargMethods: Record<string, ParseMethod> = {};

asargMethods.asarg = function (parser: TexParser, name: string) {
	let arg = ParseUtil.trimSpaces(parser.GetArgument(name));
	parser.string = ParseUtil.addArgs(parser, "\\" + arg, parser.string.slice(parser.i));
	parser.i = 0;
	ParseUtil.checkMaxMacros(parser);
} as ParseMethod;


new CommandMap("asargCmdMap", {
	asarg: "asarg",

}, asargMethods);

Configuration.create(
	'asarg', { handler: { macro: ["asargCmdMap"] } }
);
export function createAsargConfiguration(mjx: MathJax, settingsRef: any) {
	const inputJax = mjx.startup.input.first();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	inputJax.configuration.add('asarg', inputJax as unknown as TeX<any, any, any>, {})
}
