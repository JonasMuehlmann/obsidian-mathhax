import { ParseMethod } from 'mathjax-full/ts/input/tex/Types';
import { Configuration, CommandMap } from './bindings/input/tex';
import TexError from 'mathjax-full/ts/input/tex/TexError';
import TexParser from 'mathjax-full/ts/input/tex/TexParser';
import ParseUtil from "mathjax-full/ts/input/tex/ParseUtil"
import { MathJax } from 'ts/bindings';
import { TeX } from 'mathjax-full/ts/input/tex';

var loopMethods: Record<string, ParseMethod> = {};

//
//  Implements \forloop[step]{start}{stop}{ctr}{code}
//
loopMethods.FORLOOP = function (parser: TexParser, name: string) {
	var stepstr = ParseUtil.trimSpaces(parser.GetBrackets(name));
	var start = parseInt(ParseUtil.trimSpaces(parser.GetArgument(name)));
	var stop = parseInt(ParseUtil.trimSpaces(parser.GetArgument(name)));
	var ctr = ParseUtil.trimSpaces(parser.GetArgument(name));
	var code = ParseUtil.trimSpaces(parser.GetArgument(name));
	var step = 1;

	// may need to revisit this in MJv2.0 with new GetBrackets()
	// fixed by adding "stepstr &&" below, compatible with v1.1
	var added = "";
	if (stepstr && stepstr !== "") step = parseInt(stepstr);
	for (var i = start;
		i <= stop;
		i += step) {
		added += "\\setcounter{" + ctr + "}{" + i + "}";
		added += code;
	};
	parser.string = ParseUtil.addArgs(parser, added, parser.string.slice(parser.i));
	parser.i = 0;
	ParseUtil.checkMaxMacros(parser);
} as ParseMethod;

new CommandMap("forloopCmdMap", {
	forloop: 'FORLOOP',
},
	loopMethods);

Configuration.create(
	'forloop', { handler: { macro: ["forloopCmdMap"] } }
);
export function createForloopConfiguration(mjx: MathJax) {
	const inputJax = mjx.startup.input.first();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	inputJax.configuration.add('forloop', inputJax as unknown as TeX<any, any, any>, {})
}
