// 最初に実行される部分なので、単純なconsole.logで確認
console.log('Content script loaded');

const EXTENSION_NAME = 'NanoKVM Capture';

// デバッグ用のログ出力
function debugLog(message: string) {
  try {
    console.log(`[${EXTENSION_NAME}] ${message}`);
  } catch (e) {
    console.log('Failed to log message:', e);
  }
}

// 初期化済みフラグ
let isInitialized = false;

// 条件をチェックして初期化
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

  // DOM変更の監視を設定
  const observer = new MutationObserver((mutations) => {
    if (isInitialized) {
      debugLog('Already initialized, disconnecting observer');
      observer.disconnect();
      return;
    }

    checkConditionsAndInitialize();
  });

  // 監視を開始
  observer.observe(document.documentElement, {
    childList: true,
    subtree: true,
    characterData: true
  });

  // 初期チェック
  checkConditionsAndInitialize();
}

function initializeExtension() {
  if (isInitialized) return;
  
  debugLog('Initializing extension...');
  isInitialized = true;
  
  // ここに拡張機能の主要な処理を記述します
  debugLog('Extension initialized successfully');
}

// メイン処理
function main() {
  debugLog(`Extension loaded at ${window.location.href}`);
  debugLog('Waiting 5 seconds before starting...');
  setTimeout(startObserving, 5000);
}

// スクリプトの実行開始
try {
  main();
} catch (e) {
  console.error('Failed to execute main:', e);
} 