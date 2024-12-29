import { openFile, saveFile, saveFileAs } from '../services/toolbarFunctions.js';
import { PAGE_SIZES } from "./pageSizes";

// Undo and redo functions for Custom Toolbar
function undoChange() {
    this.quill.history.undo();
}

function redoChange() {
    this.quill.history.redo();
}

const refreshButton = () => {
    console.log('handle function defined separately');
}

// Modules object for setting up the Quill editor
export const modules = {
    toolbar: {
        container: "#toolbar",
        handlers: {
            undo: undoChange,
            redo: redoChange,
            // Custom handler for page size
            "page-size": function (value) {
                const selectedSize = PAGE_SIZES[value];
                if (selectedSize) {
                    this.quill.root.style.width = `${selectedSize.width}px`;
                    this.quill.root.style.minHeight = `${selectedSize.height}px`;
                }
            },
            "refresh-button": refreshButton,
            // Add custom handlers for font and size
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
            // Open file handler
            open: openFile,
            // Save file handler
            save: saveFile,
            saveAs: saveFileAs


        },
    },
    history: {
        delay: 500,
        maxStack: 100,
        userOnly: true,
    },
    // Add the resize module here
    resize: {},
};
