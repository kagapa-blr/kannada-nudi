// Import necessary dependencies
import QuillResizeImage from 'quill-resize-image';
import { Quill } from 'react-quill-new';
import { FONT_SIZES, FONTS } from '../constants/Nudifonts.js';
import { saveFile } from '../services/toolbarFunctions.js';
import { PAGE_SIZES } from './pageSizes';

// Register Quill modules and formats
Quill.register('modules/resize', QuillResizeImage);

const Size = Quill.import('attributors/style/size');

Size.whitelist = FONT_SIZES;
Quill.register(Size, true);

export const Font = Quill.import('formats/font');
Font.whitelist = FONTS;
Quill.register(Font, true);

// Undo and redo functions
function undoChange() {
    this.quill.history.undo();
}

function redoChange() {
    this.quill.history.redo();
}

// Custom Toolbar Handlers
const handlers = {
    undo: undoChange,
    redo: redoChange,
    "page-size": function (value) {
        const selectedSize = PAGE_SIZES[value];
        if (selectedSize) {
            this.quill.root.style.width = `${selectedSize.width}px`;
            this.quill.root.style.minHeight = `${selectedSize.height}px`;
        }
    },
    "refresh-button": () => {
        console.log('Refresh button clicked. Define your behavior here.');
    },
    "searchWord-button": () => {
        console.log('Search functionality implemented separately.');
    },
    "ZoomOut-button": () => {
        console.log('ZoomOut-button');
    },
    "ZoomIn-button": () => {
        console.log('ZoomIn-button');
    },
    "Spellcheck-button": () => {
        console.log('Spellcheck functionality implemented separately.');
    },
    voiceTotext: () => { },
    font: function (value) {
        if (value) {
            this.quill.format("font", value);
        }
    },
    size: function (value) {
        if (value) {
            this.quill.format("size", value);
        }
    },
    open: function () {
        console.log('file open defined sepeately in toolbar')
    },
    save: async function () {
        try {
            const content = this.quill.root.innerHTML;
            await saveFile(content);
        } catch (error) {
            console.error('Error saving file:', error);
        }
    },
    saveAs: async function () {
        try {
            //const content = this.quill.root.innerHTML;
            //await saveFileAs(content);
            console.log('Save As imlemented separately on toolbar JSX')
        } catch (error) {
            console.error('Error saving file as:', error);
        }
    },
};

// Modules configuration for Quill editor
export const modules = {
    toolbar: {
        container: "#toolbar",
        handlers,
    },
    history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
    },
    resize: {},
};
