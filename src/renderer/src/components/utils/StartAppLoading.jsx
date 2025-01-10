import { CircularProgress } from '@mui/material';

const StartAppLoading = () => {
  const label = 'ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ...'; // Kannada for "Please wait..."
  const footerMessageTop =
    'ಕನ್ನಡ ನುಡಿ - ತಂತ್ರಾಂಶದ ವಿನ್ಯಾಸ ಮತ್ತು ಅಭಿವೃದ್ಧಿ - ಕನ್ನಡ ಗಣಕ ಪರಿಷತ್ - ಬೆಂಗಳೂರು';
  const footerMessageBottom = 'Copyright © [2025] [ಕಗಪ]. ಎಲ್ಲಾ ಹಕ್ಕುಗಳನ್ನು ಕಾಯ್ದಿರಿಸಲಾಗಿದೆ';

  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center z-50 bg-gradient-to-br from-red-600 to-yellow-400 bg-opacity-90">
      {/* Spinner with Karnataka flag colors */}
      <div className="relative">
        <CircularProgress
          size={70}
          thickness={5}
          color="inherit" // Inherit color for custom styling
          className="animate-spin"
          aria-label="Loading indicator" // Accessibility support
        />
        <div className="absolute inset-0 rounded-full bg-gradient-to-r from-red-600 to-yellow-400 blur-sm"></div>
      </div>

      {/* Main label with Kannada text */}
      <span
        className="mt-4 text-white text-3xl font-bold tracking-wide animate-pulse"
        role="status"
        aria-live="polite"
      >
        {label}
      </span>

      {/* Footer message with two parts */}
      <div className="mt-12 text-white text-lg font-semibold tracking-wide opacity-90 text-center px-6">
        <h3 className="mb-2">{footerMessageTop}</h3>
        <p>{footerMessageBottom}</p>
      </div>
    </div>
  );
};

export default StartAppLoading;
