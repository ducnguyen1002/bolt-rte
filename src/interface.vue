<template>
	<div
		class="tinymce-wrapper"
		@dragover.prevent
		@drop.prevent="handleDrop"
	>
		<editor
			v-model="internalValue"
			:init="editorConfig"
		/>
	</div>
</template>

<script>
import { inject, ref, watch, onMounted, onUnmounted } from "vue";
import Editor from "@tinymce/tinymce-vue";
import tinymce from "tinymce";
import "tinymce/themes/silver";
import "tinymce/icons/default";
import "tinymce/models/dom";
import "tinymce/plugins/advlist";
import "tinymce/plugins/autolink";
import "tinymce/plugins/lists";
import "tinymce/plugins/link";
import "tinymce/plugins/image";
import "tinymce/plugins/charmap";
import "tinymce/plugins/preview";
import "tinymce/plugins/anchor";
import "tinymce/plugins/searchreplace";
import "tinymce/plugins/visualblocks";
import "tinymce/plugins/code";
import "tinymce/plugins/fullscreen";
import "tinymce/plugins/insertdatetime";
import "tinymce/plugins/media";
import "tinymce/plugins/table";
import "tinymce/plugins/help";
import "tinymce/plugins/wordcount";
import "tinymce/skins/ui/oxide/skin.min.css";
import "tinymce/skins/content/default/content.min.css";
import "./tinymce-overrides.css";

