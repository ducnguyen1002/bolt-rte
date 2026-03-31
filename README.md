# Bolt Rich Text Editor (Bolt RTE)

A professional, feature-rich TinyMCE interface extension for Directus with advanced file handling capabilities.

## 🚀 Features

- **Seamless TinyMCE Integration**: A powerful, reliable, and user-friendly rich text editor.
- **Multi-file Upload Button**: A dedicated toolbar button to select and upload multiple images at once.
- **Multi-file Drag & Drop**: Effortlessly upload multiple images or files by dragging them directly into the editor or the editor container.
- **Directus API Integration**: Automatically uploads files to the Directus `/files` endpoint and inserts them into your content.
- **Smart Content Handling**:
  - **Images**: Automatically inserted as `<img>` tags.
  - **Other Files**: Automatically inserted as download links.
- **Clipboard Support**: Paste images directly from your clipboard.
- **Customizable**: Built using TinyMCE 6, allowing for extensive plugin and toolbar customization.

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
3.  Select a collection and a `Text` or `String` field.
4.  Change the **Interface** to **Bolt Rich Text Editor**.
5.  Save the changes.

## ⚙️ Configuration

The editor is pre-configured with a comprehensive set of plugins, including:

- `advlist`, `autolink`, `lists`, `link`, `image`, `charmap`, `preview`
- `anchor`, `searchreplace`, `visualblocks`, `code`, `fullscreen`
- `insertdatetime`, `media`, `table`, `help`, `wordcount`

You can modify the `editorConfig` in `src/interface.vue` to further customize the toolbar and plugins to suit your needs.

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.
