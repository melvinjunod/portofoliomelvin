import React from 'react';
import ReactDOM from 'react-dom/client';
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Loginpage from "./Loginpage.js";
import Registerpage from "./Registerpage.js";
import Home from "./Home.js";
import SubmitListingpage from "./SubmitListingpage.js";
import Soldkitspage from "./Soldkitspage.js";
// import reportWebVitals from './reportWebVitals';

const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
  <BrowserRouter>
    <Routes>
      <Route path="/">
        <Route index element={ <Loginpage />} />
        <Route path="home" element={ <Home />} />
        <Route path="submitlistingpage" element={ <SubmitListingpage />} />
        <Route path="soldkitspage" element={ <Soldkitspage />} />
        <Route path="register" element={ <Registerpage />} />
        <Route path="*" element={ <Loginpage />} />
      </Route>
    </Routes>
  </BrowserRouter>
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
// reportWebVitals();
