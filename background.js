
// variables
let popupPort = null;

let isEnabled;

// listeners

// popup listener
chrome.runtime.onConnect.addListener((port) => {
    if (port.name === "popup") {
        console.log("Popup connected");
        popupPort = port;

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

// senders
function notifyPopupIsEnabled() {
    console.log("sending message to popup");
    if (popupPort) {
        popupPort.postMessage({type: "enabled", isEnabled: isEnabled});
    } else {
        console.log("Popup port not open");
    }
}

function notifyContentIsEnabled() {
    console.log("sending message to content");
    console.log("isEnabled: " + isEnabled);
    chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, 
            {type: "enabled", isEnabled: isEnabled});
    });
}

// on load actions
function onloadFunctions() {
    loadIsEnabled();
    console.log("load isEnabled: " + isEnabled);
    notifyContentIsEnabled();
    notifyPopupIsEnabled();
}

// other functions
function saveIsEnabled() {
    console.log("save isEnabled: "+isEnabled);
    if (typeof window !== "undefined") {
        localStorage.setItem("isEnabled", JSON.stringify(isEnabled));
    }
}

function loadIsEnabled() {
    if (typeof window !== "undefined") {
        let jsonIsEnabled = localStorage.getItem("isEnabled");
        isEnabled = JSON.parse(jsonIsEnabled);
    }
}