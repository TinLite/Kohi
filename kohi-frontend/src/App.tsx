import { useState } from 'react';
import './App.css'
import MainLayout from './layout/main-layout';

function App() {
  
  let [response, setResponse] = useState("");
  fetch(`${import.meta.env.VITE_BACKEND_BASE_URL ?? ''}/v1/api/posts`).then(async (res) => {
    if (res.ok) {
      res.text().then(setResponse)
    }
  })
  return (
    <MainLayout>
      
    </MainLayout>
  )
}

export default App