export default {
	components: { Editor },
	props: {
		value: {
			type: String,
			default: "",
		},
	},
	emits: ["input"],
	setup(props, { emit }) {
		const api = inject("api");
		const internalValue = ref(props.value || "");

		const closeTinyMcePopups = (e) => {
			if (e.__tinymceFixed) return;
			const target = e.target;
			if (!target.closest?.(".tox-tinymce") && !target.closest?.(".tox-tinymce-aux")) {
				const event = new MouseEvent("mousedown", {
					bubbles: true,
					cancelable: true,
					view: window,
				});
				event.__tinymceFixed = true;
				document.dispatchEvent(event);
			}
		};

		onMounted(() => {
			document.addEventListener("mousedown", closeTinyMcePopups, true);
		});

		onUnmounted(() => {
			document.removeEventListener("mousedown", closeTinyMcePopups, true);
		});

		watch(internalValue, (newVal) => {
			emit("input", newVal);
		});

		watch(
			() => props.value,
			(newVal) => {
				if (newVal !== internalValue.value) {
					internalValue.value = newVal || "";
				}
			},
		);

		const processFiles = async (files) => {
			if (!files || files.length === 0) return;

			for (let i = 0; i < files.length; i++) {
				const file = files[i];
				try {
					const formData = new FormData();
					formData.append("file", file, file.name);

					const response = await api.post("/files", formData, {
						headers: {
							"Content-Type": "multipart/form-data",
						},
					});

					const fileId = response.data.data.id;
					const publicUrl = import.meta.env.PUBLIC_URL || "";
					const baseUrl = publicUrl.endsWith("/")
						? publicUrl.slice(0, -1)
						: publicUrl;
					const url = baseUrl + "/assets/" + fileId;

					const instance = window.tinymce?.activeEditor;
					if (instance) {
						if (file.type.startsWith("image/")) {
							instance.insertContent(
								`<img src="${url}" alt="${file.name}" style="max-width: 100%; height: auto;" />`,
							);
						} else {
							instance.insertContent(
								`<a href="${url}" target="_blank" rel="noopener">${file.name}</a>`,
							);
						}
					}
				} catch (error) {
					console.error("File upload failed:", error);
				}
			}
		};

		const uploadImage = async (blobInfo, progress) => {
			return new Promise(async (resolve, reject) => {
				try {
					const formData = new FormData();
					formData.append(
						"file",
						blobInfo.blob(),
						blobInfo.filename() || "image.png",
					);

					const response = await api.post("/files", formData, {
						headers: {
							"Content-Type": "multipart/form-data",
						},
						onUploadProgress: (e) => {
							if (e.lengthComputable && progress) {
								progress(Math.round((e.loaded / e.total) * 100));
							}
						},
					});

					const publicUrl = import.meta.env.PUBLIC_URL || "";
					const baseUrl = publicUrl.endsWith("/")
						? publicUrl.slice(0, -1)
						: publicUrl;
					const url = baseUrl + "/assets/" + response.data.data.id;
					resolve(url);
				} catch (error) {
					reject("Image upload failed: " + error.message);
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
			menubar: false,
			skin: false,
			content_css: false,
			content_style: `
				body {
					color: var(--theme--form--field--input--foreground, #1a202c);
					background-color: var(--theme--form--field--input--background, #ffffff);
					margin: 1.125rem;
					font-family: var(--theme--fonts--sans--font-family, -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, sans-serif);
					-webkit-font-smoothing: antialiased;
					text-rendering: optimizeLegibility;
					-moz-osx-font-smoothing: grayscale;
				}
				::selection { background: var(--background-normal-alt, #e2e8f0); }
				h1, h2, h3, h4, h5, h6 {
					font-family: var(--theme--fonts--sans--font-family, inherit);
					color: var(--theme--form--field--input--foreground-accent, #111827);
					font-weight: 700;
					margin-block-end: 0;
				}
				h1 + p, h2 + p, h3 + p, h4 + p, h5 + p, h6 + p { margin-block-start: 0.5em; }
				h1 { font-size: 2rem; line-height: 1.2813; margin-block-start: 1em; }
				h2 { font-size: 1.375rem; line-height: 1.4091; margin-block-start: 1.25em; }
				h3 { font-size: 1.0625rem; line-height: 1.5294; margin-block-start: 1.25em; }
				h4 { font-size: 0.875rem; line-height: 1.6429; margin-block-start: 1.5em; }
				h5 { font-size: 0.8125rem; line-height: 1.6923; margin-block-start: 2em; }
				h6 { font-size: 0.6875rem; line-height: 1.8182; margin-block-start: 2em; }
				p { font-size: 0.875rem; line-height: 1.5714; font-weight: 500; margin: 1.5em 0; }
				a { color: var(--theme--primary-accent, #6644ff); text-decoration: underline; cursor: pointer; }
				ul, ol { font-size: 0.875rem; line-height: 1.5714; font-weight: 500; margin: 1.5em 0; }
				ul ul, ol ol, ul ol, ol ul { margin: 0; }
				b, strong { font-weight: 700; }
				code {
					font-size: 0.875rem; line-height: 1.5714; font-weight: 500;
					padding: 0.125rem 0.25rem;
					font-family: var(--theme--fonts--monospace--font-family, 'Courier New', monospace);
					background-color: var(--theme--background-normal, #f0f4f8);
					border-radius: var(--theme--border-radius, 4px);
					overflow-wrap: break-word;
				}
				pre {
					font-size: 0.875rem; line-height: 1.5714; font-weight: 500;
					padding: 1em;
					font-family: var(--theme--fonts--monospace--font-family, 'Courier New', monospace);
					background-color: var(--theme--background-normal, #f0f4f8);
					border-radius: var(--theme--border-radius, 4px);
					overflow: auto;
				}
				blockquote {
					font-size: 0.875rem; line-height: 1.5714; font-weight: 500;
					border-inline-start: 2px solid var(--theme--form--field--input--border-color, #d1d5db);
					padding-inline-start: 1em;
					margin-inline-start: 0;
				}
				video, img { max-inline-size: 100%; border-radius: var(--theme--border-radius, 4px); block-size: auto; }
				iframe { max-inline-size: 100%; border-radius: var(--theme--border-radius, 4px); }
				hr {
					background-color: var(--theme--form--field--input--border-color, #d1d5db);
					block-size: 0.0625rem; border: none;
					margin-block-start: 2em; margin-block-end: 2em;
				}
				table { border-collapse: collapse; font-size: 0.875rem; line-height: 1.5714; font-weight: 500; }
				table th, table td { border: 1px solid var(--theme--form--field--input--border-color, #d1d5db); padding: 0.3125rem; }
				figure { display: table; margin: 0.8125rem auto; }
				figure figcaption { color: #999; display: block; margin-block-start: 0.1875rem; text-align: center; }
			`,
			plugins: [
				"advlist",
				"autolink",
				"lists",
				"link",
				"image",
				"charmap",
				"preview",
				"anchor",
				"searchreplace",
				"visualblocks",
				"code",
				"fullscreen",
				"insertdatetime",
				"media",
				"table",
				"code",
				"help",
				"wordcount",
			],
			toolbar:
				"undo redo | blocks | " +
				"bold italic forecolor | alignleft aligncenter " +
				"alignright alignjustify | bullist numlist outdent indent | " +
				"link multi_image media table | removeformat | fullscreen code ",
			images_upload_handler: uploadImage,
			automatic_uploads: true,
			file_picker_types: "image media",
			paste_data_images: true,
			branding: false,
			promotion: false,
			setup: (editor) => {
				// Register a custom button for multiple image upload
				editor.ui.registry.addButton("multi_image", {
					icon: "image",
					tooltip: "Upload Multiple Images",
					onAction: () => {
						const input = document.createElement("input");
						input.type = "file";
						input.multiple = true;
						input.accept = "image/*";
						input.onchange = (e) => {
							const files = e.target.files;
							processFiles(files);
						};
						input.click();
					},
				});

				editor.on("drop", (e) => {
					// Native TinyMCE handles image drops inside the editor.
					// Our wrapper handleDrop handles drops on the border/empty space.
				});
			},
		};

		return {
			internalValue,
			editorConfig,
			handleDrop,
		};
	},
};
</script>

<style></style>
