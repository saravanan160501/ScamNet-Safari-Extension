const url = new URL(document.URL);
const host = url.hostname;


browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "block") {
        window.location.href = browser.runtime.getURL('block.html');
    } else if (request.action === "others") {
        if (window.location.protocol === "http:") {
            browser.runtime.sendMessage({ action: "Likely Scam", host: host, reason: "Browse with caution!\nThis website is not using the https protocol.\n\nStay vigilant and check with official sources if you are about to do sensitive transactions on this website such as entering login credentials, OTP, payment information, particulars and etc."});
        } else if (!Array.from(document.querySelectorAll('a')).some(link => {
            try {
                const linkURL = new URL(link.href);
                return linkURL.hostname === host;
            } catch (error) {
                return false;
            }
        })) {
            browser.runtime.sendMessage({ action: "Likely Scam", host: host, reason: "Browse with caution!\nThe website's structure is suspicious.\n\nStay vigilant and check with official sources if you are about to do sensitive transactions on this website such as entering login credentials, OTP, payment information, particulars and etc."});
        }
    }
});


if (document.body.innerText.includes("Scam_Websites_Feedback@spf.gov.sg") || document.title == "Suspected phishing site | Cloudflare") {
    browser.runtime.sendMessage({ action: "Scam", host: host, reason: "This link has been flagged as scam. We suggest you avoid it."});
} else {
    browser.runtime.sendMessage({ action: "evaluate", host: host});
}
