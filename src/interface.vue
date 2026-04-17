<template>
	<div
		class="bolt-rte-wrapper"
		:class="{ 'is-focused': isFocused, 'is-fullscreen': isFullscreen }"
		:style="font_family ? { '--bolt-rte-font': font_family } : {}"
		@dragover.prevent
		@drop.prevent="handleDrop"
	>
		<!-- Toolbar -->
		<div
			v-if="editor"
			class="bolt-rte-toolbar"
		>
			<!-- History -->
			<template v-if="hasFeature('history')">
				<div class="toolbar-group">
					<button
						class="toolbar-btn"
						title="Undo"
						@click="editor.chain().focus().undo().run()"
						:disabled="isSourceView || !editor.can().undo()"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M12.5 8c-2.65 0-5.05.99-6.9 2.6L2 7v9h9l-3.62-3.62c1.39-1.16 3.16-1.88 5.12-1.88 3.54 0 6.55 2.31 7.6 5.5l2.37-.78C21.08 11.03 17.15 8 12.5 8z"
							/>
						</svg>
					</button>
					<button
						class="toolbar-btn"
						title="Redo"
						@click="editor.chain().focus().redo().run()"
						:disabled="isSourceView || !editor.can().redo()"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M18.4 10.6C16.55 8.99 14.15 8 11.5 8c-4.65 0-8.58 3.03-9.96 7.22L3.9 16c1.05-3.19 4.05-5.5 7.6-5.5 1.95 0 3.73.72 5.12 1.88L13 16h9V7l-3.6 3.6z"
							/>
						</svg>
					</button>
				</div>
				<div class="toolbar-divider"></div>
			</template>

			<!-- Headings -->
			<template v-if="hasFeature('headings')">
				<div class="toolbar-group">
					<select
						class="toolbar-select"
						@change="setHeading($event)"
						title="Paragraph style"
						:disabled="isSourceView"
					>
						<option
							value="paragraph"
							:selected="editor.isActive('paragraph')"
						>
							Paragraph
						</option>
						<option
							value="1"
							:selected="editor.isActive('heading', { level: 1 })"
						>
							Heading 1
						</option>
						<option
							value="2"
							:selected="editor.isActive('heading', { level: 2 })"
						>
							Heading 2
						</option>
						<option
							value="3"
							:selected="editor.isActive('heading', { level: 3 })"
						>
							Heading 3
						</option>
						<option
							value="4"
							:selected="editor.isActive('heading', { level: 4 })"
						>
							Heading 4
						</option>
						<option
							value="5"
							:selected="editor.isActive('heading', { level: 5 })"
						>
							Heading 5
						</option>
						<option
							value="6"
							:selected="editor.isActive('heading', { level: 6 })"
						>
							Heading 6
						</option>
					</select>
				</div>
				<div class="toolbar-divider"></div>
			</template>

			<!-- Font Size -->
			<template v-if="hasFeature('font_size')">
				<div class="toolbar-group">
					<button
						class="toolbar-btn"
						title="Decrease Font Size"
						@click="changeFontSize(-1)"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z" /></svg>
					</button>
					<div
						class="font-size-indicator"
						style="
							font-size: 11px;
							min-width: 30px;
							text-align: center;
							font-weight: bold;
							opacity: 0.7;
						"
					>
						{{ currentFontSize.replace("px", "") }}
					</div>
					<button
						class="toolbar-btn"
						title="Increase Font Size"
						@click="changeFontSize(1)"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path d="M19 13h-6V7h-2v6H5v2h6v6h2v-6h6z" />
						</svg>
					</button>
				</div>
				<div class="toolbar-divider"></div>
			</template>

			<!-- Basic Marks -->
			<template
				v-if="
					hasFeature('bold') ||
					hasFeature('italic') ||
					hasFeature('underline') ||
					hasFeature('strike')
				"
			>
				<div class="toolbar-group">
					<button
						v-if="hasFeature('bold')"
						class="toolbar-btn"
						:class="{ active: editor.isActive('bold') }"
						title="Bold"
						@click="editor.chain().focus().toggleBold().run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M15.6 10.79c.97-.67 1.65-1.77 1.65-2.79 0-2.26-1.75-4-4-4H7v14h7.04c2.09 0 3.71-1.7 3.71-3.79 0-1.52-.86-2.82-2.15-3.42zM10 6.5h3c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5h-3v-3zm3.5 9H10v-3h3.5c.83 0 1.5.67 1.5 1.5s-.67 1.5-1.5 1.5z"
							/>
						</svg>
					</button>
					<button
						v-if="hasFeature('italic')"
						class="toolbar-btn"
						:class="{ active: editor.isActive('italic') }"
						title="Italic"
						@click="editor.chain().focus().toggleItalic().run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path d="M10 4v3h2.21l-3.42 8H6v3h8v-3h-2.21l3.42-8H18V4z" />
						</svg>
					</button>
					<button
						v-if="hasFeature('underline')"
						class="toolbar-btn"
						:class="{ active: editor.isActive('underline') }"
						title="Underline"
						@click="editor.chain().focus().toggleUnderline().run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M12 17c3.31 0 6-2.69 6-6V3h-2.5v8c0 1.93-1.57 3.5-3.5 3.5S8.5 12.93 8.5 11V3H6v8c0 3.31 2.69 6 6 6zm-7 2v2h14v-2H5z"
							/>
						</svg>
					</button>
					<button
						v-if="hasFeature('strike')"
						class="toolbar-btn"
						:class="{ active: editor.isActive('strike') }"
						title="Strikethrough"
						@click="editor.chain().focus().toggleStrike().run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M10 19h4v-3h-4v3zM5 4v3h5v3h4V7h5V4H5zM3 14h18v-2H3v2z"
							/>
						</svg>
					</button>

					<!-- Text Color -->
					<div class="toolbar-color-picker">
						<input
							type="color"
							v-model="textColor"
							@input="setTextColor(textColor)"
							title="Text Color"
							:disabled="isSourceView"
						/>
						<svg viewBox="0 0 24 24">
							<path
								d="M11 3L5.5 17h2.25l1.12-3h6.25l1.12 3h2.25L13 3h-2zm-1.38 9L12 5.67 14.38 12H9.62z"
							/>
							<path
								d="M0 20h24v4H0z"
								:style="{ fill: textColor }"
							/>
						</svg>
					</div>

					<!-- Highlight/Background Color -->
					<div class="toolbar-color-picker">
						<input
							type="color"
							v-model="cellColor"
							@input="setCellColor(cellColor)"
							title="Cell Background Color"
							:disabled="isSourceView"
						/>
						<svg viewBox="0 0 24 24">
							<path
								d="M16.56 8.94L7.62 0 6.21 1.41l2.38 2.38-5.15 5.15c-.59.59-.59 1.54 0 2.12l5.5 5.5c.29.29.68.44 1.06.44s.77-.15 1.06-.44l5.5-5.5c.59-.58.59-1.53 0-2.12zM5.21 10L10 5.21 14.79 10H5.21zM19 11.5s-2 2.17-2 3.5c0 1.1.9 2 2 2s2-.9 2-2c0-1.33-2-3.5-2-3.5z"
							/>
							<path
								d="M0 20h24v4H0z"
								:style="{ fill: cellColor }"
							/>
						</svg>
					</div>
				</div>
				<div class="toolbar-divider"></div>
			</template>

			<!-- Align -->
			<template v-if="hasFeature('align')">
				<div class="toolbar-group">
					<button
						class="toolbar-btn"
						:class="{ active: editor.isActive({ textAlign: 'left' }) }"
						title="Align Left"
						@click="editor.chain().focus().setTextAlign('left').run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M15 15H3v2h12v-2zm0-8H3v2h12V7zM3 13h18v-2H3v2zm0 8h18v-2H3v2zM3 3v2h18V3H3z"
							/>
						</svg>
					</button>
					<button
						class="toolbar-btn"
						:class="{ active: editor.isActive({ textAlign: 'center' }) }"
						title="Align Center"
						@click="editor.chain().focus().setTextAlign('center').run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M7 15v2h10v-2H7zm-4 6h18v-2H3v2zm0-8h18v-2H3v2zm4-6v2h10V7H7zM3 3v2h18V3H3z"
							/>
						</svg>
					</button>
					<button
						class="toolbar-btn"
						:class="{ active: editor.isActive({ textAlign: 'right' }) }"
						title="Align Right"
						@click="editor.chain().focus().setTextAlign('right').run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M3 21h18v-2H3v2zm6-4h12v-2H9v2zm-6-4h18v-2H3v2zm6-4h12V7H9v2zM3 3v2h18V3H3z"
							/>
						</svg>
					</button>
					<button
						class="toolbar-btn"
						:class="{ active: editor.isActive({ textAlign: 'justify' }) }"
						title="Align Justify"
						@click="editor.chain().focus().setTextAlign('justify').run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M3 21h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18v-2H3v2zm0-4h18V7H3v2zm0-6v2h18V3H3z"
							/>
						</svg>
					</button>
				</div>
				<div class="toolbar-divider"></div>
			</template>

			<!-- Lists & Blocks -->
			<template
				v-if="
					hasFeature('bulletList') ||
					hasFeature('orderedList') ||
					hasFeature('blockquote') ||
					hasFeature('codeBlock')
				"
			>
				<div class="toolbar-group">
					<button
						v-if="hasFeature('bulletList')"
						class="toolbar-btn"
						:class="{ active: editor.isActive('bulletList') }"
						title="Bullet List"
						@click="editor.chain().focus().toggleBulletList().run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M4 10.5c-.83 0-1.5.67-1.5 1.5s.67 1.5 1.5 1.5 1.5-.67 1.5-1.5-.67-1.5-1.5-1.5zm0-6c-.83 0-1.5.67-1.5 1.5S3.17 7.5 4 7.5 5.5 6.83 5.5 6 4.83 4.5 4 4.5zm0 12c-.83 0-1.5.68-1.5 1.5s.68 1.5 1.5 1.5 1.5-.68 1.5-1.5-.67-1.5-1.5-1.5zM7 19h14v-2H7v2zm0-6h14v-2H7v2zm0-8v2h14V5H7z"
							/>
						</svg>
					</button>
					<button
						v-if="hasFeature('orderedList')"
						class="toolbar-btn"
						:class="{ active: editor.isActive('orderedList') }"
						title="Ordered List"
						@click="editor.chain().focus().toggleOrderedList().run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M2 17h2v.5H3v1h1v.5H2v1h3v-4H2v1zm1-9h1V4H2v1h1v3zm-1 3h1.8L2 13.1v.9h3v-1H3.2L5 10.9V10H2v1zm5-6v2h14V5H7zm0 14h14v-2H7v2zm0-6h14v-2H7v2z"
							/>
						</svg>
					</button>
					<button
						v-if="hasFeature('blockquote')"
						class="toolbar-btn"
						:class="{ active: editor.isActive('blockquote') }"
						title="Blockquote"
						@click="editor.chain().focus().toggleBlockquote().run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path d="M6 17h3l2-4V7H5v6h3zm8 0h3l2-4V7h-6v6h3z" />
						</svg>
					</button>
					<button
						v-if="hasFeature('codeBlock')"
						class="toolbar-btn"
						:class="{ active: editor.isActive('codeBlock') }"
						title="Code Block"
						@click="editor.chain().focus().toggleCodeBlock().run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
							/>
						</svg>
					</button>
				</div>
				<div class="toolbar-divider"></div>
			</template>

			<!-- Link -->
			<template v-if="hasFeature('link')">
				<div class="toolbar-group">
					<button
						class="toolbar-btn"
						:class="{ active: editor.isActive('link') }"
						title="Insert Link"
						@click="insertLink"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M3.9 12c0-1.71 1.39-3.1 3.1-3.1h4V7H7c-2.76 0-5 2.24-5 5s2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1zM8 13h8v-2H8v2zm9-6h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1s-1.39 3.1-3.1 3.1h-4V17h4c2.76 0 5-2.24 5-5s-2.24-5-5-5z"
							/>
						</svg>
					</button>
					<button
						class="toolbar-btn"
						title="Remove Link"
						@click="editor.chain().focus().unsetLink().run()"
						:disabled="isSourceView || !editor.isActive('link')"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M17 7h-4v1.9h4c1.71 0 3.1 1.39 3.1 3.1 0 1.43-.98 2.63-2.31 2.98l1.46 1.46C20.62 15.74 22 14.04 22 12c0-2.76-2.24-5-5-5zm-1 4h-2.19l2 2H16v-2zM2 4.27l3.11 3.11C3.29 8.12 2 9.91 2 12c0 2.76 2.24 5 5 5h4v-1.9H7c-1.71 0-3.1-1.39-3.1-3.1 0-1.59 1.21-2.9 2.76-3.07L8.73 11H8v2h2.73l2 2H8v1.9h4.46l3.27 3.27 1.27-1.27L3.27 3 2 4.27z"
							/>
						</svg>
					</button>
				</div>
				<div class="toolbar-divider"></div>
			</template>

			<!-- Media & Layout -->
			<template
				v-if="
					hasFeature('image') ||
					hasFeature('video') ||
					hasFeature('table') ||
					hasFeature('hr')
				"
			>
				<div class="toolbar-group">
					<button
						v-if="hasFeature('image')"
						class="toolbar-btn"
						title="Upload Image(s)"
						@click="triggerImageUpload"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M21 19V5c0-1.1-.9-2-2-2H5c-1.1 0-2 .9-2 2v14c0 1.1.9 2 2 2h14c1.1 0 2-.9 2-2zM8.5 13.5l2.5 3.01L14.5 12l4.5 6H5l3.5-4.5z"
							/>
						</svg>
					</button>
					<button
						v-if="hasFeature('video')"
						class="toolbar-btn"
						title="Upload Video"
						@click="triggerVideoUpload"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M17 10.5V7c0-.55-.45-1-1-1H4c-.55 0-1 .45-1 1v10c0 .55.45 1 1 1h12c.55 0 1-.45 1-1v-3.5l4 4v-11l-4 4zM14 13H6V11H14V13Z"
							/>
						</svg>
					</button>
					<button
						v-if="hasFeature('video')"
						class="toolbar-btn"
						title="Embed Video"
						@click="insertVideoEmbed"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M10 15l5.19-3L10 9v6m11.56-7.83c.13.47.22 1.1.28 1.9.07.8.1 1.49.1 2.09L22 12c0 .6-.03 1.29-.1 2.09-.06.8-.15 1.43-.28 1.9-.13.47-.35.83-.65 1.07-.3.26-.74.43-1.32.53-.58.1-1.33.17-2.22.21-.89.04-1.84.07-2.85.07L12 18c-1.01 0-1.96-.03-2.85-.07-.89-.04-1.64-.11-2.22-.21-.58-.1-1.02-.27-1.32-.53-.3-.24-.52-.6-.65-1.07-.13-.47-.22-1.1-.28-1.9C4.61 13.41 4.58 12.72 4.58 12.12L4.58 12c0-.6.03-1.29.1-2.09.06-.8.15-1.43.28-1.9.13-.47.35-.83.65-1.07.3-.26.74-.43 1.32-.53.58-.1 1.33-.17 2.22-.21.89-.04 1.84-.07 2.85-.07L12 6c1.01 0 1.96.03 2.85.07.89.04 1.64.11 2.22.21.58.1 1.02.27 1.32.53.3.24.52.6.65 1.07z"
							/>
						</svg>
					</button>
					<button
						v-if="hasFeature('table')"
						class="toolbar-btn"
						title="Insert Table"
						@click="insertTable"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M20 2H4c-1.1 0-2 .9-2 2v16c0 1.1.9 2 2 2h16c1.1 0 2-.9 2-2V4c0-1.1-.9-2-2-2zM8 20H4v-4h4v4zm0-6H4v-4h4v4zm0-6H4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4zm6 12h-4v-4h4v4zm0-6h-4v-4h4v4zm0-6h-4V4h4v4z"
							/>
						</svg>
					</button>
					<button
						v-if="hasFeature('hr')"
						class="toolbar-btn"
						title="Horizontal Rule"
						@click="editor.chain().focus().setHorizontalRule().run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24"><path d="M19 13H5v-2h14v2z" /></svg>
					</button>
				</div>
				<div class="toolbar-divider"></div>
			</template>

			<!-- Table Tools (Active when inside table) -->
			<template v-if="isInsideTable">
				<div class="toolbar-group">
					<button
						class="toolbar-btn"
						title="Add Row Above"
						@click="editor.chain().focus().addRowBefore().run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M13 2H11V9H4V11H11V18H13V11H20V9H13V2Z"
								style="transform: rotate(45deg); transform-origin: center"
							/>
							<path d="M3 20H21V22H3V20Z" />
						</svg>
					</button>
					<button
						class="toolbar-btn"
						title="Add Row Below"
						@click="editor.chain().focus().addRowAfter().run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M13 2H11V9H4V11H11V18H13V11H20V9H13V2Z"
								style="transform: rotate(45deg); transform-origin: center"
							/>
							<path d="M3 2H21V4H3V2Z" />
						</svg>
					</button>
					<button
						class="toolbar-btn"
						title="Add Column Before"
						@click="editor.chain().focus().addColumnBefore().run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M13 2H11V9H4V11H11V18H13V11H20V9H13V2Z"
								style="transform: rotate(45deg); transform-origin: center"
							/>
							<path d="M20 3V21H22V3H20Z" />
						</svg>
					</button>
					<button
						class="toolbar-btn"
						title="Add Column After"
						@click="editor.chain().focus().addColumnAfter().run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M13 2H11V9H4V11H11V18H13V11H20V9H13V2Z"
								style="transform: rotate(45deg); transform-origin: center"
							/>
							<path d="M2 3V21H4V3H2Z" />
						</svg>
					</button>
					<button
						class="toolbar-btn"
						title="Delete Row"
						@click="editor.chain().focus().deleteRow().run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path d="M7 11V13H17V11H7Z" />
							<path d="M3 20H21V22H3V20Z" />
						</svg>
					</button>
					<button
						class="toolbar-btn"
						title="Delete Column"
						@click="editor.chain().focus().deleteColumn().run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M7 11V13H17V11H7Z"
								style="transform: rotate(90deg); transform-origin: center"
							/>
							<path d="M2 3V21H4V3H2Z" />
						</svg>
					</button>
					<button
						class="toolbar-btn"
						title="Merge/Split Cells"
						@click="editor.chain().focus().mergeOrSplit().run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M13 13V19H17V17H15V13H13ZM11 11V5H7V7H9V11H11ZM19 11H13V5H11V11H5V13H11V19H13V13H19V11Z"
							/>
						</svg>
					</button>
					<button
						class="toolbar-btn"
						title="Delete Table"
						@click="editor.chain().focus().deleteTable().run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M16 9V19H8V9H16ZM14.5 3L13.5 2H10.5L9.5 3H6V5H18V3H14.5ZM18 7H6V19C6 20.1 6.9 21 8 21H16C17.1 21 18 20.1 18 19V7Z"
							/>
						</svg>
					</button>
				</div>
				<div class="toolbar-divider"></div>
			</template>

			<!-- Clear -->
			<template v-if="hasFeature('clearFormat')">
				<div class="toolbar-group">
					<button
						class="toolbar-btn"
						title="Clear Formatting"
						@click="editor.chain().focus().clearNodes().unsetAllMarks().run()"
						:disabled="isSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M3.27 5L2 6.27l6.97 6.97L6.5 19h3l1.57-3.75L15.73 21 17 19.73 3.27 5zM6 5v.18L8.82 8h2.4l-.72 1.73 2.1 2.1L14.21 8H20V5H6z"
							/>
						</svg>
					</button>
				</div>
			</template>

			<div class="toolbar-spacer"></div>

			<!-- Source Code -->
			<template v-if="hasFeature('source')">
				<div class="toolbar-group">
					<button
						class="toolbar-btn"
						:class="{ active: isSourceView }"
						title="Source Code"
						@click="toggleSourceView"
					>
						<svg viewBox="0 0 24 24">
							<path
								d="M9.4 16.6L4.8 12l4.6-4.6L8 6l-6 6 6 6 1.4-1.4zm5.2 0l4.6-4.6-4.6-4.6L16 6l6 6-6 6-1.4-1.4z"
							/>
						</svg>
					</button>
				</div>
				<div class="toolbar-divider"></div>
			</template>

			<!-- Fullscreen -->
			<template v-if="hasFeature('fullscreen')">
				<div class="toolbar-group">
					<button
						class="toolbar-btn"
						:title="isFullscreen ? 'Exit Fullscreen' : 'Fullscreen'"
						@click="toggleFullscreen"
					>
						<svg
							v-if="!isFullscreen"
							viewBox="0 0 24 24"
						>
							<path
								d="M7 14H5v5h5v-2H7v-3zm-2-4h2V7h3V5H5v5zm12 7h-3v2h5v-5h-2v3zM14 5v2h3v3h2V5h-5z"
							/>
						</svg>
						<svg
							v-else
							viewBox="0 0 24 24"
						>
							<path
								d="M5 16h3v3h2v-5H5v2zm3-8H5v2h5V5H8v3zm6 11h2v-3h3v-2h-5v5zm2-11V5h-2v5h5V8h-3z"
							/>
						</svg>
					</button>
				</div>
			</template>
		</div>

		<!-- Editor Content -->
		<div class="bolt-rte-editor-area">
			<editor-content
				v-if="!isSourceView"
				:editor="editor"
				class="bolt-rte-content"
			/>
			<textarea
				v-else
				v-model="htmlSource"
				class="bolt-rte-source-editor"
				@input="updateFromSource"
				spellcheck="false"
			></textarea>
		</div>

		<!-- Hidden file input -->
		<input
			ref="fileInputRef"
			type="file"
			multiple
			accept="image/*,video/*,application/pdf,.doc,.docx,.xls,.xlsx,.zip"
			style="display: none"
			@change="handleFileInputChange"
		/>

		<!-- Link Dialog -->
		<div
			v-if="showLinkDialog"
			class="bolt-rte-dialog-overlay"
			@click.self="showLinkDialog = false"
		>
			<div class="bolt-rte-dialog">
				<h3>Insert Link</h3>
				<input
					v-model="linkUrl"
					type="url"
					placeholder="https://example.com"
					class="bolt-rte-dialog-input"
					@keydown.enter="confirmLink"
					@keydown.esc="showLinkDialog = false"
					ref="linkInputRef"
				/>
				<div class="bolt-rte-dialog-actions">
					<button
						class="dialog-btn cancel"
						@click="showLinkDialog = false"
					>
						Cancel
					</button>
					<button
						class="dialog-btn confirm"
						@click="confirmLink"
					>
						Insert
					</button>
				</div>
			</div>
		</div>

		<!-- Video Embed Dialog -->
		<div
			v-if="showVideoEmbedDialog"
			class="bolt-rte-dialog-overlay"
			@click.self="showVideoEmbedDialog = false"
		>
			<div class="bolt-rte-dialog">
				<h3>Embed Video</h3>
				<p style="font-size: 12px; margin-bottom: 8px; opacity: 0.7">
					Paste YouTube, Vimeo or Direct Video URL
				</p>
				<input
					v-model="videoEmbedUrl"
					type="url"
					placeholder="https://www.youtube.com/watch?v=..."
					class="bolt-rte-dialog-input"
					@keydown.enter="confirmVideoEmbed"
					@keydown.esc="showVideoEmbedDialog = false"
					ref="videoEmbedInputRef"
				/>
				<div class="bolt-rte-dialog-actions">
					<button
						class="dialog-btn cancel"
						@click="showVideoEmbedDialog = false"
					>
						Cancel
					</button>
					<button
						class="dialog-btn confirm"
						@click="confirmVideoEmbed"
					>
						Embed
					</button>
				</div>
			</div>
		</div>

		<!-- Table Dialog -->
		<div
			v-if="showTableDialog"
			class="bolt-rte-dialog-overlay"
			@click.self="showTableDialog = false"
		>
			<div class="bolt-rte-dialog">
				<h3>Insert Table</h3>
				<div class="bolt-rte-dialog-row">
					<div class="dialog-field">
						<label>Rows</label>
						<input
							v-model.number="tableRows"
							type="number"
							min="1"
							max="10"
							class="bolt-rte-dialog-input"
						/>
					</div>
					<div class="dialog-field">
						<label>Columns</label>
						<input
							v-model.number="tableCols"
							type="number"
							min="1"
							max="10"
							class="bolt-rte-dialog-input"
						/>
					</div>
				</div>
				<div
					class="bolt-rte-dialog-row"
					style="margin-bottom: 20px"
				>
					<label
						style="
							display: flex;
							align-items: center;
							gap: 8px;
							cursor: pointer;
						"
					>
						<input
							v-model="tableWithHeader"
							type="checkbox"
						/>
						Include Header Row
					</label>
				</div>
				<div class="bolt-rte-dialog-actions">
					<button
						class="dialog-btn cancel"
						@click="showTableDialog = false"
					>
						Cancel
					</button>
					<button
						class="dialog-btn confirm"
						@click="confirmTable"
					>
						Insert Table
					</button>
				</div>
			</div>
		</div>
	</div>
