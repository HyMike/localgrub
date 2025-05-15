import { useState, useEffect } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import getStatus from './status'

function App() {
  const [status, setStatus] = useState("");

  useEffect(() => {
    const retrieveStatus = async () => {

      const callStatus = await getStatus();
      console.log("Response from backend:", callStatus); // 👈 Add this

      setStatus(callStatus.message);
    }

    retrieveStatus();

  }, []);

  return (

    <>
      <h1>This is the message: {status}</h1>
    </>
  )
}

export default App

