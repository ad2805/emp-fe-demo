import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { MantineProvider, createTheme } from '@mantine/core';
import '@mantine/core/styles.css';
const root = ReactDOM.createRoot(document.getElementById('root'));
const theme = createTheme({
  /** Put your mantine theme override here */
});

root.render(
  <MantineProvider theme={theme}>
 <React.StrictMode>
    <App />
  </React.StrictMode>
  </MantineProvider>
 
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
