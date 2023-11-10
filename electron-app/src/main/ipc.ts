import { ipcMain } from 'electron'
import { send as sendMainWindow } from './windows/main'
import { create as createControlWindow } from './windows/control'

export default function() {
    ipcMain.handle('login', async () => {
        return await new Promise((resolve, reject) => {
            // 登陆之后返回的是自己的控制码 mock
            // 如果是请求接口可以在这里请求，这里是运行在 node 环境，没有跨域的问题，这是 electron 的一个优势
            resolve(Math.round(Math.random() * (999999 - 100000) + 100000))
        })
    })

    ipcMain.on('control', (event, remoteCode) => {
        // 实际开发中，这里也要请求接口
        sendMainWindow('control-state-change', remoteCode, 1)
        createControlWindow()
    })
}