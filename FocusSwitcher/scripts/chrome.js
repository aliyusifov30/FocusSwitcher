export function chrome_get(storage_name) {
    return new Promise((resolve, reject) => {
        chrome.storage.local.get([storage_name], function (result) {
            if (chrome.runtime.lastError) {
                reject(chrome.runtime.lastError);
            } else {
                resolve(result[storage_name]);
            }
        });
    });
}

export function chrome_set(storage_name, data) {
    chrome.storage.local.set({ [storage_name]: data }, function () {
    });
}
