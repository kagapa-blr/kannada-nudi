import { saveAs } from "file-saver";
import * as quillToWord from 'quill-to-word';
import Quill from "quill"; // Use the original Quill package
import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';

// Helper function to generate filenames in the desired format
const generateFileName = (extension) => {
  const now = new Date();
  const day = String(now.getDate()).padStart(2, '0');
  const month = String(now.getMonth() + 1).padStart(2, '0'); // Months are zero-based
  const year = now.getFullYear();
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');

  return `kannada-nudi-${day}${month}${year}-${hours}${minutes}.${extension}`;
};

export const downloadAsTxt = (htmlContent) => {
  // Create a temporary element to hold the HTML content
  const tempElement = document.createElement("div");
  tempElement.innerHTML = htmlContent;

  // Replace <br> with newlines and get the plain text
  const text = tempElement.innerHTML
    .replace(/<br\s*\/?>/gi, "\n") // Convert <br> to newline
    .replace(/<\/?[^>]+(>|$)/g, ""); // Remove remaining HTML tags

  // Create a blob and download the text file
  const blob = new Blob([text], { type: "text/plain;charset=utf-8" });
  const link = document.createElement("a");
  link.href = URL.createObjectURL(blob);
  link.download = generateFileName("txt"); // Use the generated filename
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};



export const downloadAsDocx = async (htmlContent) => {
  if (!htmlContent) {
    console.error("No content provided for Word download.");
    return; // Exit if no content is provided
  }

  try {
    // Clean up the HTML content: remove specific tags
    const cleanedHtmlContent = htmlContent.replace(/<u class="red-underline">(.+?)<\/u>/g, '$1'); // Remove <u> tags

    const tempDiv = document.createElement("div");
    tempDiv.style.display = "none";
    document.body.appendChild(tempDiv);

    const quillInstance = new Quill(tempDiv, { theme: "snow" });
    quillInstance.clipboard.dangerouslyPasteHTML(cleanedHtmlContent); // Load cleaned HTML content

    const delta = quillInstance.getContents();

    const quillToWordConfig = {
      exportAs: "blob", // Export as a Blob
    };

    const docAsBlob = await quillToWord.generateWord(delta, quillToWordConfig);

    saveAs(docAsBlob, generateFileName("docx")); // Use the generated filename

    document.body.removeChild(tempDiv);
  } catch (error) {
    console.error("Error generating the Word document:", error);
   
  }
};


export const downloadAsPdf = async (htmlContent) => {
  try {
    if (!htmlContent) {
      throw new Error("No content provided for PDF download.");
    }

    // Create a temporary div to hold the HTML content
    const tempDiv = document.createElement('div');
    tempDiv.style.position = 'absolute';
    tempDiv.style.opacity = '1';
    tempDiv.style.width = '100%';
    tempDiv.style.padding = '20px'; // Add padding (margins) around the content
    tempDiv.style.boxSizing = 'border-box'; // Ensure padding is included in the width calculation

    // Clean up the HTML content: remove specific tags
    const cleanedHtmlContent = htmlContent.replace(/<u class="red-underline">(.+?)<\/u>/g, '$1'); // Replace the <u> tags
    tempDiv.innerHTML = cleanedHtmlContent;

    document.body.appendChild(tempDiv);

    setTimeout(async () => {
      const canvas = await html2canvas(tempDiv, { scale: 2 });
      const pdf = new jsPDF();

      const imgData = canvas.toDataURL('image/png');

      // Get PDF page width and height
      const pageWidth = pdf.internal.pageSize.getWidth();
      const pageHeight = pdf.internal.pageSize.getHeight();

      // Define margins (in PDF units, typically mm)
      const margin = 10; // Adjust this value for larger or smaller margins

      // Calculate image width and height while respecting margins
      const imgWidth = pageWidth - 2 * margin;
      const imgHeight = (canvas.height * imgWidth) / canvas.width; // Maintain aspect ratio

      // If the image height exceeds the page height (taking margins into account), scale it
      if (imgHeight > pageHeight - 2 * margin) {
        const imgHeightAdjusted = pageHeight - 2 * margin;
        const imgWidthAdjusted = (canvas.width * imgHeightAdjusted) / canvas.height;
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidthAdjusted, imgHeightAdjusted);
      } else {
        pdf.addImage(imgData, 'PNG', margin, margin, imgWidth, imgHeight);
      }

      pdf.save(generateFileName("pdf")); // Use the generated filename

      document.body.removeChild(tempDiv);
    }, 100);
  } catch (error) {
    console.error("Error downloading as PDF:", error);

  }
};