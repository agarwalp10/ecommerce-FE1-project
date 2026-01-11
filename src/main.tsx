// src/main.tsx

import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import '@smastrom/react-rating/style.css'
import 'bootstrap/dist/css/bootstrap.min.css';

import { Provider } from "react-redux"; // 
import { store } from "./store/store"; // 


createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <Provider store={store}>
      <App />
    </Provider>
  </StrictMode>,
)
