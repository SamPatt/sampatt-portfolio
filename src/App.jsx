import "./App.css";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";


function App() {
  return (
    <>
    <div className="app-container">
      <Header />
      <main className="content">
        <Routes>
          <Route exact path="/" element={<About />} />
          <Route path="/projects" element={<Projects />} />
          <Route path="/about" element={<About />} />
          <Route path="/blog" element={<Blog />} />
        </Routes>
      </main>
    </div>
    </>
  );
}

export default App;
