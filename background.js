
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
                isEnabled = !isEnabled;
                notifyContentIsEnabled();
            }
        });

        port.onDisconnect.addListener(() => {
            console.log("Popup disconnected");
            popupPort = null;
        });
    }
});

// senders
function notifyPopupIsEnabled() {
    console.log("sending message to popup");
    if (popupPort) {
        popupPort.postMessage({type: "enabled", isEnabled: isEnabled});
    }
}

function notifyContentIsEnabled() {
    console.log("sending message to content");
    chrome.tabs.query({ active: true, currentWindow: true }, function(tabs) {
        chrome.tabs.sendMessage(tabs[0].id, 
            {type: "enabled", isEnabled: isEnabled});
    });
}

// on load actions
chrome.runtime.onConnect.addListener((port) => {
    let isEnabled = true;
    if (typeof window !== "undefined") {
        let jsonIsEnabled = localStorage.getItem("isEnabled");
        isEnabled = JSON.parse(jsonIsEnabled);
    }
    notifyContentIsEnabled();
    notifyPopupIsEnabled();
});