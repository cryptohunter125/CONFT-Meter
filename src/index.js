import React from 'react';
import { BrowserRouter, Route, Switch } from "react-router-dom";
import ReactDOM from "react-dom";
import './index.css';
import routes from './router/router'
import reportWebVitals from './reportWebVitals';

import NFTList from './pages/NFTList/NFTList';

import CacheRoute, { CacheSwitch } from 'react-router-cache-route'
// import "nes.css/css/nes.min.css";
ReactDOM.render(

    <BrowserRouter>
      <CacheSwitch>
        <CacheRoute exact path="/marketplace" component={NFTList} />
        {routes.map((item) => {
          return <Route key={item.path} {...item} />;
        })}
      </CacheSwitch>
    </BrowserRouter>,
  document.getElementById("root")
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
