import { ipcMain } from 'electron'
import robot from 'robotjs'
import vkey from 'vkey'

function handleMouse(data) {
    // 计算出来映射到傀儡端，鼠标的位置
    // x / screen.width = clientX / video.width
    // y / screen.height = clientY / video.height
    const { clientX, clientY, screen, video } = data
    console.log('screen', screen)
    console.log('video', video)
    const x = (clientX * screen.width) / video.width
    const y = (clientY * screen.height) / video.height
    // 使用 robot 模拟点击事件，需要安装 electron-rebuild 并执行 npx electron-rebuild
    console.log('x, y', x, y)
    robot.moveMouse(x, y)
    robot.mouseClick()
}

function handleKey(data) {
    console.log(data)
    // 使用 robot 模拟键盘事件，需要安装 vkey 这个包
    const modifiers: string[] = []
    if (data.meta) modifiers.push('meta')
    if (data.shift) modifiers.push('shift')
    if (data.ctrl) modifiers.push('ctrl')

    const key = vkey[data.keyCode].toLoverCase()
    console.log('key', key)
    robot.keyTap(key, modifiers)
}

export default function () {
    ipcMain.on('robot', (e, type, data) => {
        if (type === 'key') {
            handleKey(data)
        } else if (type === 'mouse') {
            handleMouse(data)
        }
    })
}