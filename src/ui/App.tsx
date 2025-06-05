import { useEffect, useState } from 'react'
import './App.css'
import Client from './component/client/Client';
import Server from './component/server/Server';
import OverlayLoader from './component/loader/OverlayLoader';
import Notification from './component/notification/Notification';
import ConfirmationModal from './component/modal/ConfirmationModal';

function App() {
  const [theme, setTheme] = useState<'light' | 'dark'>('light');
  const [mode, setMode] = useState<'server' | 'client'>('server');

  useEffect(() => {
    document.body.setAttribute('data-bs-theme', theme)
  }, [theme])

  const toggleTheme = () => {
    setTheme(theme === 'light' ? 'dark' : 'light')
  }

  const handleModeChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    setMode(event.target.value as 'server' | 'client')
  }

  return (
    <>
      <button className="btn btn-outline-secondary theme-toggle" onClick={toggleTheme} title="Toggle Theme">
        { theme === 'light' ? <i className="bi bi-moon-stars-fill"></i> : <i className="bi bi-brightness-high-fill"></i> }
      </button>
      <OverlayLoader />
      <Notification />
      <ConfirmationModal />

      <div className="container-fluid py-4">
        {/* Header */}
        <div className="text-center mb-5">
          <h1 className="display-4 fw-bold gradient-text mb-3">TCP Server/Client Communication Tool</h1>
          <p className="lead text-muted">Professional TCP communication interface for server and client operations</p>
        </div>


        {/* Mode Selector */}
        <div className="d-flex justify-content-center mb-4">
          <div className="btn-group" role="group">
            <input type="radio" className="btn-check" name="mode" id="serverMode" autoComplete="off" value="server" checked={mode === "server"} onChange={handleModeChange}/>
            <label className="btn btn-outline-primary" htmlFor='serverMode'>
              <i className="bi bi-hdd-network me-2"></i>TCP Server
            </label>

            {/* <input type="radio" className="btn-check" name="mode" id="clientMode" autoComplete="off" value="client" checked={mode === "client"} onChange={handleModeChange}/>
            <label className="btn btn-outline-primary" htmlFor='clientMode'>
              <i className="bi bi-router me-2"></i>TCP Client
            </label> */}
          </div>
        </div>

        {mode === 'server' ? <Server /> : <Client /> }
      </div>
    </>
  )
}

export default App