</template>

<script>
import { inject, ref, watch, onBeforeUnmount, nextTick, computed } from "vue";
import { useEditor, EditorContent } from "@tiptap/vue-3";
import { StarterKit } from "@tiptap/starter-kit";
import { Link } from "@tiptap/extension-link";
import { Image } from "@tiptap/extension-image";
import { Table } from "@tiptap/extension-table";
import { TableRow } from "@tiptap/extension-table-row";
import { TableHeader } from "@tiptap/extension-table-header";
import { TableCell } from "@tiptap/extension-table-cell";
import { TextAlign } from "@tiptap/extension-text-align";
import { Underline } from "@tiptap/extension-underline";
import { Placeholder } from "@tiptap/extension-placeholder";
import { Node, mergeAttributes } from "@tiptap/core";
import { TextStyle } from "@tiptap/extension-text-style";
import { Color } from "@tiptap/extension-color";
import { Highlight } from "@tiptap/extension-highlight";

// ─── Custom Table Extensions ──────────────────────────────────────
const CustomTableCell = TableCell.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			backgroundColor: {
				default: null,
				parseHTML: (element) =>
					element.getAttribute("data-background-color") ||
					element.style.backgroundColor ||
					null,
				renderHTML: (attributes) => {
					if (!attributes.backgroundColor) return {};
					return {
						"data-background-color": attributes.backgroundColor,
						style: `background-color: ${attributes.backgroundColor}`,
					};
				},
			},
		};
	},
});

