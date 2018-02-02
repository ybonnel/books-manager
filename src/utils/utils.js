export const mapToObj = map => {
    let obj = {};
    map.forEach((value,key) => obj[key] = value);
    return obj;
};

export function normalizeString(string) {
    return string.normalize('NFD').replace(/[\u0300-\u036f]/g, "").trim().toUpperCase();
}