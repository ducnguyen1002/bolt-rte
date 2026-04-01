# Bolt Rich Text Editor (Bolt RTE)

A professional, feature-rich Tiptap interface extension for Directus with advanced file handling and customizable toolbar.

## 🚀 Features

- **Seamless Tiptap Integration**: A modern, reliable, and highly customizable rich text editor.
- **Multi-file Upload Button**: A toolbar button to select and upload multiple images or files at once.
- **Multi-file Drag & Drop**: Effortlessly upload multiple images or files by dragging them directly into the editor.
- **Directus API Integration**: Automatically handles file uploads to your Directus `/files` endpoint and inserts them into your content.
- **Smart Content Handling**:
  - **Images**: Automatically inserted as `<img>` tags with responsive styles.
  - **Other Files**: Automatically inserted as download links.
- **Clipboard Support**: Paste images directly from your clipboard for instant upload.
- **Configurable Features**: Toggle toolbar features (headings, alignment, lists, tables, etc.) via the Directus interface settings.
- **Custom Fonts**: Choose your preferred font family directly from the interface settings.
- **Fullscreen Mode**: Expand the editor for a distraction-free writing experience.

## 🛠️ Installation

### 1. Clone the repository

```bash
git clone https://github.com/ducnguyen1002/bolt-rte.git
cd bolt-rte
```

### 2. Install dependencies

```bash
npm install
```

### 3. Build the extension

```bash
npm run build
```

### 4. Deploy to Directus

Copy the generated `dist/index.js` file (and any required assets) to your Directus extensions folder:
`extensions/interfaces/bolt-rte/index.js`

Alternatively, you can link the extension for development:

```bash
npm run link
```

## 📖 Usage

1.  Log in to your Directus Admin Panel.
2.  Navigate to **Settings** > **Data Model**.
3.  Select a collection and a `Text` or `CSV` field. (Works best with `Text`).
4.  Change the **Interface** to **Bolt RTE**.
5.  Save the changes.

## ⚙️ Configuration

You can customize the toolbar and the default editor font directly within the Directus field settings under **Interface Options**:

- **Toolbar Features**: Enable or disable specific buttons (e.g., Bold, Italic, Tables, Image Upload, etc.).
- **Editor Font Family**: Choose from common fonts like Inter, Roboto, or standard Serif/Monospace fonts.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
