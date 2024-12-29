
//src/renderer/src/services/fileOperations.js

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


// src/renderer/src/services/fileOperations.js

export const saveFileAs = async (content) => {
    try {
        // Call the Electron API to save the file as a new file
        const result = await window.electronAPI.saveFileAs(content);

        // Check if an error is returned from the Electron API
        if (result && result.error) {
            throw new Error(result.error);
        }

        // Optionally, notify the user of the successful file save
        alert('File saved successfully at: ' + result.filePath);
    } catch (error) {
        console.error('Error saving file as:', error);
        alert('Failed to save file');
    }
};

export const saveFile = async (filePath, content) => {
    try {
        // Call the Electron API to save the file to the specified path
        const result = await window.electronAPI.saveFile(filePath, content);

        // Check if an error is returned from the Electron API
        if (result && result.error) {
            throw new Error(result.error);
        }

        // Optionally, notify the user of the successful file save
        alert('File saved successfully at: ' + filePath);
    } catch (error) {
        console.error('Error saving file:', error);
        alert('Failed to save file');
    }
};


