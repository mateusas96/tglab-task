// created for local storage functionality reusability

// set local storage value
export function setLocalStorage(key, storageValue) {
    if (typeof storageValue === 'string') {
        window.localStorage.setItem(key, storageValue)
    } else {
        window.localStorage.setItem(key, JSON.stringify(storageValue));
    }
}

// get local storage by key
export function getLocalStorage(key) {
    if (window.localStorage.getItem(key) === null) {
        return [];
    } else {
        return JSON.parse(window.localStorage.getItem(key));
    }
}

// delete local storage by key
export function deleteLocalStorage(key) {
    window.localStorage.removeItem(key);
}