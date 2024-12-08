const blocked_url = "https://www.google.com/"; 
var blocked_websites_arr = [];

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (changeInfo.status === 'complete' && tab.url) {
        const site = new URL(tab.url).hostname;

        chrome.storage.local.get(["blocked_websites"], function(result) {
            blocked_websites_arr = result.blocked_websites
            blocked_websites_arr.forEach(x => {
                if (site.includes(x.blocked_website)) {
                    if(x.redirect_url != null && x.redirect_url != ''){
                        chrome.tabs.update(tabId, { url: x.redirect_url });
                    }else{
                        chrome.tabs.update(tabId, { url: blocked_url });
                    }
                }
            });
          });
    }
});