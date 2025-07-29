// Load the illegal websites (not actually illegal xD)
let illegalWebsites = [];
let websitesLoaded = false;

fetch(chrome.runtime.getURL('websites.txt'))
    .then(response => response.text())
    .then(data => {
        illegalWebsites = data.split('\n').map(site => site.trim()).filter(site => site.length > 0);
        websitesLoaded = true;
        checkActiveTab();
    })
    .catch(error => console.error('Failed to load websites:', error));

function getHostname(url) {
    try {
        return new URL(url).hostname;
    } catch {
        return '';
    }
}

let isPaused = false;

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === 'pauseBlocking') {
        isPaused = !isPaused;
        console.log('Blocking is now', isPaused ? 'paused' : 'active');
    }
});

function checkTab(tab) {
    if (!websitesLoaded || isPaused) return;
    const tabHost = getHostname(tab.url || '');
    if (illegalWebsites.some(site => tabHost === site)) {
        chrome.tabs.remove(tab.id, () => {
            if (chrome.runtime.lastError) {
                console.error("Failed to close tab: ", chrome.runtime.lastError);
            }
        });
    }
}

function checkActiveTab() {
    chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
        if (chrome.runtime.lastError || tabs.length === 0) return;
        checkTab(tabs[0]);
    });
}

let debounceTimeout = null;
function debounceCheck(tab) {
    clearTimeout(debounceTimeout);
    debounceTimeout = setTimeout(() => checkTab(tab), 100);
}

chrome.tabs.onCreated.addListener(tab => debounceCheck(tab));
chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => debounceCheck(tab));