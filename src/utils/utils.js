import {Record} from 'immutable';

export function mapToObj(record) {
    if (record instanceof Record) {
        let obj = {};
        record.forEach((value, key) => obj[key] = value);
        return obj;
    }
    return record;
}

export function normalizeString(string) {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim().toUpperCase();
}

export function fetchWithRetry(url, delay, limit, fetchOptions = {}) {
    return new Promise((resolve, reject) => {
        function success(responseAsJson) {
            if (!responseAsJson.errorMessage) {
                resolve(responseAsJson);
            } else {
                throw responseAsJson.errorMessage;
            }
        }

        function failure(error) {
            limit--;
            if (limit) {
                setTimeout(fetchUrl, delay)
            }
            else {
                reject(error);
            }
        }

        function fetchUrl() {
            return fetch(url, fetchOptions)
                .then(response => response.json())
                .then(success)
                .catch(failure);
        }

        fetchUrl();
    });
}

export function arrayToObj(array, id = undefined, what = undefined) {
    return array.reduce((acc, curr, idx) => {
        const objId = id ? curr.id : idx;
        acc[objId] = what ? curr[what] : curr;
        return acc;
    }, {});
}

export function trimWithoutPonctuation(string) {
    let isEnd = false;
    let isBegin = false;
    return Array.from(string.trim())
        .reverse()
        .reduce((acc, char) => {
            if (!isEnd && ['-', ',', ' ', ':'].includes(char)) {
                return acc;
            }
            isEnd = true;
            return [char, ...acc];
        }, [])
        .reduce((acc, char) => {
            if (!isBegin && ['-', ',', ' ', ':'].includes(char)) {
                return acc;
            }
            isBegin = true;
            return acc + char;
        }, '')
}