export const mapToObj = map => {
    let obj = {};
    map.forEach ((value,key) => obj[key] = value);
    return obj;
};