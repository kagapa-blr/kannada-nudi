// Required modules
import config from '../../resources/config/nudiconfig.json';

// Get the current environment (defaults to 'development' if not set)
const environment = process.env.NODE_ENV || 'development';

// Get the OS type using the Electron API
const osType = await window.electronAPI.getOSType(); // Ensure this is fetched correctly
if (!osType) {
  throw new Error('Failed to detect the operating system using Electron API.');
}

// Get environment-specific config
const envConfig = config[environment];
if (!envConfig) {
  throw new Error(`Configuration for environment '${environment}' not found in nudiconfig.json`);
}

// Destructure paths from environment-specific configuration
const { baseResourcePathLinux, baseResourcePathMac, baseResourcePathWindows } = envConfig;

// Validate that all required paths are defined
if (!baseResourcePathLinux || !baseResourcePathMac || !baseResourcePathWindows) {
  throw new Error(`Missing OS-specific paths in configuration for environment: '${environment}'`);
}

// Determine the base resource path based on the OS type
const baseResourcePath =
  osType === 'linux' ? baseResourcePathLinux :
    osType === 'darwin' ? baseResourcePathMac :
      osType === 'win32' ? baseResourcePathWindows :
        null;

// Handle unsupported platforms
if (!baseResourcePath) {
  throw new Error(`Unsupported platform detected: '${osType}'`);
}

// Default application configurations
export const appDirectoryName = 'kannadaNudi';
export const fileEncoding = 'utf8';
export const autoSavingTime = 3000; // in milliseconds
export const welcomeNoteFilename = 'kannadaNudi.txt';

// Dataset file paths
const datasetPath = `${baseResourcePath}/dataset`;
export const bloomCollection = `${datasetPath}/collection.txt`;
export const symspellDict = `${datasetPath}/word_frequency.txt`;

// Debugging logs (optional, for development)
if (environment === 'development') {
  console.log('Running in development mode');
  console.log(`Base Resource Path: ${baseResourcePath}`);
  console.log(`Bloom Collection Path: ${bloomCollection}`);
  console.log(`SymSpell Dictionary Path: ${symspellDict}`);
} else {
  console.log('Running in production mode');
  console.log(`Base Resource Path: ${baseResourcePath}`);
  console.log(`Bloom Collection Path: ${bloomCollection}`);
  console.log(`SymSpell Dictionary Path: ${symspellDict}`);
}