// ─── Custom Text Style Extension (Font Size) ────────────────────
const FontSize = TextStyle.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			fontSize: {
				default: null,
				parseHTML: (element) => element.style.fontSize.replace(/['"]+/g, ""),
				renderHTML: (attributes) => {
					if (!attributes.fontSize) return {};
					return {
						style: `font-size: ${attributes.fontSize}`,
					};
				},
			},
		};
	},
});

const CustomTableHeader = TableHeader.extend({
	addAttributes() {
		return {
			...this.parent?.(),
			backgroundColor: {
				default: null,
				parseHTML: (element) =>
					element.getAttribute("data-background-color") ||
					element.style.backgroundColor ||
					null,
				renderHTML: (attributes) => {
					if (!attributes.backgroundColor) return {};
					return {
						"data-background-color": attributes.backgroundColor,
						style: `background-color: ${attributes.backgroundColor}`,
					};
				},
			},
		};
	},
});

// ─── Custom Video Extension ──────────────────────────────────────
const VideoNode = Node.create({
	name: "video",
	group: "block",
	selectable: true,
	draggable: true,
	atom: true,

	addAttributes() {
		return {
			src: { default: null },
			controls: { default: true },
			width: { default: "100%" },
		};
	},

	parseHTML() {
		return [{ tag: "video" }];
	},

	renderHTML({ HTMLAttributes }) {
		return [
			"video",
			mergeAttributes(HTMLAttributes, {
				style: "max-width: 100%; border-radius: 8px;",
			}),
		];
	},

	addCommands() {
		return {
			setVideo:
				(options) =>
				({ commands }) => {
					return commands.insertContent({
						type: this.name,
						attrs: options,
					});
				},
		};
	},
});

