export const addToDictionary = async (filePath, contentToAppend) => {
    console.log('filepaht: ', filePath, 'contentToAppend: ', contentToAppend)
    if (filePath && contentToAppend) {
        const success = await window.electronAPI.appendContent(filePath, contentToAppend + '\n')
        if (!success) {
            alert('Unable to Add word to Dictionary, please Try again!')
        }
    } else {
        alert('Please provide both the file path and content to append.')
    }
}

export const replaceAll = () => {

}



export const ignoreAll = ({quillRef,clickedWord}) => {
    const quill = quillRef.current?.getEditor();
    if (!quill || !clickedWord) return;

    const fullText = quill.getText();
    let index = fullText.indexOf(clickedWord);

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
