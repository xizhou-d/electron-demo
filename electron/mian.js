// app 主要控制生命周期，BrowserView 控制我们的窗口
const { app, BrowserWindow, ipcMain, Notification } = require('electron')
const path = require('path')

try {
    require('electron-reloader')(module, {})
} catch (_) {}

let win;
// 创建窗口
const createWindow = () => {
    win = new BrowserWindow({
        width: 1400,
        height: 1000,
        webPreferences: {
            contextIsolation: false,
            // 集成 node: 当前版本，如果 contextIsolation 被设置为 true, 那么 nodeIntegration: true 不生效
            nodeIntegration: true,
            preload: path.join(__dirname, 'preload.js'),
        }
    })

    win.loadFile('index.html')
    win.webContents.openDevTools()
    handleIPC()
}

app.whenReady().then(() => {
    createWindow()
    // 主线程接收渲染进程发送过来的消息
    ipcMain.on('msg2', (e, msg2) => {
        console.log('msg2', msg2)
    })
})

function handleIPC() {
    win.webContents.send('msg', '消息来自主进程')
    ipcMain.handle('work-notification',  async () => {
        return await new Promise((resolve, reject) => {
            let notification = new Notification({
                title: '消息通信'
            })
            notification.show()
            resolve('这是主线程发给渲染进程的消息')
        })
    })
}