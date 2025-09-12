/****************************************************
 *
 *  toggles.js
 *  
 *  Implements LaTeX counters and related macros for MathJax.
 * 
 *  Macros implemented:
 *    \newtoggle{name}
 *    \providetoggle{name}
 *    \settoggle{name}{value}
 *    \toggletrue{name}
 *    \togglefalse{name}
 *    \iftoggle{name}{math}{math}
 *    \nottoggle{name}{math}{math}
 *
 *  Be sure to change the loadComplete() address to the URL
 *  of the location of this file on your server. 
 *  
 *  You can load it via the config=file parameter on the script
 *  tag that loads MathJax.js, or by including it in the extensions
 *  array in your configuration.
 *  
 */
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

let toggleMethods: Record<string, ParseMethod> = {};
var togglearray: Record<string, boolean> = {};


// Note:  the next 4 macros are nearly identical --
// implementation works out this way because of how Javascript
// manages associative arrays

//
//  Implements \newtoggle{name}
//
toggleMethods.NEWTOGGLE_toggles = function (parser: TexParser, name: string) {
	var cn = ParseUtil.trimSpaces(parser.GetArgument(name));
	if (cn.charAt(0) === "\\") { cn = cn.substr(1) }
	if (!cn.match(/^(.|[a-z]+)$/i)) { throw new TexError("IllegalToggleName", "Illegal toggle name for " + name) }
	togglearray[cn] = true;
} as ParseMethod;


//
//  Implements \providetoggle{name}
//
toggleMethods.PROVIDETOGGLE_toggles = function (parser: TexParser, name: string) {
	var cn = ParseUtil.trimSpaces(parser.GetArgument(name));
	if (cn.charAt(0) === "\\") { cn = cn.substr(1) }
	if (!cn.match(/^(.|[a-z]+)$/i)) { throw new TexError("IllegalToggleName", "Illegal toggle name for " + name) }
	togglearray[cn] = true;
} as ParseMethod;


//
//  Implements \toggletrue{name}
//
toggleMethods.TOGGLETRUE_toggles = function (parser: TexParser, name: string) {
	var cn = ParseUtil.trimSpaces(parser.GetArgument(name));
	if (cn.charAt(0) === "\\") { cn = cn.substr(1) }
	if (!cn.match(/^(.|[a-z]+)$/i)) { throw new TexError("IllegalToggleName", "Illegal toggle name for " + name) }
	togglearray[cn] = true;
} as ParseMethod;


//
//  Implements \togglefalse{name}
//
toggleMethods.TOGGLEFALSE_toggles = function (parser: TexParser, name: string) {
	var cn = ParseUtil.trimSpaces(parser.GetArgument(name));
	if (cn.charAt(0) === "\\") { cn = cn.substr(1) }
	if (!cn.match(/^(.|[a-z]+)$/i)) { throw new TexError("IllegalToggleName", "Illegal toggle name for " + name) }
	togglearray[cn] = false;
} as ParseMethod;


//
//  Implements \settoggle{name}{value}
//
toggleMethods.SETTOGGLE_toggles = function (parser: TexParser, name: string) {
	var cn = ParseUtil.trimSpaces(parser.GetArgument(name)),
		val = ParseUtil.trimSpaces(parser.GetArgument(name));
	if (cn.charAt(0) === "\\") { cn = cn.substr(1) }
	if (!cn.match(/^(.|[a-z]+)$/i)) { throw new TexError("IllegalToggleName", "Illegal toggle name for " + name) }
	if (val.toLowerCase() === "true")
		togglearray[cn] = true;
	else if (val.toLowerCase() === "false")
		togglearray[cn] = false;
	else
		throw new TexError("IllegalToggleName", "Illegal toggle value for " + name);
} as ParseMethod;


// the next two macros are also nearly identical, but
// this time for reasons of the underlying logic

//
//  Implements \iftoggle{name}{true}{false}
//
toggleMethods.IFTOGGLE_toggles = function (parser: TexParser, name: string) {
	var cn = ParseUtil.trimSpaces(parser.GetArgument(name));
	var valtrue, valfalse;
	if (cn.charAt(0) === "\\") { cn = cn.substr(1) }
	if (!cn.match(/^(.|[a-z]+)$/i)) { throw new TexError("IllegalToggleName", "Illegal toggle name for " + name) }
	if (togglearray[cn]) {
		valtrue = parser.GetArgument(name);
		valfalse = parser.GetArgument(name);
		parser.string = ParseUtil.addArgs(parser, valtrue, parser.string.slice(parser.i));
	}
	else {
		valtrue = parser.GetArgument(name);
		valfalse = parser.GetArgument(name);
		parser.string = ParseUtil.addArgs(parser, valfalse, parser.string.slice(parser.i));
	}
	parser.i = 0;
} as ParseMethod;


//
//  Implements \nottoggle{name}{true}{false}
//
toggleMethods.MOTTOGGLE_toggles = function (parser: TexParser, name: string) {
	var cn = ParseUtil.trimSpaces(parser.GetArgument(name));
	var valtrue, valfalse;
	if (cn.charAt(0) === "\\") { cn = cn.substr(1) }
	if (!cn.match(/^(.|[a-z]+)$/i)) { throw new TexError("IllegalToggleName", "Illegal toggle name for " + name) }
	if (togglearray[cn]) {
		valtrue = parser.GetArgument(name);
		valfalse = parser.GetArgument(name);
		parser.string = ParseUtil.addArgs(parser, valfalse, parser.string.slice(parser.i));
	}
	else {
		valtrue = parser.GetArgument(name);
		valfalse = parser.GetArgument(name);
		parser.string = ParseUtil.addArgs(parser, valtrue, parser.string.slice(parser.i));
	}
	parser.i = 0;
} as ParseMethod;

new CommandMap("toggleCmdMap", {
	nottoggle: "MOTTOGGLE_toggles",
	iftoggle: "IFTOGGLE_toggles",
	togglefalse: "TOGGLEFALSE_toggles",
	toggletrue: "TOGGLETRUE_toggles",
	settoggle: "SETTOGGLE_toggles",
	providetoggle: "PROVIDETOGGLE_toggles",
	newtoggle: "NEWTOGGLE_toggles"
}, toggleMethods);

Configuration.create(
	'toggle', { handler: { macro: ["toggleCmdMap"] } }
);
export function createToggleConfiguration(mjx: MathJax, settingsRef: any) {
	const inputJax = mjx.startup.input.first();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	inputJax.configuration.add('toggle', inputJax as unknown as TeX<any, any, any>, {})
}
