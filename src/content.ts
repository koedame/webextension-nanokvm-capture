// Simple console.log to verify script execution
console.log('Content script loaded');

const EXTENSION_NAME = 'NanoKVM Capture';

// Debug logging utility
function debugLog(message: string) {
  try {
    console.log(`[${EXTENSION_NAME}] ${message}`);
  } catch (e) {
    console.log('Failed to log message:', e);
  }
}

// Flag to prevent multiple initializations
let isInitialized = false;

// Check conditions and initialize if met
function checkConditionsAndInitialize() {
  if (isInitialized) return;

  debugLog(`Current URL: ${window.location.href}`);
  debugLog(`Current title: "${document.title}"`);
  
  const hasCorrectTitle = document.title === 'Remote Desktop - NanoKVM';
  const videoElement = document.querySelector('video#screen') as HTMLVideoElement | null;
  const hasVideoElement = videoElement !== null;

  if (videoElement) {
    debugLog('Found video element:');
    debugLog(`- id: ${videoElement.id}`);
    debugLog(`- src: ${videoElement.src || '(no src)'}`);
  }

  debugLog(`Conditions check: Title=${hasCorrectTitle}, Video=${hasVideoElement}`);

  if (hasCorrectTitle && hasVideoElement) {
    initializeExtension();
  }
}

function startObserving() {
  debugLog('Starting observation...');
  debugLog(`Document readyState: ${document.readyState}`);

  // Set up mutation observer for DOM changes
  const observer = new MutationObserver((mutations) => {
    if (isInitialized) {
      debugLog('Already initialized, disconnecting observer');
      observer.disconnect();
      return;
    }

    checkConditionsAndInitialize();
  });

  // Start observing document changes
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // Initial check for conditions
  checkConditionsAndInitialize();
}

function initializeExtension() {
  if (isInitialized) return;
  
  debugLog('Initializing extension...');
  isInitialized = true;
  
  // Place main extension functionality here
  debugLog('Extension initialized successfully');
}

// Main entry point
function main() {
  debugLog(`Extension loaded at ${window.location.href}`);
  debugLog('Waiting 5 seconds before starting...');
  setTimeout(startObserving, 5000);
}

// Start script execution with error handling
try {
  main();
} catch (e) {
  console.error('Failed to execute main:', e);
} 