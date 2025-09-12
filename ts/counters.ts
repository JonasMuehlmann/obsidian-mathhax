/****************************************************
 *
 *  counters.js
 *  
 *  Implements LaTeX counters and related macros for MathJax.
 * 
 *  Macros implemented:
 *  \newcounter{name}[depend]
 *  \setcounter{name}{number}
 *  \addtocounter{name}{number}
 *  \arabic{name}
 *  \alph{name}
 *  \Alph{name}
 *  \roman{name}
 *  \Roman{name}
 *  \value{name}  -- *only* in number arguments of 
 *                 \setcounter, \addtocounter
 *
 *  Be sure to change the loadComplete() address to the URL
 *  of the location of this file on your server. 
 *  
 *  You can load it via the config=file parameter on the script
 *  tag that loads MathJax.js, or by including it in the extensions
 *  array in your configuration.
 *  
 */
import { ParseMethod } from 'mathjax-full/ts/input/tex/Types';
import { Configuration, CommandMap } from './bindings/input/tex';
import TexError from 'mathjax-full/ts/input/tex/TexError';
import TexParser from 'mathjax-full/ts/input/tex/TexParser';
import ParseUtil from "mathjax-full/ts/input/tex/ParseUtil"
import { MathJax } from 'ts/bindings';
import { TeX } from 'mathjax-full/ts/input/tex';

let counterMethods: Record<string, ParseMethod> = {};
var counterarray: Record<string, number> = {};
var dependencyarray: Record<string, Array<string>> = {};

//
//  Implements \newcounter{name}[depend]
//
counterMethods.NEWCOUNTER_counters = function (parser: TexParser, name: string) {
	var cn = ParseUtil.trimSpaces(parser.GetArgument(name));
	var d = ParseUtil.trimSpaces(parser.GetArgument(name));
	if (d === '') { d = null }
	if (cn.charAt(0) === "\\") { cn = cn.substr(1) }
	if (!cn.match(/^(.|[a-z]+)$/i)) { throw new TexError("IllegalCounter", "Illegal counter name for " + name) }
	if (d != null && !d.match(/^(.|[a-z]+)$/i)) { throw new TexError("IllegalCounter", "Illegal counter name dependency for " + name) }
	counterarray[cn] = 1;
	dependencyarray[cn] = [];
	if (d != null) {
		if (dependencyarray[d] == null)
			dependencyarray[d] = [cn];
		else {
			dependencyarray[d].push(cn);
		}
	}
	ParseUtil.checkMaxMacros(parser);
} as ParseMethod;

//
//  Implements \arabic{name}
//
counterMethods.ARABIC_counters = function (parser: TexParser, name: string) {
	var cn = ParseUtil.trimSpaces(parser.GetArgument(name));
	if (!cn.match(/^(.|[a-z]+)$/i)) { throw new TexError("IllegalCounter", "Illegal counter name for " + name) }
	var v = counterarray[cn].toString()
	parser.string = ParseUtil.addArgs(parser, v, parser.string.slice(parser.i));
	parser.i = 0;
	ParseUtil.checkMaxMacros(parser);
} as ParseMethod;

//
//  Implements \alph{name}
//
counterMethods.ALPH_counters = function (parser: TexParser, name: string) {
	var cn = ParseUtil.trimSpaces(parser.GetArgument(name));
	if (!cn.match(/^(.|[a-z]+)$/i)) { throw new TexError("IllegalCounter", "Illegal counter name for " + name) }
	var n = counterarray[cn]; var s = "";
	while (n > 0) {
		var y = ((n - 1) % 26) + 1;
		// if (y==0) y=26;
		var s = String.fromCharCode(96 + y) + s;
		var n = Math.floor((n - 1) / 26);
	}

	parser.string = ParseUtil.addArgs(parser, s.toString(), parser.string.slice(parser.i));
	parser.i = 0;
	ParseUtil.checkMaxMacros(parser);
} as ParseMethod;

//
//  Implements \Alph{name}
//
counterMethods.CAP_ALPH_counters = function (parser: TexParser, name: string) {
	var cn = ParseUtil.trimSpaces(parser.GetArgument(name));
	if (!cn.match(/^(.|[a-z]+)$/i)) { throw new TexError("IllegalCounter", "Illegal counter name for " + name) }
	var n = counterarray[cn]; var s = "";
	while (n > 0) {
		var y = ((n - 1) % 26) + 1;
		// if (y==0) y=26;
		var s = String.fromCharCode(64 + y) + s;
		var n = Math.floor((n - 1) / 26);
	}
	parser.string = ParseUtil.addArgs(parser, s.toString(), parser.string.slice(parser.i));
	parser.i = 0;
	ParseUtil.checkMaxMacros(parser);
} as ParseMethod;

