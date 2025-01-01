// Function to add the word to the dictionary (appending to a file)
export const addToDictionary = async (filePath, contentToAppend) => {
    console.log('filePath:', filePath, 'contentToAppend:', contentToAppend);

    if (filePath && contentToAppend) {
        try {
            // Calling the Electron API to append content to the dictionary file
            const success = await window.electronAPI.appendContent(filePath, contentToAppend + '\n');
            if (!success) {
                alert('Unable to add word to Dictionary. Please try again!');
                return false;
            }
            return true; // Successfully added to the dictionary
        } catch (error) {
            alert('An error occurred while adding the word to the dictionary. Please try again.');
            console.error('Error:', error);
            return false;
        }
    } else {
        alert('Please provide both the file path and content to append.');
        return false;
    }
};

// Function to remove formatting and reset color for a clicked word in the Quill editor
export const ignoreAll = ({ quillRef, clickedWord }) => {
    const quill = quillRef.current?.getEditor();
    if (!quill || !clickedWord) return;

    const fullText = quill.getText();
    let index = fullText.indexOf(clickedWord);

    // If clicked word is found, remove any formatting or color
    if (index !== -1) {
        while (index !== -1) {
            quill.formatText(index, clickedWord.length, {
                underline: false,
                color: '',
            });
            index = fullText.indexOf(clickedWord, index + clickedWord.length);
        }
    }
};



export const replaceWord = ({ quillRef, clickedWord, replacement }) => {
    if (!quillRef?.current) {
        throw new Error('Invalid quillRef: Ensure it is properly initialized and points to the Quill editor.');
    }

    if (!clickedWord || !replacement) {
        throw new Error('Invalid parameters: Both "clickedWord" and "replacement" are required.');
    }

    const quill = quillRef.current.getEditor();
    const text = quill.getText();
    const clickedWordLength = clickedWord.length;

    // Create a regex pattern that matches the clickedWord surrounded by optional special characters
    const regex = new RegExp(`(\\W|^)(${clickedWord})(\\W|$)`, 'g');

    let match;
    const positions = [];

    // Find all occurrences and store their positions
    while ((match = regex.exec(text)) !== null) {
        const startIndex = match.index + match[1].length; // Start of the clickedWord (after any special character)
        const length = clickedWordLength; // Length of the clickedWord

        // Store the position for replacement
        positions.push({ startIndex, length });
    }

    // Replace all occurrences in reverse order to prevent index shifting
    for (let i = positions.length - 1; i >= 0; i--) {
        const { startIndex, length } = positions[i];

        // Remove the original word
        quill.deleteText(startIndex, length);
        // Insert the replacement word
        quill.insertText(startIndex, replacement);
    }
};
