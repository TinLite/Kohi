import App from '@/App.tsx';
import { StrictMode } from 'react';
import { createRoot } from 'react-dom/client';
import { UserProvider } from './context/user-context';

console.log("Strict mode: " + import.meta.env.DEV)

createRoot(document.getElementById("root")!).render(
  (
    import.meta.env.DEV
      ?
      <StrictMode>
        <UserProvider>
          <App />
        </UserProvider>
      </StrictMode>
      :
      <App />
  )
);