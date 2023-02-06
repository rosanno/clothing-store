import React from "react";
import Footer from "../Footer";
import Navbar from "../Navbar/Navbar";
import { ToastContainer } from "react-toastify";

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="w-full h-screen overflow-hidden scrollbar-thin scrollbar-track-slate-200 scrollbar-thumb-slate-400 transition-all duration-500">
      <Navbar />
      <main className="min-h-[100%] transition-all duration-500">
        {children}
      </main>
      <Footer />
      <ToastContainer />
    </div>
  );
};

export default MainLayout;
