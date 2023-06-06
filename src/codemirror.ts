import {
	defaultKeymap,
	history,
	historyKeymap,
	indentWithTab,
} from "@codemirror/commands";
import {
	bracketMatching,
	foldGutter,
	foldKeymap,
	indentOnInput,
} from "@codemirror/language";
import { EditorState, Extension, Compartment } from "@codemirror/state";
import { dropCursor, EditorView, keymap } from "@codemirror/view";
import {
	closeBrackets,
	closeBracketsKeymap,
	completionKeymap,
} from "@codemirror/autocomplete";
import { highlightSelectionMatches, searchKeymap } from "@codemirror/search";
import { lintKeymap } from "@codemirror/lint";
import { HighlightStyle, syntaxHighlighting } from "@codemirror/language";
import { tags as t } from "@lezer/highlight";

import { python } from "@codemirror/lang-python";

const codemirrorConfig = {
	name: "obsidian",
	dark: false,
	background: "var(--background-primary)",
	foreground: "var(--text-normal)",
	selection: "var(--text-selection)",
	cursor: "var(--text-normal)",
	dropdownBackground: "var(--background-primary)",
	dropdownBorder: "var(--background-modifier-border)",
	activeLine: "var(--background-primary)",
	matchingBracket: "var(--background-modifier-accent)",
	keyword: "#d73a49",
	storage: "#d73a49",
	variable: "var(--text-normal)",
	parameter: "var(--text-accent-hover)",
	function: "var(--text-accent-hover)",
	string: "var(--text-accent)",
	constant: "var(--text-accent-hover)",
	type: "var(--text-accent-hover)",
	class: "#6f42c1",
	number: "var(--text-accent-hover)",
	comment: "var(--text-faint)",
	invalid: "var(--text-error)",
	regexp: "#032f62",
};

const obsidianTheme = EditorView.theme(
	{
		"&": {
			color: codemirrorConfig.foreground,
			backgroundColor: codemirrorConfig.background,
		},

		".cm-content": { caretColor: codemirrorConfig.cursor },

		"&.cm-focused .cm-cursor": { borderLeftColor: codemirrorConfig.cursor },
		"&.cm-focused .cm-selectionBackground, .cm-selectionBackground, & ::selection":
			{
				backgroundColor: codemirrorConfig.selection,
			},

		".cm-panels": {
			backgroundColor: codemirrorConfig.dropdownBackground,
			color: codemirrorConfig.foreground,
		},
		".cm-panels.cm-panels-top": { borderBottom: "2px solid black" },
		".cm-panels.cm-panels-bottom": { borderTop: "2px solid black" },

		".cm-searchMatch": {
			backgroundColor: codemirrorConfig.dropdownBackground,
			outline: `1px solid ${codemirrorConfig.dropdownBorder}`,
		},
		".cm-searchMatch.cm-searchMatch-selected": {
			backgroundColor: codemirrorConfig.selection,
		},

		".cm-activeLine": { backgroundColor: codemirrorConfig.activeLine },
		".cm-activeLineGutter": {
			backgroundColor: codemirrorConfig.background,
		},
		".cm-selectionMatch": { backgroundColor: codemirrorConfig.selection },

		".cm-matchingBracket, .cm-nonmatchingBracket": {
			backgroundColor: codemirrorConfig.matchingBracket,
			outline: "none",
		},
		".cm-gutters": {
			backgroundColor: codemirrorConfig.background,
			color: codemirrorConfig.comment,
			borderRight: "1px solid var(--background-modifier-border)",
		},
		".cm-lineNumbers, .cm-gutterElement": { color: "inherit" },

		".cm-foldPlaceholder": {
			backgroundColor: "transparent",
			border: "none",
			color: codemirrorConfig.foreground,
		},

		".cm-tooltip": {
			border: `1px solid ${codemirrorConfig.dropdownBorder}`,
			backgroundColor: codemirrorConfig.dropdownBackground,
			color: codemirrorConfig.foreground,
		},
		".cm-tooltip.cm-tooltip-autocomplete": {
			"& > ul > li[aria-selected]": {
				background: codemirrorConfig.selection,
				color: codemirrorConfig.foreground,
			},
		},
	},
	{ dark: codemirrorConfig.dark }
);

const obsidianHighlightStyle = HighlightStyle.define([
	{ tag: t.keyword, color: codemirrorConfig.keyword },
	{
		tag: [t.name, t.deleted, t.character, t.macroName],
		color: codemirrorConfig.variable,
	},
	{ tag: [t.propertyName], color: codemirrorConfig.function },
	{
		tag: [
			t.processingInstruction,
			t.string,
			t.inserted,
			t.special(t.string),
		],
		color: codemirrorConfig.string,
	},
	{
		tag: [t.function(t.variableName), t.labelName],
		color: codemirrorConfig.function,
	},
	{
		tag: [t.color, t.constant(t.name), t.standard(t.name)],
		color: codemirrorConfig.constant,
	},
	{
		tag: [t.definition(t.name), t.separator],
		color: codemirrorConfig.variable,
	},
	{ tag: [t.className], color: codemirrorConfig.class },
	{
		tag: [
			t.number,
			t.changed,
			t.annotation,
			t.modifier,
			t.self,
			t.namespace,
		],
		color: codemirrorConfig.number,
	},
	{
		tag: [t.typeName],
		color: codemirrorConfig.type,
		fontStyle: codemirrorConfig.type,
	},
	{ tag: [t.operator, t.operatorKeyword], color: codemirrorConfig.keyword },
	{
		tag: [t.url, t.escape, t.regexp, t.link],
		color: codemirrorConfig.regexp,
	},
	{ tag: [t.meta, t.comment], color: codemirrorConfig.comment },
	{
		tag: [t.atom, t.bool, t.special(t.variableName)],
		color: codemirrorConfig.variable,
	},
	{ tag: t.invalid, color: codemirrorConfig.invalid },
]);

export const basicExtensions: Extension[] = [
	history(),
	foldGutter(),
	dropCursor(),
	EditorState.allowMultipleSelections.of(true),
	indentOnInput(),
	EditorView.lineWrapping,
	bracketMatching(),
	closeBrackets(),
	highlightSelectionMatches(),
	obsidianTheme,
	syntaxHighlighting(obsidianHighlightStyle),
	keymap.of([
		...closeBracketsKeymap,
		...defaultKeymap,
		...searchKeymap,
		...historyKeymap,
		indentWithTab,
		...foldKeymap,
		...completionKeymap,
		...lintKeymap,
	]),
];

// TODO: Do I need to use compartments, or is there a better way?
const language = new Compartment();

// TODO: Set default to something more sane, even though it doesn't technically matter once everything works
export const languageExtension: Extension[] = [language.of(python())];

// TODO: Add all languages that the plugin should support
const LANGUAGES: Map<string, Extension> = new Map([["py", python()]]);

// TODO: This currently does not work.
export const updateLanguage = (view: EditorView, ext: string) => {
	const LANG = LANGUAGES.get(ext);
	if (LANG) {
		// Note: this _does_ get run, but I'm not sure how the dispatch works.
		view.dispatch({
			effects: language.reconfigure(LANG),
		});
	}
};
