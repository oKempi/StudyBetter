// Load the illegal websites (not actually illegal xD)
var illegalWebsites = [];

fetch(chrome.runtime.getURL('websites.txt'))
    .then(response => response.text())
    .then(data => {
        illegalWebsites = data.split('\n').map(site => site.trim()).filter(site => site.length > 0);
        console.log('Loaded websites:', illegalWebsites);
    })
    .catch(error => console.error('Failed to load websites:', error));

chrome.tabs.query({ active: true, currentWindow: true }, function (tabs) {
    if (chrome.runtime.lastError) {
        console.error(chrome.runtime.lastError);
        return;
    }
    if (tabs.length === 0) {
        console.error("No active tabs found :(.");
        return;
    }
    var tab = tabs[0];
    var url = tab.url || "";
    if (illegalWebsites.some(site => url.includes(site))) {
        chrome.tabs.remove(tab.id, function () {
            if (chrome.runtime.lastError) {
                console.error("Failed to close tab: ", chrome.runtime.lastError);
            }
        });
    }
});

chrome.tabs.onCreated.addListener(function (tab) {
    if (illegalWebsites.some(site => tab.url.includes(site))) {
        chrome.tabs.remove(tab.id, function () {
            if (chrome.runtime.lastError) {
                console.error("Failed to close tab: ", chrome.runtime.lastError);
            }
        });
    }
});

chrome.tabs.onUpdated.addListener(function (tabId, changeInfo, tab) {
    if (illegalWebsites.some(site => tab.url.includes(site))) {
        chrome.tabs.remove(tab.id, function () {
            if (chrome.runtime.lastError) {
                console.error("Failed to close tab: ", chrome.runtime.lastError);
            }
        });
    }
});