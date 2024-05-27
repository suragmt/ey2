import React, { lazy } from "react";
import { Route, Routes } from "react-router-dom";
const Home = lazy(() => import("../Home"));
const Contacts = lazy(() => import("../Contancts"));
export default function index() {
  return (
    <Routes>
      <Route path="/" element={<Home/>}></Route>
      <Route path="/contacts" element={<Contacts />}></Route>
    </Routes>
  );
}
