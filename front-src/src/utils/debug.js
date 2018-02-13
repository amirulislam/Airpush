const isDebug = true;
export default params => {
    if (!isDebug) {
        return;
    }
    console.log(...params);
}