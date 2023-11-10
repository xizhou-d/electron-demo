const { contextBridge } = require("electron");

// 对象访问这个信息是微不足道的。 然而，你不能直接在主进程中编辑DOM，因为它无法访问渲染器文档上下文。 它们存在于完全不同的进程！
// 这是将 预加载  脚本连接到渲染器时派上用场的地方。 预加载脚本在渲染器进程加载之前加载，并有权访问两个 渲染器全局 (例如 window 和 document）和 Node.js 环境

window.addEventListener("DOMContentLoaded", () => {
    const replaceText = (selector, text) => {
        const element = document.getElementById(selector);
        if (element) element.innerHTML = text;
    };

    for (const dependency of ["chrome", "node", "electron"]) {
        replaceText(
            `${dependency}-version`,
            `${dependency}-version: ${process.versions[dependency]}`
        );
    }
});
// 测试 contextIsolation 选项的作用，上下文隔离
window.hello = "hello";

if (process.contextIsolated) {
    // 通过乔接的方式暴露主进程
    contextBridge.exposeInMainWorld("versions", {
        node: () => process.versions.node,
        chrome: () => process.versions.chrome,
        electron: () => process.versions.electron,
    });
    contextBridge.exposeInMainWorld("electronAPI", {
        notification: () => ipcRenderer.invoke("work-notification"),
    });
} else {
    window.versions = process.versions;
    window.electronAPI = {
        notification: () => ipcRenderer.invoke("work-notification"),
    }
}