// ─── Custom Iframe Extension ──────────────────────────────────────
const IframeNode = Node.create({
	name: "iframe",
	group: "block",
	selectable: true,
	draggable: true,
	atom: true,
	addAttributes() {
		return {
			src: { default: null },
			width: { default: "100%" },
			height: { default: 400 },
			frameborder: { default: 0 },
			allowfullscreen: { default: true },
		};
	},
	parseHTML() {
		return [{ tag: "iframe" }];
	},
	renderHTML({ HTMLAttributes }) {
		return [
			"iframe",
			mergeAttributes(HTMLAttributes, {
				style: "max-width: 100%; border-radius: 8px;",
			}),
		];
	},
});

export default {
	components: { EditorContent },
	props: {
		value: {
			type: String,
			default: "",
		},
		toolbar: {
			type: Array,
			default: null, // null = all features enabled
		},
		// eslint-disable-next-line vue/prop-name-casing
		font_family: {
			type: String,
			default: "",
		},
	},
	emits: ["input"],
	setup(props, { emit }) {
		const api = inject("api");
		const isFocused = ref(false);
		const isSourceView = ref(false);
		const htmlSource = ref("");

		// Trả về true nếu feature được bật (hoặc toolbar chưa cấu hình)
		const hasFeature = (key) => {
			if (
				!props.toolbar ||
				!Array.isArray(props.toolbar) ||
				props.toolbar.length === 0
			)
				return true;
			return props.toolbar.includes(key);
		};
		const fileInputRef = ref(null);
		const showLinkDialog = ref(false);
		const linkUrl = ref("");
		const linkInputRef = ref(null);

		const showVideoEmbedDialog = ref(false);
		const videoEmbedUrl = ref("");
		const videoEmbedInputRef = ref(null);

		const showTableDialog = ref(false);
		const tableRows = ref(3);
		const tableCols = ref(3);
		const tableWithHeader = ref(true);

		const textColor = ref("#000000");
		const cellColor = ref("#ffffff");

		// ─── Tiptap editor ────────────────────────────────────────────────
		const editor = useEditor({
			content: props.value || "",
			extensions: [
				StarterKit,
				Underline,
				VideoNode,
				IframeNode,
				FontSize,
				TextStyle,
				Color,
				Highlight.configure({ multicolor: true }),

				TextAlign.configure({ types: ["heading", "paragraph"] }),
				Link.configure({
					openOnClick: false,
					HTMLAttributes: { target: "_blank", rel: "noopener" },
				}),
				Image.configure({ inline: false, allowBase64: false }),
				Table.configure({ resizable: true }),
				TableRow,
				CustomTableHeader,
				CustomTableCell,
				Placeholder.configure({ placeholder: "Start typing…" }),
			],
			onUpdate({ editor }) {
				emit("input", editor.getHTML());
			},
			onFocus() {
				isFocused.value = true;
			},
			onBlur() {
				isFocused.value = false;
			},
		});

		const isInsideTable = computed(() => {
			if (!editor.value) return false;
			return editor.value.isActive("table");
		});

		// ─── Helper: upload files to Directus ─────────────────────────────
		const uploadFiles = async (files) => {
			if (!files || files.length === 0) return;
			const fileList = Array.from(files);

			// Upload tất cả files
			const results = await Promise.all(
				fileList.map(async (file) => {
					const formData = new FormData();
					formData.append("file", file, file.name);
					try {
						const response = await api.post("/files", formData, {
							headers: { "Content-Type": "multipart/form-data" },
						});
						const fileId = response.data.data.id;
						const rawBase = api.defaults.baseURL || "";
						const baseUrl = rawBase.endsWith("/")
							? rawBase.slice(0, -1)
							: rawBase;
						return { url: `${baseUrl}/assets/${fileId}`, file };
					} catch (err) {
						console.error("Upload failed:", err);
						return null;
					}
				}),
			);

			// Xử lý và gom tất cả nội dung vào một khối HTML để insert một lần duy nhất
			let combinedHTML = "";
			for (const result of results) {
				if (!result) continue;
				const { url, file } = result;

				if (file.type.startsWith("image/")) {
					combinedHTML += `<img src="${url}" alt="${file.name}" style="max-width:100%;height:auto;" />`;
				} else if (file.type.startsWith("video/")) {
					combinedHTML += `<video src="${url}" controls style="max-width: 100%; border-radius: 8px;"></video>`;
				} else {
					combinedHTML += `<p><a href="${url}" target="_blank" rel="noopener">${file.name}</a></p>`;
				}
			}

			if (combinedHTML) {
				editor.value.chain().focus("end").insertContent(combinedHTML).run();
			}
		};

		// Sync external value changes (e.g. reset from parent)
		watch(
			() => props.value,
			(newVal) => {
				if (!editor.value) return;
				if (newVal !== editor.value.getHTML()) {
					editor.value.commands.setContent(newVal || "", false);
				}
			},
		);

		onBeforeUnmount(() => {
			editor.value?.destroy();
		});

		// ─── Toolbar actions ──────────────────────────────────────────────
		const setHeading = (e) => {
			const val = e.target.value;
			if (val === "paragraph") {
				editor.value.chain().focus().setParagraph().run();
			} else {
				editor.value
					.chain()
					.focus()
					.setHeading({ level: parseInt(val) })
					.run();
			}
		};

		const insertLink = () => {
			const prev = editor.value.getAttributes("link").href || "";
			linkUrl.value = prev;
			showLinkDialog.value = true;
			nextTick(() => linkInputRef.value?.focus());
		};

		const confirmLink = () => {
			if (!linkUrl.value) {
				editor.value.chain().focus().unsetLink().run();
			} else {
				editor.value.chain().focus().setLink({ href: linkUrl.value }).run();
			}
			showLinkDialog.value = false;
			linkUrl.value = "";
		};

		const insertTable = () => {
			showTableDialog.value = true;
		};

		const confirmTable = () => {
			editor.value
				.chain()
				.focus()
				.insertTable({
					rows: tableRows.value,
					cols: tableCols.value,
					withHeaderRow: tableWithHeader.value,
				})
				.run();
			showTableDialog.value = false;
		};

		const setTextColor = (color) => {
			editor.value.chain().focus().setColor(color).run();
		};

		const setCellColor = (color) => {
			editor.value
				.chain()
				.focus()
				.setCellAttribute("backgroundColor", color)
				.run();
		};

		const triggerImageUpload = () => {
			if (fileInputRef.value) {
				fileInputRef.value.accept = "image/*";
				fileInputRef.value?.click();
			}
		};

		const triggerVideoUpload = () => {
			if (fileInputRef.value) {
				fileInputRef.value.accept = "video/*";
				fileInputRef.value?.click();
			}
		};

		const insertVideoEmbed = () => {
			videoEmbedUrl.value = "";
			showVideoEmbedDialog.value = true;
			nextTick(() => videoEmbedInputRef.value?.focus());
		};

		const confirmVideoEmbed = () => {
			if (videoEmbedUrl.value) {
				// Handle YouTube URLs specially if it looks like YouTube
				let url = videoEmbedUrl.value;
				if (url.includes("youtube.com") || url.includes("youtu.be")) {
					// We'll just use an iframe for simplicity if we don't have the YouTube extension
					// But for now, let's use the generic video node if it's a direct link,
					// or we'll need an Iframe extension for YouTube.
					// Let's implement Video node to handle arbitrary video tags or simply use an embed code logic.
					editor.value
						.chain()
						.focus()
						.insertContent(
							`<iframe src="${url.replace("watch?v=", "embed/")}" width="100%" height="400" frameborder="0" allowfullscreen></iframe>`,
						)
						.run();
				} else {
					editor.value.chain().focus().setVideo({ src: url }).run();
				}
			}
			showVideoEmbedDialog.value = false;
			videoEmbedUrl.value = "";
		};

		const handleFileInputChange = (e) => {
			uploadFiles(e.target.files);
			e.target.value = "";
		};

		const handleDrop = (event) => {
			const files = event.dataTransfer?.files;
			uploadFiles(files);
		};

		const isFullscreen = ref(false);
		const toggleFullscreen = () => {
			isFullscreen.value = !isFullscreen.value;
		};

		const currentFontSize = computed(() => {
			if (!editor.value) return "16px";
			return editor.value.getAttributes("textStyle").fontSize || "16px";
		});

		const changeFontSize = (delta) => {
			const current = parseInt(currentFontSize.value);
			const newSize = current + delta;
			if (newSize < 8 || newSize > 100) return;
			editor.value
				.chain()
				.focus()
				.setMark("textStyle", { fontSize: `${newSize}px` })
				.run();
		};

		const toggleSourceView = () => {
			if (isSourceView.value) {
				editor.value.commands.setContent(htmlSource.value, true);
				isSourceView.value = false;
			} else {
				htmlSource.value = editor.value.getHTML();
				isSourceView.value = true;
			}
		};

		const updateFromSource = (e) => {
			htmlSource.value = e.target.value;
			emit("input", htmlSource.value);
		};

		return {
			editor,
			isFocused,
			isFullscreen,
			toggleFullscreen,
			hasFeature,
			fileInputRef,
			showLinkDialog,
			linkUrl,
			linkInputRef,
			showVideoEmbedDialog,
			videoEmbedUrl,
			videoEmbedInputRef,
			setHeading,
			insertLink,
			confirmLink,
			confirmVideoEmbed,
			handleFileInputChange,
			handleDrop,
			// Upload tools
			triggerImageUpload,
			triggerVideoUpload,
			insertVideoEmbed,
			// Table
			showTableDialog,
			tableRows,
			tableCols,
			tableWithHeader,
			insertTable,
			confirmTable,
			isInsideTable,
			textColor,
			cellColor,
			setTextColor,
			setCellColor,
			isSourceView,
			htmlSource,
			toggleSourceView,
			updateFromSource,
			currentFontSize,
			changeFontSize,
		};
	},
};
</script>