//
//  Implements \Roman{name}
//
counterMethods.CAP_ROMAN_counters = function (parser: TexParser, name: string) {
	var cn = ParseUtil.trimSpaces(parser.GetArgument(name));
	if (!cn.match(/^(.|[a-z]+)$/i)) { throw new TexError("IllegalCounter", "Illegal counter name for " + name) }
	var n = counterarray[cn]; var s = "";
	while (n >= 1000) { s += "M"; n -= 1000; }
	if (n >= 900) { s += "CM"; n -= 900; }
	if (n >= 500) { s += "D"; n -= 500; }
	if (n >= 400) { s += "CD"; n -= 400; }
	while (n >= 100) { s += "C"; n -= 100; }
	if (n >= 90) { s += "XC"; n -= 90; }
	if (n >= 50) { s += "L"; n -= 50; }
	if (n >= 40) { s += "XL"; n -= 40; }
	while (n >= 10) { s += "X"; n -= 10; }
	if (n >= 9) { s += "IX"; n -= 9; }
	if (n >= 5) { s += "V"; n -= 5; }
	if (n >= 4) { s += "IV"; n -= 4; }
	while (n >= 1) { s += "I"; n -= 1; }
	parser.string = ParseUtil.addArgs(parser, s.toString(), parser.string.slice(parser.i));
	parser.i = 0;
	ParseUtil.checkMaxMacros(parser);
} as ParseMethod;

//
//  Implements \roman{name}
//
counterMethods.ROMAN_counters = function (parser: TexParser, name: string) {
	var cn = ParseUtil.trimSpaces(parser.GetArgument(name));
	if (!cn.match(/^(.|[a-z]+)$/i)) { throw new TexError("IllegalCounter", "Illegal counter name for " + name) }
	var n = counterarray[cn]; var s = "";
	while (n >= 1000) { s += "m"; n -= 1000; }
	if (n >= 900) { s += "cm"; n -= 900; }
	if (n >= 500) { s += "d"; n -= 500; }
	if (n >= 400) { s += "cd"; n -= 400; }
	while (n >= 100) { s += "c"; n -= 100; }
	if (n >= 90) { s += "xc"; n -= 90; }
	if (n >= 50) { s += "l"; n -= 50; }
	if (n >= 40) { s += "xl"; n -= 40; }
	while (n >= 10) { s += "x"; n -= 10; }
	if (n >= 9) { s += "ix"; n -= 9; }
	if (n >= 5) { s += "v"; n -= 5; }
	if (n >= 4) { s += "iv"; n -= 4; }
	while (n >= 1) { s += "i"; n -= 1; }
	parser.string = ParseUtil.addArgs(parser, s.toString(), parser.string.slice(parser.i));
	parser.i = 0;
	ParseUtil.checkMaxMacros(parser);
} as ParseMethod;

//
//  Implements \setcounter{name}{number}
//
counterMethods.SETCOUNTER_counters = function (parser: TexParser, name: string) {
	var cn = ParseUtil.trimSpaces(parser.GetArgument(name));
	if (!cn.match(/^(.|[a-z]+)$/i)) { throw new TexError("IllegalCounter", "Illegal counter name for " + name) }
	var ns = ParseUtil.trimSpaces(parser.GetArgument(name));
	var n = Number.NaN;
	if (ns.indexOf("\\value{") === 0) {
		ns = ns.substring(7, ns.indexOf("}"));
		if (!ns.match(/^(.|[a-z]+)$/i)) { throw new TexError("IllegalCounter", "Illegal counter name for " + ns) }
		n = counterarray[ns];
	} else {
		n = parseInt(ns);
	}
	if (n === Number.NaN) { throw new TexError("IllegalCounter", "Illegal number format") }
	counterarray[cn] = n;
	ParseUtil.checkMaxMacros(parser);
} as ParseMethod;

//
//  Implements \addtocounter{name}{number}
//
counterMethods.ADDTOCOUNTER_counters = function (parser: TexParser, name: string) {
	var cn = ParseUtil.trimSpaces(parser.GetArgument(name));
	var ns = ParseUtil.trimSpaces(parser.GetArgument(name));
	var n = Number.NaN;
	if (ns.indexOf("\\value{") === 0) {
		ns = ns.substring(7, ns.indexOf("}"));
		if (!ns.match(/^(.|[a-z]+)$/i)) { throw new TexError("IllegalCounter", "Illegal counter name for " + ns) }
		n = counterarray[ns];
	} else {
		n = parseInt(ns);
	}
	if (n === Number.NaN) { throw new TexError("IllegalCounter", "Illegal number format") }
	counterarray[cn] += n;
	if (dependencyarray != null && dependencyarray[cn] != null)
		for (var i = 0; i < dependencyarray[cn].length; i++) {
			counterarray[dependencyarray[cn][i]] = 1;
		} // ****
	ParseUtil.checkMaxMacros(parser);
} as ParseMethod;

new CommandMap("counterCmdMap", {
	newcounter: 'NEWCOUNTER_counters',
	setcounter: 'SETCOUNTER_counters',
	addtocounter: 'ADDTOCOUNTER_counters',
	getcounter: 'ARABIC_counters',
	arabic: 'ARABIC_counters',
	alph: 'ALPH_counters',
	Alph: 'CAP_ALPH_counters',
	roman: 'ROMAN_counters',
	Roman: 'CAP_ROMAN_counters'
},
	counterMethods);

Configuration.create(
	'counter', { handler: { macro: ["counterCmdMap"] } }
);
export function createCounterConfiguration(mjx: MathJax, settingsRef: any) {
	const inputJax = mjx.startup.input.first();
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	inputJax.configuration.add('counter', inputJax as unknown as TeX<any, any, any>, {})
}
