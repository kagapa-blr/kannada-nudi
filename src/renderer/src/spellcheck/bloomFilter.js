import BloomFilter from 'bloom-filter-new';

const specialChars = "೧^l=F–೬B#yJwfz•+2umE<'!CxULvr]8o೦VNd0hH‘_>)- :sYQ7.g9n%W,G`1…\"&?6೯I”೮೨Tb“@೭೫ʼKX4೪[iDScM;*t’{5k/pa(PAeZ~O3R|j}q೩$";
// Escape special characters for regex
const escapedSpecialChars = specialChars.replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&');
const specialCharsRegex = new RegExp(`[${escapedSpecialChars}]`, 'g');


export const loadBloomFilter = async (filePath, size, errorRate) => {
  try {
    console.log('loadBloomFilter file path: ', filePath);

    // Initialize BloomFilter with size and error rate
    const filter = new BloomFilter(size, errorRate);

    // Read the file content using Electron API
    const fileContent = await window.electronAPI.readFile(filePath); // Use Electron's readFile API

    // Check if the file was read successfully
    if (fileContent.error) {
      throw new Error(fileContent.error); // If there's an error, throw it
    }

    // Assuming the file content is a list of words, one per line
    const words = fileContent.split('\n'); // Split the content by line to get words

    // Add each word to the Bloom filter
    words.forEach((word) => {
      if (word.trim().length > 0) {
        filter.add(word.trim()); // Add the word to the Bloom filter
      }
    });

    console.log('Bloom filter info: ', filter.getInfo()); // Output filter information
    return filter; // Return the populated Bloom filter
  } catch (error) {
    console.error('Error loading Bloom Filter:', error);
    throw error; // Re-throw error for the calling function to handle
  }
};


export const getWrongWords = async (quill, bloomFilter) => {
  const fullText = quill.getText();

  // Split the text into words and clean them
  const words = fullText
    .split(/\s+/) // Split by spaces
    .filter(word => word.length > 0) // Remove empty strings
    .map(word => word.replace(specialCharsRegex, '').trim()) // Clean special characters
    .filter(word => word.length > 0); // Remove any remaining empty strings after cleaning

  // Get unique words
  const uniqueWords = [...new Set(words)];

  const wrongWords = [];

  try {
    // Using Promise.all to check for wrong words in parallel
    const wordChecks = uniqueWords.map(async (word) => {
      const isContained = await bloomFilter.contains(word);
      if (!isContained) {
        wrongWords.push(word);
      }
    });

    // Wait for all the promises to resolve
    await Promise.all(wordChecks);

    return wrongWords; // Return the list of wrong words
  } catch (error) {
    console.error('Error checking word correctness:', error);
    return []; // Return an empty list on error
  }
};