<style>
/* ── Wrapper ──────────────────────────────────────────────────────────── */
.bolt-rte-wrapper {
	border: var(--theme--border-width, 2px) solid
		var(--theme--form--field--input--border-color, var(--border-normal));
	border-radius: var(--theme--border-radius, 6px);
	background: var(
		--theme--form--field--input--background,
		var(--background-page)
	);
	color: var(--theme--form--field--input--foreground, var(--foreground-normal));
	font-family: var(--theme--fonts--sans--font-family, var(--font-sans));
	transition:
		border-color 0.2s ease,
		box-shadow 0.2s ease;
	overflow: hidden;
	display: flex;
	flex-direction: column;
}

/* ── Fullscreen mode ──────────────────────────────────────────────────── */
.bolt-rte-wrapper.is-fullscreen {
	position: fixed;
	inset: 0;
	z-index: 500;
	border-radius: 0;
	border: none;
	box-shadow: none;
}

.bolt-rte-wrapper.is-focused {
	border-color: var(--theme--primary, var(--primary));
}

/* ── Toolbar ──────────────────────────────────────────────────────────── */
.bolt-rte-toolbar {
	display: flex;
	flex-wrap: wrap;
	align-items: center;
	gap: 2px;
	padding: 6px 8px;
	position: sticky;
	top: 0;
	z-index: 1;
	border-bottom: var(--theme--border-width, 2px) solid
		var(--theme--form--field--input--border-color, var(--border-normal));
	background: var(--theme--background-subdued, var(--background-subdued));
}

