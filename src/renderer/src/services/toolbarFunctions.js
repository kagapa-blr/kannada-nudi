
import { underlineWordInEditor } from '../services/editorService.js';
import { getWrongWords } from '../spellcheck/bloomFilter.js';
import { ignoreSingleChars } from './editorUtils.js';


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
        //return result.content;
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
    const userConfirmed = await window.electronAPI.showConfirmation('Are you sure you want to save the file?');
    if (!userConfirmed) {
        console.log('user canclled to save the file');
        // Proceed with saving the file
        return
    }
    try {
        // Check if content is empty, null, or contains only empty HTML elements (like <p><br></p>)
        if (!content || content.trim() === '' || isContentEmpty(content)) {
            alert('Cannot save an empty file.');
            return; // Early return to avoid saving
        }

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
        // Check if content is empty, null, or contains only empty HTML elements (like <p><br></p>)
        if (!content || content.trim() === '' || isContentEmpty(content)) {
            alert('Cannot save an empty file.');
            return; // Early return to avoid saving
        }

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

// Helper function to check if content is visually empty
const isContentEmpty = (content) => {
    // Use a regular expression to check if the content only contains empty HTML tags like <br>, <p><br>, etc.
    const emptyHtmlRegex = /^(<p><br><\/p>|<br\s*\/?>|<p>\s*<\/p>|\s*)$/i;
    return emptyHtmlRegex.test(content);
};



export const spellcheck = async () => {

}

export const refreshAndGetWrongWords = async ({ quillRef, bloomFilter }) => {
    try {
        const quill = quillRef.current?.getEditor();
        if (!quill) {
            console.error("Quill editor instance not found.");
            return [];
        }

        // Fetch new wrong words (spellcheck the content again)
        const wrongWordList = await getWrongWords(quill, bloomFilter)
        if (wrongWordList && wrongWordList.length > 0) {
            const filteredWords = ignoreSingleChars(wrongWordList);

            // Underline new errors in the editor
            await filteredWords.forEach((word) => underlineWordInEditor(quill, word));

            return filteredWords;
        } else {
            console.log("No wrong words found.");
            return [];
        }
    } catch (error) {
        console.error("Error in refreshing wrong words:", error);
        return [];
    }
};
