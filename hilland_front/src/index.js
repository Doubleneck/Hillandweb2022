import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
//import axios from 'axios'
import reportWebVitals from './reportWebVitals';

ReactDOM.createRoot(document.getElementById('root')).render(<App />)
//axios.get('http://localhost:3001/news').then(response => {
//  const news = response.data
//  ReactDOM.createRoot(document.getElementById('root')).render(<App news={news} />)
//})


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