.toolbar-group {
	display: flex;
	align-items: center;
	gap: 1px;
}

.toolbar-divider {
	width: 1px;
	height: 20px;
	background: var(
		--theme--form--field--input--border-color,
		var(--border-normal)
	);
	margin: 0 4px;
	flex-shrink: 0;
}

.toolbar-spacer {
	flex: 1;
}

.toolbar-btn {
	display: inline-flex;
	align-items: center;
	justify-content: center;
	width: 30px;
	height: 30px;
	border: none;
	border-radius: var(--theme--border-radius, 4px);
	background: transparent;
	color: var(--theme--form--field--input--foreground, var(--foreground-normal));
	cursor: pointer;
	transition:
		background 0.15s ease,
		color 0.15s ease;
	padding: 4px;
}

.toolbar-btn svg {
	width: 16px;
	height: 16px;
	fill: currentColor;
}

.toolbar-btn:hover {
	background: var(--theme--background-subdued, var(--background-subdued));
}

.toolbar-btn.active {
	background: var(--theme--primary-background, var(--primary-10));
	color: var(--theme--primary, var(--primary));
}

.toolbar-btn:disabled {
	opacity: 0.4;
	cursor: not-allowed;
}

.toolbar-select {
	height: 30px;
	padding: 0 8px;
	border: 1px solid
		var(--theme--form--field--input--border-color, var(--border-normal));
	border-radius: var(--theme--border-radius, 4px);
	background: var(
		--theme--form--field--input--background,
		var(--background-page)
	);
	color: var(--theme--form--field--input--foreground, var(--foreground-normal));
	font-size: 13px;
	cursor: pointer;
}

