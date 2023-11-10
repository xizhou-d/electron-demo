import { useEffect, useState } from 'react'

import Versions from './components/Versions'

function App(): JSX.Element {
  const { ipcRenderer } = window.electron
  const [remoteCode, setRemoteCode] = useState('')
  const [localCode, setLocalCode] = useState('')
  // 0 没有控制  1 控制被人  2 被别人控制
  const [controlText, setControlText] = useState('')

  const login = async () => {
    const code = await ipcRenderer.invoke('login')
    console.log('code', code)
    setLocalCode(code)
  }

  useEffect(() => {
    login()

    ipcRenderer.on('control-state-change', handleControlStateChange)

    return () => {
      ipcRenderer.removeListener('control-state-change', handleControlStateChange)
    }
  }, [])

  const handleControlStateChange = (e, name, type) => {
    let text = ''
    if (type === 1) {
      // 控制别人
      text = `正在控制${name}`
    } else if (type === 2) {
      text = `正在被${name}控制`
    }

    setControlText(text)
  }

  const startControl = () => {
    ipcRenderer.send('control', remoteCode)
  }
  return (
    <div className="container">
      <Versions></Versions>
      {controlText ? (
        <div>{controlText}</div>
      ) : (
        <>
          <div>你的控制码: {localCode}</div>
          <input
            type="text"
            value={remoteCode}
            onChange={(e) => {
              setRemoteCode(e.target.value)
            }}
          />
          <button onClick={startControl}>确认</button>
        </>
      )}
    </div>
  )
}

export default App
