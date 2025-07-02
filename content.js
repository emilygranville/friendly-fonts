
// constants
const target = (document.head||document.documentElement);

const friendly_link = document.createElement("link");
friendly_link.id = "friendly_link";
friendly_link.href = chrome.runtime.getURL("friendly.css");
friendly_link.rel = "stylesheet";
friendly_link.type = "text/css";

// on load actions
let isEnabled = true;

target.appendChild(friendly_link);

// listeners
chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
    if (message.action === "toggle CSS") {
        toggleStyle();
    }
});

// functions
function toggleStyle() {
    if(isEnabled) {
        target.removeChild(friendly_link);
    } else {
        target.appendChild(friendly_link);
    }
    isEnabled = !isEnabled;
}