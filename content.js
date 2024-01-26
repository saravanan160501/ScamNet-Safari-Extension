browser.runtime.onMessage.addListener((request, sender, sendResponse) => {
    if (request.action === "block") {
        window.location.href = browser.runtime.getURL('block.html');
    } else if (request.action === "checkLoan") {
        const body = document.documentElement.innerHTML.toLowerCase();
        if (body.includes('loan') || body.includes('loans')) {
            browser.runtime.sendMessage({ action: "Advisory", host: host, reason: "If you are attempting to get a loan, please do so from licenced moneylenders to safeguard yourself."});
        }
    }
});

const url = new URL(document.URL);
const host = url.hostname;


if (document.body.innerText.includes("Scam_Websites_Feedback@spf.gov.sg") || document.title == "Suspected phishing site | Cloudflare") {
    browser.runtime.sendMessage({ action: "Scam", host: host, reason: "This link has been flagged as scam. We suggest you avoid it."});
} else {
    browser.runtime.sendMessage({ action: "evaluate", host: host});
}
