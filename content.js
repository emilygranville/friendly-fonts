
// constants
const target = (document.head||document.documentElement);

const friendly_link = document.createElement("link");
friendly_link.id = "friendly_link";
friendly_link.href = chrome.runtime.getURL("friendly.css");
friendly_link.rel = "stylesheet";
friendly_link.type = "text/css";

// listeners
chrome.runtime.onMessage.addListener((message) => {
    console.log("Received message from background");
    if (message.type === "enabled") {
        toggleStyle(message.isEnabled);
    }
});

// senders
chrome.runtime.sendMessage({action: "start"});

// functions
function toggleStyle(isEnabled) {
    if(isEnabled) {
        target.appendChild(friendly_link);
    } else {
        try {
            target.removeChild(friendly_link);
        } catch (error) {
            console.log("Cannot remove child--may not be there");
        }
    }
}