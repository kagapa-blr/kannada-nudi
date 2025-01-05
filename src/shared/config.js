// Load the configuration file
import config from '../../resources/config/nudiconfig.json';

// Get the current environment (defaults to 'development' if not set)
const environment = process.env.NODE_ENV || 'development';

// Get environment-specific config
const { baseResourcePathLinux, baseResourcePathMac, baseResourcePathWindows } = config[environment];

// Default values for other configurations
export const appDirectoryName = 'kannadaNudi';
export const fileEncoding = 'utf8';
export const autoSavingTime = 3000;
export const welcomeNoteFilename = 'kannadaNudi.txt';

// Determine the environment and set the base resource path
const isDev = process.env.NODE_ENV === 'development';
const baseResource = isDev
  ? baseResourcePathLinux
  : '/opt/kannada-nudi/resources/nudiconfig'; // default path for production
// Export paths for dataset files
export const bloomCollection = `${baseResource}/dataset/collection.txt`;
export const symspellDict = `${baseResource}/dataset/word_frequency.txt`;

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
