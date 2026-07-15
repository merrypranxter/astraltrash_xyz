import {StrictMode} from 'react';
import {createRoot} from 'react-dom/client';
import App from './App.tsx';
import { AstralMerry } from './components/AstralMerry.tsx';
import './index.css';
import { startPsychedelicPortalWatcher } from './psychedelic-portal.ts';

startPsychedelicPortalWatcher();

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <App />
    <AstralMerry />
  </StrictMode>,
);
