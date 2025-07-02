
// constants
const ON_BTN = document.getElementById("on_btn");

const port = chrome.runtime.connect({name: "popup"});

// listeners
port.onMessage.addListener((message) => {
    console.log("Received from background:", message);
    if (message.type === "enabled") {
        ON_BTN.checked = message.isEnabled;
    }
});

ON_BTN.addEventListener("change", () => {
    port.postMessage({action: "toggleEnabled", isEnabled: ON_BTN.checked});
});