
// constants
const target = (document.head||document.documentElement);

const friendly_link = document.createElement("link");
friendly_link.id = "friendly_link";
friendly_link.href = chrome.runtime.getURL("friendly.css");
friendly_link.rel = "stylesheet";
friendly_link.type = "text/css";

// variables
let curApplied;

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
    if(isEnabled && !curApplied) {
        target.appendChild(friendly_link);
        curApplied = true;
    } else if (curApplied && !isEnabled) {
        try {
            target.removeChild(friendly_link);
            curApplied = false;
        } catch (error) {
            console.log("Cannot remove child--may not be there");
        }
    } else {
        console.log("No change");
    }
}