function sendMessage(host, message) {
    browser.tabs.query({}).then(function(tabs) {
        for (let i = 0; i < tabs.length; i++) {
            const url = new URL(tabs[i].url);

            if (url.host === host) {
                browser.tabs.sendMessage(tabs[i].id, message);
            }
        }
    });
}

function sendNotification(title, subtitle, body) {
    browser.runtime.sendNativeMessage({message: "notification" + "[Separator]" + title + "[Separator]" + subtitle + "[Separator]" + body}, function(response) {
    });
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    const host = request.host;
    
    if (request.action === "evaluate") {
        browser.runtime.sendNativeMessage({message: "evaluate" + "[Separator]" + host}, function(response) {
            if (response.result == "Scam") {
                sendMessage(host, { action: "block" });
            } else if (response.result == "Unknown") {
                sendMessage(host, { action: "checkLoan" });
            }
        });
    } else if (request.action === "Scam") {
        sendMessage(host, { action: "block" });
        sendNotification("Scam", host, request.reason);
    } else if (request.action === "Likely Scam") {
        sendNotification("Likely Scam", host, request.reason);
    } else if (request.action === "Advisory") {
        sendNotification("Advisory", host, request.reason);
    }
});
