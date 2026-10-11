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

  const hasCorrectTitle = document.title === 'Remote Desktop - NanoKVM';
  const hasVideoElement = document.querySelector('video#screen') !== null;

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
  checkConditionsAndInitialize();
  if (isInitialized) return;

  const observer = new MutationObserver(() => {
    checkConditionsAndInitialize();
    if (isInitialized) {
      observer.disconnect();
      clearTimeout(giveUpTimer);
    }
  });

  observer.observe(document, {
    childList: true,
    subtree: true,
    characterData: true,
  });

  // NanoKVM 以外のページで observer を残さないよう、1 分で諦める
  const giveUpTimer = setTimeout(() => observer.disconnect(), 60 * 1000);
}

// Start script execution with error handling
try {
  main();
} catch (e) {
  console.error('Failed to execute main:', e);
}
