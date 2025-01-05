export const appDirectoryName = 'kannadaNudi';
export const fileEncoding = 'utf8';

export const autoSavingTime = 3000;
export const welcomeNoteFilename = 'kannadaNudi.txt';

// Determine the environment and set the base resource path
const isDev = process.env.NODE_ENV === 'development';
const baseResource = isDev
  ? '/home/rpawar/kannada-nudi/resources/dataset'
  : '/opt/kannada-nudi/resources/app.asar.unpacked/resources/dataset';

// Export paths
export const bloomCollection = `${baseResource}/collection.txt`;
export const symspellDict = `${baseResource}/word_frequency.txt`;

// Debugging logs (optional, for development)
if (isDev) {
  console.log('Running in development mode');
  console.log(`Bloom Collection Path: ${bloomCollection}`);
  console.log(`SymSpell Dictionary Path: ${symspellDict}`);
} else {
  console.log('Running in production mode');
  console.log(`Bloom Collection Path: ${bloomCollection}`);
  console.log(`SymSpell Dictionary Path: ${symspellDict}`);
}
