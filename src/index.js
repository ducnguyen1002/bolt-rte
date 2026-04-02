import InterfaceComponent from './interface.vue';

const ALL_FEATURES = [
	'history', 'headings',
	'bold', 'italic', 'underline', 'strike',
	'align',
	'bulletList', 'orderedList', 'blockquote', 'codeBlock',
	'link',
	'image', 'video', 'table', 'hr',
	'clearFormat', 'source', 'fullscreen',
];

export default {
	id: 'bolt-rte',
	name: 'Bolt RTE',
	icon: "text_fields",
	description: 'Professional rich text editor with multi-file drag-and-drop support and automatic upload to Directus.',
	component: InterfaceComponent,
	group: 'standard',
	types: ['text'],
	options: [
		{
			field: 'toolbar',
			name: 'Toolbar Features',
			type: 'json',
			meta: {
				interface: 'select-multiple-checkbox',
				width: 'full',
				options: {
					choices: [
						{ text: 'Undo / Redo', value: 'history' },
						{ text: 'Headings (H1–H6)', value: 'headings' },
						{ text: 'Bold', value: 'bold' },
						{ text: 'Italic', value: 'italic' },
						{ text: 'Underline', value: 'underline' },
						{ text: 'Strikethrough', value: 'strike' },
						{ text: 'Text Align', value: 'align' },
						{ text: 'Bullet List', value: 'bulletList' },
						{ text: 'Ordered List', value: 'orderedList' },
						{ text: 'Blockquote', value: 'blockquote' },
						{ text: 'Code Block', value: 'codeBlock' },
						{ text: 'Link', value: 'link' },
						{ text: 'Image Upload', value: 'image' },
						{ text: 'Video (Upload & Embed)', value: 'video' },
						{ text: 'Table', value: 'table' },
						{ text: 'Horizontal Rule', value: 'hr' },
						{ text: 'Clear Formatting', value: 'clearFormat' },
						{ text: 'Source Code (HTML)', value: 'source' },
						{ text: 'Fullscreen', value: 'fullscreen' },
					],
				},
			},
			schema: {
				default_value: ALL_FEATURES,
			},
		},
		{
			field: 'font_family',
			name: 'Editor Font Family',
			type: 'string',
			meta: {
				interface: 'select-dropdown',
				width: 'half',
				options: {
					choices: [
						{ text: 'Sans Serif (Default)', value: '' },
						{ text: 'Inter', value: 'Inter, sans-serif' },
						{ text: 'Roboto', value: 'Roboto, sans-serif' },
						{ text: 'Serif', value: 'Georgia, "Times New Roman", serif' },
						{ text: 'Monospace', value: '"Courier New", Courier, monospace' },
					],
					allowNone: true,
				},
			},
			schema: {
				default_value: null,
			},
		},
	],
};
