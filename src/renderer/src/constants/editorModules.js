import { PAGE_SIZES } from "./pageSizes";


// Undo and redo functions for Custom Toolbar
function undoChange() {
    this.quill.history.undo();
}

function redoChange() {
    this.quill.history.redo();
}


// Renderer process: src/preload/index.js

export const openFile = async () => {
    try {
        // Call the Electron API to open a file
        const result = await window.electronAPI.openFile();

        // Check if an error is returned from the Electron API
        if (result && result.error) {
            throw new Error(result.error);
        }

        // Assuming 'result' contains the file content, load it into the Quill editor
        const quill = document.querySelector('.ql-editor'); // Get the Quill editor instance
        quill.innerHTML = result.content; // Set the file content to the editor
    } catch (error) {
        console.error('Error opening file:', error);
        alert('Failed to open file');
    }
};


const saveFile = () => {
    const content = document.querySelector(".ql-editor").innerHTML; // Get the editor content
    const blob = new Blob([content], { type: "text/html" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "document.txt"; // Name of the saved file
    link.click();
};

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
