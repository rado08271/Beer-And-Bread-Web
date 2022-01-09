import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import 'bootstrap/dist/css/bootstrap.css'
import App from './App';
import reportWebVitals from './reportWebVitals';
import {Web3ReactProvider} from "@web3-react/core";
import {Web3Provider} from "@ethersproject/providers";

// const config: Config = {
//     readOnlyChainId: 41887,
//     readOnlyUrls: {
//         [41887]: 'http://localhost:8545',
//     },
// }

ReactDOM.render(
  <React.StrictMode>
      <Web3ReactProvider getLibrary={provider => new Web3Provider(provider)}>
          {/*<App />*/}
          <h1>No kokot</h1>
      </Web3ReactProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
