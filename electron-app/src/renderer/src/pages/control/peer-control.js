const { EventEmitter } = require('events')

const peer = new EventEmitter()

async function getScreenStream() {
    const { ipcRenderer } = window.electron

    ipcRenderer.on('SET_SOURCE', async (e, sourceId) => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({
                audio: false,
                video: {
                    mandatory: {
                        chromeMediaSource: 'desktop',
                        chromeMediaSourceId: sourceId,
                        maxWidth: window.screen.width,
                        maxHeight: window.screen.height
                    }
                }
            })

            peer.emit('add-stream', stream)
        } catch (error) {
            handleError(error)
        }
    })
}

function handleError(e) {
    console.log(e)
}

getScreenStream()

peer.on('robot', (type, data) => {
    const { ipcRenderer } = window.electron
    if (type === 'mouse') {
        data.screen = {
            width: window.screen.width,
            height: window.screen.height
        }
    }

    setTimeout(() => {
        ipcRenderer.send('robot', type, data)
    }, 200)
})

export default peer
