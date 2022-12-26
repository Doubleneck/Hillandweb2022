import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';


const news = [
  {
    id: 1,
    date: '2019-05-30T17:30:31.098Z',
    title: 'News #1',
    content: 'some news content #1',
    picture: ''
  },
  {
    id: 2,
    date: '2019-05-30T17:30:31.098Z',
    title: 'News #2',
    content: 'some news content #3',
    picture: ''
  },
  {
    id: 3,
    date: '2019-05-30T17:30:31.098Z',
    title: 'News #3',
    content: 'some news content #3',
    picture: ''
  },
]

ReactDOM.createRoot(document.getElementById('root')).render(
  <App news={news} />
)


// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
