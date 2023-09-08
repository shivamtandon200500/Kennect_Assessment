import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { positions,transitions, Provider as AlertProvider } from 'react-alert';
import AlertTemplate from 'react-alert-template-basic';
import { StoreProvider } from './store/store';
import { initialState, reducer } from './store/reducers/reducers';

const root = ReactDOM.createRoot(document.getElementById('root'));
const options = {
  timeout: 3000,
  offset: '35px',
  position: positions.BOTTOM_CENTER,
  containerStyle: {
    zIndex: 10000000,
  },
  transition: transitions.SCALE
};
root.render(
  <StoreProvider initialState={initialState} reducer={reducer}>
    <AlertProvider template={AlertTemplate} {...options}>
      <App />
    </AlertProvider>
  </StoreProvider>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
