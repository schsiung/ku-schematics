// 兼容ie下input自动校验bug
export function testIE() {
    const userAgent = window.navigator.userAgent;
    if (userAgent.indexOf("NET") !== -1 && userAgent.indexOf("rv") !== -1) {
        return true;
    } else {
        return false;
    }
}
