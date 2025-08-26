import React, { useState } from "react";
import { Route, Routes } from "react-router-dom";

import Main_Page from "./Components/Pages/Main_Page";
import Non_Found_Page from "./Components/Pages/Non_Found_Page";
import Layout from "./Components/Standart/Layout/Layout";
import Login from "./Components/Pages/Login";
import InstallButton from "./Components/Pages/InstallButton/InstallButton";

function App() {
  const [currentUser, setCurrentUser] = useState(localStorage.getItem('adminAuth'));
  return (
    <>
      <Routes>
        {!currentUser ? (
          <Route path="*" element={<Login currentUser={currentUser} setCurrentUser={setCurrentUser} />} />
        ) : (
          <Route path="/" element={<Layout />}>
            <Route index element={<Main_Page />} />
            <Route path="*" element={<Non_Found_Page />} />
          </Route>
        )}
      </Routes>

      {/* Кнопка установки */}
      {/* <InstallButton /> */}
    </>
  )
}

export default App
