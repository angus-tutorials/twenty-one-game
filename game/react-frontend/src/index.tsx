import React from 'react';
import './styles/index.css';
import App from './components/App';
import {createRoot} from "react-dom/client";


// @ts-ignore
const root = createRoot(document.getElementById('root'));
root.render(<App />);