.toolbar-color-picker {
	position: relative;
	width: 30px;
	height: 30px;
	display: flex;
	align-items: center;
	justify-content: center;
	cursor: pointer;
}

.toolbar-color-picker input[type="color"] {
	position: absolute;
	inset: 0;
	opacity: 0;
	width: 100%;
	height: 100%;
	cursor: pointer;
}

.toolbar-color-picker svg {
	width: 16px;
	height: 16px;
	pointer-events: none;
}

/* ── Content Area ────────────────────────────────────────────────────── */
.bolt-rte-editor-area {
	flex: 1;
	overflow-y: auto;
	padding: 12px;
	min-height: 200px;
	display: flex;
	flex-direction: column;
}

.bolt-rte-source-editor {
	flex: 1;
	width: 100%;
	height: 100%;
	border: none;
	outline: none;
	background: transparent;
	color: inherit;
	font-family: var(--theme--fonts--monospace--font-family, var(--font-mono));
	font-size: 14px;
	padding: 0;
	resize: none;
	line-height: 1.5;
}

.bolt-rte-wrapper.is-fullscreen .bolt-rte-editor-area {
	padding: 40px 10%;
	background: var(
		--theme--form--field--input--background,
		var(--background-page)
	);
}

/* ── Tiptap Content Styles ───────────────────────────────────────────── */
.bolt-rte-content .tiptap {
	outline: none;
	min-height: 100%;
	font-family: var(--bolt-rte-font, inherit);
}

