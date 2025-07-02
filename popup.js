
// constants
const ON_BTN = document.getElementById("on_btn");

// on load actions
ON_BTN.checked = true;

// listeners
ON_BTN.addEventListener("change", () => {
    chrome.tabs.query({ active: true, currentWindow: true }, (tabs) => {
        chrome.tabs.sendMessage(tabs[0].id, { action: "toggle CSS" });
    });
})