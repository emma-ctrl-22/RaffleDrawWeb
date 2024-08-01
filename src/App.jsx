import React from "react";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import {Login,Dashboard,Prizes,Raffles,Winners,Report,Settings} from "./pages";
import { DefaultLayout } from "./components";
import { Toaster } from "react-hot-toast";

function App() {
  return (
    <div className="h-full w-full">
      <div className="h-[calc(100vh-2rem)]">
        <BrowserRouter>
          <Toaster />
          <Routes>
            <Route path="/" element={<Login />} />
            <Route
              path="/dashboard"
              element={
                <DefaultLayout>
                  <Dashboard />
                </DefaultLayout>
              }
            />
            <Route
              path="/raffles"
              element={
                <DefaultLayout>
                  <Raffles />
                </DefaultLayout>
              }
            />
            <Route
              path="/winners"
              element={
                <DefaultLayout>
                  <Winners />
                </DefaultLayout>
              }
            />
            <Route
              path="/report"
              element={
                <DefaultLayout>
                  <Report />
                </DefaultLayout>
              }
              />
            <Route
              path="/prizes"
              element={
                <DefaultLayout>
                  <Prizes />
                </DefaultLayout>
              }
              />
             
            <Route 
            path='/settings'
            element={
              <DefaultLayout>
                <Settings />
              </DefaultLayout>
            }
            />
          </Routes>
        </BrowserRouter>
      </div>
    </div>
  );
}

export default App;
