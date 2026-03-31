import InterfaceComponent from './interface.vue';

export default {
	id: 'bolt-rte',
	name: 'Bolt RTE',
	icon: 'text_fields',
	description: 'Professional rich text editor with multi-file drag-and-drop support and automatic upload to Directus.',
	component: InterfaceComponent,
	group: 'standard',
	options: null,
	types: ['text', 'string'],
};
