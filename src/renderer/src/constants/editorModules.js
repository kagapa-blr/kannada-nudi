import { openFile, saveFile, saveFileAs } from '../services/toolbarFunctions.js';
import { PAGE_SIZES } from "./pageSizes";

// Undo and redo functions for the Custom Toolbar
function undoChange() {
    this.quill.history.undo();
}

function redoChange() {
    this.quill.history.redo();
}

const ZoomOutButton = ()=>{
    console.log('ZoomOut-button')
}
const ZoomInButton = ()=>{
    console.log('ZoomInButton')
}


// Custom Refresh Button Handler
const refreshButton = () => {
    console.log('Refresh button clicked. Define your behavior here.');
};
const findWordinWindow = () => {
    console.log('search functionality implemented separately')
}
const spellcheckButton = () => {
    console.log('search functionality implemented separately')
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
            "searchWord-button": findWordinWindow,
            "ZoomOut-button":ZoomOutButton,
            "ZoomIn-button":ZoomInButton,
            "Spellcheck-button":spellcheckButton,
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
            open: async function () {
                try {
                    await openFile();
                } catch (error) {
                    console.error('Error opening file:', error);
                }
            },
            // Save file handler
            save: async function () {
                try {
                    const content = this.quill.root.innerHTML; // Get the HTML content from the editor
                    await saveFile(content); // Pass the content to saveFile
                } catch (error) {
                    console.error('Error saving file:', error);
                }
            },
            // Save as handler (passing content from Quill editor)
            saveAs: async function () {
                try {
                    const content = this.quill.root.innerHTML; // Get the HTML content from the editor
                    await saveFileAs(content); // Pass the content to saveFileAs
                } catch (error) {
                    console.error('Error saving file as:', error);
                }
            },
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
