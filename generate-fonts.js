const fs = require('fs');
const path = require('path');

const fontDirectory = '/home/rpawar/kannada-nudi/src/renderer/src/assets/Nudi_fonts'; // Replace with your font directory
const outputCssFile = './generated-fonts.css'; // Path where the CSS file will be saved

// Function to format the font family name (remove spaces, 'TTF', and the dot)
function formatFontFamily(fontName) {
    return fontName.replace(/\s+/g, '').replace('.TTF', '').replace('.ttf', '');
}

// Function to format the font file name (remove spaces)
function formatFileName(fileName) {
    return fileName.replace(/\s+/g, '');
}

// Function to create CSS from font files
function generateCSS() {
    // Get all files in the font directory
    fs.readdir(fontDirectory, (err, files) => {
        if (err) {
            console.log('Error reading directory:', err);
            return;
        }

        let cssContent = '';

        // Filter TTF files and create @font-face rules for them
        files.forEach(file => {
            const fileExtension = path.extname(file).toLowerCase();

            if (fileExtension === '.ttf') {
                const fontName = path.basename(file, fileExtension); // Get the font name without extension
                const formattedFontName = formatFontFamily(fontName); // Format the font name
                const formattedFileName = formatFileName(file); // Format the font file name

                const oldFontPath = path.join(fontDirectory, file);
                const newFontPath = path.join(fontDirectory, formattedFileName); // New path with spaces removed
                console.log(`"${formattedFontName}",`)
                // Rename the file to remove spaces
                if (oldFontPath !== newFontPath) {
                    fs.rename(oldFontPath, newFontPath, (renameErr) => {
                        if (renameErr) {
                            console.log('Error renaming file:', renameErr);
                        }
                    });
                }

                // Generate the CSS content
                cssContent += `
@font-face {
    font-family: '${formattedFontName}';
    src: url('${newFontPath}') format('truetype');
}
        `;
            }
            
        });

        // Write the generated CSS to a file
        fs.writeFile(outputCssFile, cssContent, (err) => {
            if (err) {
                console.log('Error writing CSS file:', err);
            } else {
                console.log('CSS file generated successfully:', outputCssFile);
            }
        });
    });
}

// Run the function
generateCSS();
