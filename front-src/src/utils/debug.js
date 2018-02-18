const isDebug = false;
export default params => {
    if (!isDebug) {
        return;
    }
    console.log(...params);
}