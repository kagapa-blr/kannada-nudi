import { CircularProgress } from '@mui/material'

const LoadingComponent = () => {
  const label = 'ದಯವಿಟ್ಟು ನಿರೀಕ್ಷಿಸಿ...' // Kannada for "Please wait..."

  return (
    <div className="fixed inset-0 flex items-center justify-center z-50 bg-gray-700 bg-opacity-75">
      {/* CircularProgress component with customized appearance */}
      <CircularProgress
        size={60}
        thickness={4}
        color="success" // Set to a theme-defined color
        className="animate-spin"
        aria-label="Loading indicator" // Adds accessibility support
      />
      {/* Text label for context */}
      <span
        className="ml-4 text-white text-2xl font-semibold drop-shadow-md"
        role="status" // Accessibility role for screen readers
        aria-live="polite" // Announces updates to assistive technologies
      >
        {label}
      </span>
    </div>
  )
}

export default LoadingComponent
