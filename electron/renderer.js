const { ipcRenderer } = require('electron')

// 接受主线程发送过来的消息
ipcRenderer.on('msg', (e, msg) => {
    console.log('msg', msg)
})
// 渲染线程发送消息给主线程
ipcRenderer.send('msg2', '消息来自渲染进程')

// async function notification() {
//     const res = await ipcRenderer.invoke('work-notification')
//     console.log('res', res)
// }

// notification()
async function notification() {
    const res = await window.electronAPI.notification()
    console.log('RES', res)
}

notification()