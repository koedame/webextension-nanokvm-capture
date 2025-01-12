// Common styles
const commonStyles = `
  font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif;
`;

// Create recording button element
export function createRecordButton(): HTMLDivElement {
  const button = document.createElement('div');
  button.style.cssText = `
    position: absolute;
    bottom: 16px;
    right: 64px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: rgba(38, 38, 38, 0.9);
    color: #d4d4d4;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    ${commonStyles}
  `;
  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = 'rgba(64, 64, 64, 0.9)';
    button.style.color = '#ffffff';
  });
  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = 'rgba(38, 38, 38, 0.9)';
    button.style.color = '#d4d4d4';
  });
  return button;
}

// Create snapshot button element
export function createSnapshotButton(): HTMLDivElement {
  const button = document.createElement('div');
  button.style.cssText = `
    position: absolute;
    bottom: 16px;
    right: 16px;
    width: 40px;
    height: 40px;
    display: flex;
    align-items: center;
    justify-content: center;
    border-radius: 50%;
    background-color: rgba(38, 38, 38, 0.9);
    color: #d4d4d4;
    cursor: pointer;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    ${commonStyles}
  `;
  button.innerHTML = `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M23 19a2 2 0 0 1-2 2H3a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h4l2-3h6l2 3h4a2 2 0 0 1 2 2z"/>
      <circle cx="12" cy="13" r="4"/>
    </svg>
  `;
  button.addEventListener('mouseover', () => {
    button.style.backgroundColor = 'rgba(64, 64, 64, 0.9)';
    button.style.color = '#ffffff';
  });
  button.addEventListener('mouseout', () => {
    button.style.backgroundColor = 'rgba(38, 38, 38, 0.9)';
    button.style.color = '#d4d4d4';
  });
  return button;
}

// Create recording indicator element
export function createRecordingIndicator(): HTMLDivElement {
  const indicator = document.createElement('div');
  indicator.style.cssText = `
    position: absolute;
    bottom: 16px;
    right: 112px;
    padding: 8px 12px;
    background-color: rgba(38, 38, 38, 0.9);
    color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    display: none;
    ${commonStyles}
  `;
  return indicator;
}

// Create notification element
export function createNotification(
  message: string,
  type: 'error' | 'success' | 'info' = 'info'
): HTMLDivElement {
  const notification = document.createElement('div');
  const bgColor =
    type === 'error' ? '#ef4444' : type === 'success' ? '#22c55e' : 'rgba(38, 38, 38, 0.9)';
  notification.style.cssText = `
    position: absolute;
    bottom: 64px;
    right: 16px;
    padding: 8px 16px;
    background-color: ${bgColor};
    color: white;
    border-radius: 8px;
    box-shadow: 0 2px 4px rgba(0, 0, 0, 0.2);
    z-index: 9999;
    transition: opacity 0.5s;
    ${commonStyles}
  `;
  notification.textContent = message;
  return notification;
}

// Update recording icon
export function updateRecordingIcon(button: HTMLDivElement, recording: boolean): void {
  button.innerHTML = recording
    ? `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" fill="currentColor"/>
    </svg>
  `
    : `
    <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round">
      <path d="M23 7l-7 5 7 5V7z"/>
      <rect x="1" y="5" width="15" height="14" rx="2" ry="2"/>
    </svg>
  `;

  button.style.color = recording ? '#ef4444' : '#d4d4d4';
}

// Update recording time display
export function updateRecordingTime(
  indicator: HTMLDivElement,
  startTime: number,
  recordingText: string
): void {
  const duration = Math.floor((Date.now() - startTime) / 1000);
  const minutes = Math.floor(duration / 60);
  const seconds = duration % 60;
  const time = `${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;

  const dotStyle = `
    width: 8px;
    height: 8px;
    background-color: #ef4444;
    border-radius: 50%;
    animation: pulse 1.5s infinite;
    margin: auto 0;
  `;

  const containerStyle = `
    display: flex;
    align-items: center;
    gap: 8px;
    height: 24px;
  `;

  const textStyle = `
    display: flex;
    align-items: center;
    height: 100%;
  `;

  const timeStyle = `
    margin-left: 8px;
    display: flex;
    align-items: center;
    height: 100%;
    font-family: monospace;
    font-variant-numeric: tabular-nums;
    letter-spacing: -0.5px;
  `;

  indicator.innerHTML = `
    <style>
      @keyframes pulse {
        0% { opacity: 1; }
        50% { opacity: 0.5; }
        100% { opacity: 1; }
      }
    </style>
    <div style="${containerStyle}">
      <div style="${dotStyle}"></div>
      <span style="${textStyle}">${recordingText}</span>
      <span style="${timeStyle}">${time}</span>
    </div>
  `;
  indicator.style.display = 'block';
}
