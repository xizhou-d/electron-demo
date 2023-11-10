import peer from './peer-control'

peer.on('add-stream', (stream) => {
    handleVideo(stream)
})

const video = document.getElementById('video')

function handleVideo(stream) {
    video.srcObject = stream
    video.onloadedmetadata = () => video.play()
}

window.onkeydown = function (e) {
    // 收集键盘信息：enter shift ctrl alt meta
    let data = {
        enter: e.keyCode,
        ctrl: e.ctrlKey,
        shift: e.shiftKey,
        alt: e.altKey,
        meta: e.metaKey
    }

    peer.emit('robot', 'key', data)
}

window.onmouseup = function (e) {
    let data = {}

    data.clientX = e.clientX
    data.clientY = e.clientY
    data.video = {
        width: video.getBoundingClientRect().width,
        height: video.getBoundingClientRect().height
    }

    peer.emit('robot', 'mouse', data)
}
