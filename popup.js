document.getElementById('pauseBtn').addEventListener('click', () => {
    chrome.runtime.sendMessage({ action: 'pauseBlocking' }, () => {
        // Toggle button text after background responds
        const btn = document.getElementById('pauseBtn');
        btn.textContent = btn.textContent === 'Pause' ? 'Unpause' : 'Pause';
    });
});
