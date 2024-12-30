export const openFile = async () => {
    try {
        // Call the Electron API to open a file
        const result = await window.electronAPI.openFile();

        // Check if an error is returned or if the result is null/undefined
        if (!result || result.error) {
            throw new Error(result?.error || 'No file selected');
        }

        // Log the file path in the console
        console.log('Opened file path:', result.filePath);

        // Set the window title to the file path
        window.electronAPI.setWindowTitle(result.filePath);

        // Load the file content into the Quill editor
        const quillEditor = document.querySelector('.ql-editor');
        if (quillEditor) {
            quillEditor.innerHTML = result.content;
        } else {
            throw new Error('Quill editor not found');
        }
    } catch (error) {
        console.error('Error opening file:', error);
        alert('Failed to open file: ' + error.message);
    }
};

export const saveFile = async (content) => {
    try {
        // Get the current window title to determine the file path
        const title = await window.electronAPI.getWindowTitle();

        if (!title || title === 'Untitled') {
            // If no valid title, fallback to "Save As"
            await saveFileAs(content);
            return;
        }

        const filePath = title;

        // Call the Electron API to save the file
        const result = await window.electronAPI.saveFile(filePath, content);

        if (!result || result.error) {
            throw new Error(result?.error || 'Unknown error saving file');
        }

        // Notify the user of the successful save
        alert('File saved successfully at: ' + filePath);
    } catch (error) {
        console.error('Error saving file:', error);
        alert('Failed to save file: ' + error.message);
    }
};

export const saveFileAs = async (content) => {
    try {
        // Call the Electron API to save the file as a new file
        const filePath = await window.electronAPI.saveFileAs(content);

        if (!filePath || filePath.error) {
            throw new Error(filePath?.error || 'File save canceled');
        }

        console.log('Saved file path:', filePath);

        // Update the window title to the new file path
        window.electronAPI.setWindowTitle(filePath);

        // Notify the user of the successful save
        alert('File saved successfully at: ' + filePath);
    } catch (error) {
        console.error('Error saving file as:', error);
        alert('Failed to save file: ' + error.message);
    }
};
