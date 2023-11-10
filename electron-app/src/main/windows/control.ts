import { shell, BrowserWindow, desktopCapturer } from 'electron'
import { join } from 'path'
import { is } from '@electron-toolkit/utils'

let win;
export function create(): void {
    // Create the browser window.
    win = new BrowserWindow({
        width: 1400,
        height: 1000,
        show: false,
        autoHideMenuBar: true,
        webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            preload: join(__dirname, '../preload/index.js'),
            sandbox: false
        }
    })

    win.on('ready-to-show', () => {
        win.show()

        desktopCapturer.getSources({ types: ['screen'] }).then(sources => {
            for (const source of sources) {
                win.webContents.send('SET_SOURCE', source.id)
            }
        })
    })

    win.webContents.setWindowOpenHandler((details) => {
        shell.openExternal(details.url)
        return { action: 'deny' }
    })

    win.webContents.openDevTools()

    // HMR for renderer base on electron-vite cli.
    // Load the remote URL for development or the local html file for production.
    if (is.dev && process.env['ELECTRON_RENDERER_URL']) {
        win.loadURL(`${process.env['ELECTRON_RENDERER_URL']}/src/pages/control/index.html`)
    } else {
        win.loadFile(join(__dirname, '../renderer/index.html'))
    }
}
