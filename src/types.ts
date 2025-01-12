export interface Translations {
  recording: string;
  download: string;
  error: {
    browserNotSupported: string;
    startFailed: string;
    noVideo: string;
    generic: string;
  };
}

export interface VideoRecorderState {
  mediaRecorder: MediaRecorder | null;
  recordedChunks: Blob[];
  isRecording: boolean;
  recordingStartTime: number | null;
  recordingTimer: number | null;
}
