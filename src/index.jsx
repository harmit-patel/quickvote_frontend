import React from 'react';
import ReactDOM from 'react-dom/client';  
import App from './Component/App';
import './Design/App.css'
import './Design/index.css'

const root = document.getElementById('root');

// Create a root and render the app
const rootElement = ReactDOM.createRoot(root);

rootElement.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>
);
