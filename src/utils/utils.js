export const mapToObj = map => {
    let obj = {};
    map.forEach((value,key) => obj[key] = value);
    return obj;
};

export function normalizeString(string) {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim().toUpperCase();
}

export function capitalize(string) {
    return string[0].toUpperCase() + string.toLowerCase().slice(1)
}

export function fetchWithRetry(url, delay, limit, fetchOptions = {}) {
    return new Promise((resolve,reject) => {
        function success(responseAsJson) {
            if (!responseAsJson.errorMessage) {
                resolve(responseAsJson);
            } else {
                throw responseAsJson.errorMessage;
            }
        }
        function failure(error){
            limit--;
            if(limit){
                setTimeout(fetchUrl,delay)
            }
            else {
                reject(error);
            }
        }

        function fetchUrl() {
            return fetch(url,fetchOptions)
                .then(response => response.json())
                .then(success)
                .catch(failure);
        }
        fetchUrl();
    });
}