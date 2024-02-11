function sendNotification(title, subtitle, body) {
    browser.runtime.sendNativeMessage({message: "notification[Separator]" + title + "[Separator]" + subtitle + "[Separator]" + body}, function(response) {
        
    });
}

browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "evaluate") {
        browser.runtime.sendNativeMessage({message: "evaluate" + "[Separator]" + request.host}, function(response) {
            if (response.result === "Scam") {
                browser.tabs.sendMessage(sender.tab.id, { action: "block" });
            } else if (response.result === "Unknown") {
                browser.tabs.sendMessage(sender.tab.id, { action: "others" });
            }
        });
    } else if (request.action === "Scam") {
        browser.tabs.sendMessage(sender.tab.id, { action: "block" });
        sendNotification("Scam", request.host, request.reason);
    } else if (request.action === "Likely Scam") {
        sendNotification("Likely Scam", request.host, request.reason);
    }
});
