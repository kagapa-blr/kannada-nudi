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
