<template>
	<div class="tinymce-wrapper" @dragover.prevent @drop.prevent="handleDrop">
		<editor
			v-model="internalValue"
			:init="editorConfig"
			tinymce-script-src="https://cdnjs.cloudflare.com/ajax/libs/tinymce/6.8.3/tinymce.min.js"
		/>
	</div>
</template>

<script>
import { inject, ref, watch } from 'vue';
import Editor from '@tinymce/tinymce-vue';

export default {
	components: { Editor },
	props: {
		value: {
			type: String,
			default: '',
		},
	},
	emits: ['input'],
	setup(props, { emit }) {
		const api = inject('api');
		const internalValue = ref(props.value || '');

		watch(internalValue, (newVal) => {
			emit('input', newVal);
		});

		watch(() => props.value, (newVal) => {
			if (newVal !== internalValue.value) {
				internalValue.value = newVal || '';
			}
		});

		const processFiles = async (files) => {
			if (!files || files.length === 0) return;

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				try {
					const formData = new FormData();
					formData.append('file', file, file.name);

					const response = await api.post('/files', formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
						},
					});

					const fileId = response.data.data.id;
					const url = '/assets/' + fileId;
					
					const instance = window.tinymce?.activeEditor;
					if (instance) {
						if (file.type.startsWith('image/')) {
							instance.insertContent(`<img src="${url}" alt="${file.name}" style="max-width: 100%; height: auto;" />`);
						} else {
							instance.insertContent(`<a href="${url}" target="_blank" rel="noopener">${file.name}</a>`);
						}
					}
				} catch (error) {
					console.error('File upload failed:', error);
				}
			}
		};

		const uploadImage = async (blobInfo, progress) => {
			return new Promise(async (resolve, reject) => {
				try {
					const formData = new FormData();
					formData.append('file', blobInfo.blob(), blobInfo.filename() || 'image.png');

					const response = await api.post('/files', formData, {
						headers: {
							'Content-Type': 'multipart/form-data',
						},
						onUploadProgress: (e) => {
							if (e.lengthComputable && progress) {
								progress(Math.round((e.loaded / e.total) * 100));
							}
						},
					});

					const url = '/assets/' + response.data.data.id;
					resolve(url);
				} catch (error) {
					reject('Image upload failed: ' + error.message);
				}
			});
		};

		const handleDrop = (event) => {
			event.preventDefault();
			const files = event.dataTransfer?.files;
			processFiles(files);
		};

		const editorConfig = {
			height: 600,
			menubar: true,
			plugins: [
				'advlist', 'autolink', 'lists', 'link', 'image', 'charmap', 'preview',
				'anchor', 'searchreplace', 'visualblocks', 'code', 'fullscreen',
				'insertdatetime', 'media', 'table', 'code', 'help', 'wordcount'
			],
			toolbar: 'undo redo | blocks | ' +
				'bold italic forecolor | alignleft aligncenter ' +
				'alignright alignjustify | bullist numlist outdent indent | ' +
				'link multi_image media table | removeformat | fullscreen code | help',
			images_upload_handler: uploadImage,
			automatic_uploads: true,
			file_picker_types: 'image media',
			paste_data_images: true,
			branding: false,
			promotion: false,
			setup: (editor) => {
				// Register a custom button for multiple image upload
				editor.ui.registry.addButton('multi_image', {
					icon: 'image',
					tooltip: 'Upload Multiple Images',
					onAction: () => {
						const input = document.createElement('input');
						input.type = 'file';
						input.multiple = true;
						input.accept = 'image/*';
						input.onchange = (e) => {
							const files = e.target.files;
							processFiles(files);
						};
						input.click();
					}
				});

				editor.on('drop', (e) => {
					// Native TinyMCE handles image drops inside the editor. 
					// Our wrapper handleDrop handles drops on the border/empty space.
				});
			}
		};

		return {
			internalValue,
			editorConfig,
			handleDrop,
		};
	},
};
</script>

<style scoped>
.tinymce-wrapper {
	border: var(--border-width, 1px) solid var(--theme--form--field--input--border-color, #d3d3d3);
	border-radius: var(--border-radius, 4px);
	border-color: var(--border-normal);
	background-color: var(--background-page);
	min-height: 400px;
	transition: border-color 0.2s;
}

.tinymce-wrapper:focus-within {
	border-color: var(--theme--primary, #007bff);
}
</style>