.bolt-rte-content .tiptap p.is-editor-empty:first-child::before {
	content: attr(data-placeholder);
	float: left;
	color: var(--theme--foreground-subdued, var(--foreground-subdued));
	pointer-events: none;
	height: 0;
}

.bolt-rte-content .tiptap p {
	margin: 0.5em 0;
}

.bolt-rte-content .tiptap h1,
.bolt-rte-content .tiptap h2,
.bolt-rte-content .tiptap h3,
.bolt-rte-content .tiptap h4,
.bolt-rte-content .tiptap h5,
.bolt-rte-content .tiptap h6 {
	margin: 1em 0 0.5em;
	line-height: 1.2;
}

.bolt-rte-content .tiptap ul,
.bolt-rte-content .tiptap ol {
	padding-left: 1.5em;
	margin: 0.5em 0;
}

.bolt-rte-content .tiptap blockquote {
	border-left: 3px solid
		var(--theme--form--field--input--border-color, var(--border-normal));
	padding-left: 1em;
	margin-left: 0;
	font-style: italic;
	color: var(--theme--foreground-subdued, var(--foreground-subdued));
}

.bolt-rte-content .tiptap code {
	background: var(--theme--background-subdued, var(--background-subdued));
	padding: 0.2em 0.4em;
	border-radius: 4px;
	font-family: var(--theme--fonts--monospace--font-family, var(--font-mono));
	font-size: 0.9em;
}

.bolt-rte-content .tiptap pre {
	background: #2d2d2d;
	color: #ccc;
	padding: 1em;
	border-radius: 6px;
	overflow-x: auto;
	margin: 1em 0;
}

.bolt-rte-content .tiptap pre code {
	background: transparent;
	padding: 0;
	color: inherit;
	font-size: inherit;
}

.bolt-rte-content .tiptap img {
	max-width: 100%;
	height: auto;
	border-radius: var(--theme--border-radius, 4px);
	display: block;
	margin: 0.5em 0;
	cursor: default;
	outline: 2px solid transparent;
	outline-offset: 2px;
	transition: outline-color 0.15s ease;
}

/* Indicator khi ảnh được chọn (click) */
.bolt-rte-content .tiptap img.ProseMirror-selectednode {
	outline: 2px solid
		color-mix(in srgb, var(--theme--primary, var(--primary)) 40%, transparent);
	outline-offset: 2px;
	border-radius: var(--theme--border-radius, 4px);
}

.bolt-rte-content .tiptap video,
.bolt-rte-content .tiptap iframe {
	max-width: 100%;
	border-radius: var(--theme--border-radius, 8px);
	display: block;
	margin: 1em 0;
}

.bolt-rte-content .tiptap video.ProseMirror-selectednode,
.bolt-rte-content .tiptap iframe.ProseMirror-selectednode {
	outline: 2px solid
		color-mix(in srgb, var(--theme--primary, var(--primary)) 40%, transparent);
	outline-offset: 2px;
}

.bolt-rte-content .tiptap hr {
	border: none;
	border-top: 1px solid
		var(--theme--form--field--input--border-color, var(--border-normal));
	margin: 2em 0;
}

/* ── Table ────────────────────────────────────────────────────────────── */
.bolt-rte-content .tiptap table {
	border-collapse: collapse;
	width: 100%;
	margin: 1em 0;
	overflow: hidden;
}

.bolt-rte-content .tiptap table th,
.bolt-rte-content .tiptap table td {
	border: 1px solid
		var(--theme--form--field--input--border-color, var(--border-normal));
	padding: 0.4rem 0.6rem;
	min-width: 60px;
	position: relative;
	text-align: left;
}

.bolt-rte-content .tiptap table th {
	background: var(--theme--background-subdued, var(--background-subdued));
	font-weight: bold;
}

.bolt-rte-content .tiptap table .selectedCell::after {
	content: "";
	position: absolute;
	inset: 0;
	background: var(--theme--primary-background, var(--primary-10));
	pointer-events: none;
	z-index: 2;
}

/* ── Dialogs ──────────────────────────────────────────────────────────── */
.bolt-rte-dialog-overlay {
	position: fixed;
	inset: 0;
	background: rgba(0, 0, 0, 0.5);
	display: flex;
	align-items: center;
	justify-content: center;
	z-index: 1000;
}

.bolt-rte-dialog {
	background: white;
	border: var(--theme--border-width, 2px) solid
		var(--theme--form--field--input--border-color, var(--border-normal));
	border-radius: var(--theme--border-radius, 8px);
	padding: 20px;
	width: 400px;
	box-shadow: 0 4px 12px rgba(0, 0, 0, 0.15);
}

.bolt-rte-dialog h3 {
	margin-top: 0;
	margin-bottom: 16px;
}

.bolt-rte-dialog-input {
	width: 100%;
	height: 40px;
	padding: 0 12px;
	border: 1px solid
		var(--theme--form--field--input--border-color, var(--border-normal));
	border-radius: var(--theme--border-radius, 4px);
	margin-bottom: 16px;
	outline: none;
}

.bolt-rte-dialog-input:focus {
	border-color: var(--theme--primary, var(--primary));
}

.bolt-rte-dialog-actions {
	display: flex;
	justify-content: flex-end;
	gap: 12px;
}

.dialog-btn {
	height: 36px;
	padding: 0 16px;
	border-radius: var(--theme--border-radius, 4px);
	border: none;
	cursor: pointer;
	font-weight: bold;
}

.dialog-btn.cancel {
	background: var(--theme--background-subdued, var(--background-subdued));
}

.dialog-btn.confirm {
	background: var(--theme--primary, var(--primary));
	color: white;
}
.bolt-rte-dialog-row {
	display: flex;
	gap: 16px;
	margin-bottom: 16px;
}

.dialog-field {
	flex: 1;
}

.dialog-field label {
	display: block;
	font-size: 12px;
	margin-bottom: 4px;
	opacity: 0.7;
}
</style>
