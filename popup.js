document.getElementById('pauseBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'pauseBlocking' });
});

