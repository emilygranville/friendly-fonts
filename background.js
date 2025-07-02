
// variables
let popupPort = null;

let isEnabled;

// listeners

// popup listener
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "popup") {
        console.log("Popup connected");
        popupPort = port;
        notifyPopupIsEnabled();

        // Handle incoming messages from the popup
        port.onMessage.addListener((message) => {
            console.log("Received from popup:", message);
            if (message.action === "toggleEnabled") {
                isEnabled = message.isEnabled;
                saveIsEnabled();
                notifyContentIsEnabled();
            }
        });

        port.onDisconnect.addListener(() => {
            console.log("Popup disconnected");
            popupPort = null;
        });
    }
});

// content listener
chrome.runtime.onMessage.addListener((message) => {
    if (message.action === "start") {
        onloadFunctions();
    }
});

// tab switch listener
chrome.tabs.onActivated.addListener((activeInfo) => {
    console.log("tab switched");
    chrome.tabs.get(activeInfo.tabId, (tab) => {
        chrome.tabs.sendMessage(tab.id, 
            {type: "enabled", isEnabled: isEnabled});
    });
});

// senders
function notifyPopupIsEnabled() {
    if (popupPort) {
        popupPort.postMessage({type: "enabled", isEnabled: isEnabled});
    } else {
        console.log("Popup port not open");
    }
}

function notifyContentIsEnabled() {
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, 
            {type: "enabled", isEnabled: isEnabled});
    });
}

// on load actions
function onloadFunctions() {
    loadIsEnabled();
    notifyContentIsEnabled();
}

// other functions
function saveIsEnabled() {
    if (typeof window !== "undefined") {
        chrome.storage.local.setItem("isEnabled", JSON.stringify(isEnabled));
    }
}

function loadIsEnabled() {
    if (typeof window !== "undefined") {
        let jsonIsEnabled = chrome.storage.local.getItem("isEnabled");
        isEnabled = JSON.parse(jsonIsEnabled);
    }
    if (typeof isEnabled === "undefined") {
        isEnabled = true;
        saveIsEnabled();
    }
}