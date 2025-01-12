import { translations } from './translations';
import { VideoRecorderState } from './types';
import {
  createRecordButton,
  createSnapshotButton,
  createRecordingIndicator,
  createNotification,
  updateRecordingIcon,
  updateRecordingTime,
} from './ui';

// Add type declarations
declare global {
  interface HTMLVideoElement {
    captureStream(): MediaStream;
  }
}

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

// Initialize video recorder functionality
function initVideoRecorder() {
  // Get translations
  const t = translations;

  // Create UI elements
  const recordButton = createRecordButton();
  const snapshotButton = createSnapshotButton();
  const indicator = createRecordingIndicator();

  // Find the video container
  const videoContainer = document.querySelector(
    '.flex.h-screen.w-screen.items-start.justify-center'
  );
  if (!videoContainer) {
    debugLog('Video container not found');
    return;
  }

  // Make video container relative for absolute positioning
  videoContainer.classList.add('relative');

  // Add UI elements to the container
  videoContainer.appendChild(indicator);
  videoContainer.appendChild(recordButton);
  videoContainer.appendChild(snapshotButton);

  // Initialize recorder state
  const state: VideoRecorderState = {
    mediaRecorder: null,
    recordedChunks: [],
    isRecording: false,
    recordingStartTime: null,
    recordingTimer: null,
  };

  // Show notification
  function showNotification(message: string, type: 'error' | 'success' | 'info' = 'info') {
    const notification = createNotification(message, type);
    videoContainer?.appendChild(notification);

    setTimeout(() => {
      notification.style.opacity = '0';
      setTimeout(() => notification.remove(), 500);
    }, 3000);
  }

  // Start recording
  async function startRecording() {
    try {
      const videoElement = document.getElementById('screen') as HTMLVideoElement;
      if (!videoElement) throw new Error(t.error.noVideo);

      if (!MediaRecorder.isTypeSupported('video/webm;codecs=vp9')) {
        throw new Error(t.error.browserNotSupported);
      }

      state.recordedChunks = [];
      const stream = videoElement.captureStream();
      state.mediaRecorder = new MediaRecorder(stream, {
        mimeType: 'video/webm;codecs=vp9',
      });

      state.mediaRecorder.ondataavailable = (event) => {
        if (event.data.size > 0) {
          state.recordedChunks.push(event.data);
        }
      };

      state.mediaRecorder.onstop = () => {
        if (state.recordingTimer !== null) {
          clearInterval(state.recordingTimer);
        }
        state.recordingStartTime = null;
        downloadRecording();
      };

      state.mediaRecorder.start(100);
      state.isRecording = true;
      state.recordingStartTime = Date.now();
      state.recordingTimer = window.setInterval(() => {
        if (state.recordingStartTime !== null) {
          updateRecordingTime(indicator, state.recordingStartTime, t.recording);
        }
      }, 1000);

      updateRecordingIcon(recordButton, true);
      indicator.style.display = 'block';
      updateRecordingTime(indicator, state.recordingStartTime, t.recording);
    } catch (err) {
      console.error(t.error.startFailed, err);
      showNotification(t.error.startFailed + (err as Error).message, 'error');
    }
  }

  // Stop recording
  function stopRecording() {
    if (state.mediaRecorder && state.mediaRecorder.state !== 'inactive') {
      state.mediaRecorder.stop();
      state.isRecording = false;
      updateRecordingIcon(recordButton, false);
      indicator.style.display = 'none';
      if (state.recordingTimer !== null) {
        clearInterval(state.recordingTimer);
        state.recordingTimer = null;
      }
    }
  }

  // Download recording
  function downloadRecording() {
    if (state.recordedChunks.length === 0) return;

    const blob = new Blob(state.recordedChunks, {
      type: 'video/webm',
    });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `recorded-video-${new Date().toISOString()}.webm`;
    a.click();
    URL.revokeObjectURL(url);

    showNotification(t.download, 'success');
  }

  // Take snapshot
  async function takeSnapshot() {
    const videoElement = document.getElementById('screen') as HTMLVideoElement;
    if (!videoElement) {
      showNotification(t.error.noVideo, 'error');
      return;
    }

    try {
      // Create canvas with video dimensions
      const canvas = document.createElement('canvas');
      canvas.width = videoElement.videoWidth;
      canvas.height = videoElement.videoHeight;

      // Draw video frame to canvas
      const ctx = canvas.getContext('2d');
      if (!ctx) throw new Error('Failed to get canvas context');
      ctx.drawImage(videoElement, 0, 0);

      // Convert to blob and download
      canvas.toBlob((blob) => {
        if (!blob) {
          showNotification('Failed to create image', 'error');
          return;
        }

        const url = URL.createObjectURL(blob);
        const a = document.createElement('a');
        a.href = url;
        a.download = `snapshot-${new Date().toISOString()}.png`;
        a.click();
        URL.revokeObjectURL(url);
        showNotification('Snapshot saved', 'success');
      }, 'image/png');
    } catch (err) {
      console.error('Failed to take snapshot:', err);
      showNotification('Failed to take snapshot: ' + (err as Error).message, 'error');
    }
  }

  // Add snapshot button click event
  snapshotButton.addEventListener('click', takeSnapshot);

  // Add click event
  recordButton.addEventListener('click', async () => {
    if (state.isRecording) {
      stopRecording();
    } else {
      startRecording();
    }
  });

  // Initial UI setup
  updateRecordingIcon(recordButton, false);
  debugLog('Video recorder UI initialized');
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
    characterData: true,
  });

  // Initial check for conditions
  checkConditionsAndInitialize();
}

function initializeExtension() {
  if (isInitialized) return;

  debugLog('Initializing extension...');
  isInitialized = true;

  // Initialize video recorder
  initVideoRecorder();
  debugLog('Extension initialized successfully');
}

// Main entry point
function main() {
  debugLog(`Extension loaded at ${window.location.href}`);
  debugLog('Starting observation...');

  let checkCount = 0;
  const maxChecks = 60; // 1分間（1秒 × 60回）

  const checkInterval = setInterval(() => {
    checkCount++;
    startObserving();

    if (isInitialized || checkCount >= maxChecks) {
      clearInterval(checkInterval);
      if (!isInitialized && checkCount >= maxChecks) {
        debugLog('Initialization timed out after 1 minute');
      }
    }
  }, 1000);
}

// Start script execution with error handling
try {
  main();
} catch (e) {
  console.error('Failed to execute main:', e);
}
