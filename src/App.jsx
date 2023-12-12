// import { useState } from 'react'
import "./App.css";

// IMPORT COMPONENTS
import Header from "./components/Header";
import Footer from "./components/Footer";
import { Route, Routes } from "react-router-dom";

// IMPORT PAGES
import Home from "./pages/Home";
import About from "./pages/About";
import Projects from "./pages/Projects";
import AIChat from './components/AIChat';

function App() {
  return (
    <div className="app-container"> 
      <Header />
      <main className="content">
        <Routes>
          <Route exact path="/" element={<Home />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
        </Routes>
        <AIChat />
      </main>
      <Footer />
    </div>
  );
}

export default App;
