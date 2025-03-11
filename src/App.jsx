import "./App.css";
import Header from "./components/Header";
import { Route, Routes } from "react-router-dom";
import About from "./pages/About";
import Projects from "./pages/Projects";
import Blog from "./pages/Blog";
import BlogPost from "./components/BlogPost";
import Notes from "./pages/Notes";
import Note from "./components/Note";
import Now from "./pages/Now";


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
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/notes" element={<Notes />} />
          <Route path="/notes/tags/:tag" element={<Notes />} />
          <Route path="/notes/:slug" element={<Note />} />
          <Route path="/now" element={<Now />} />
        </Routes>
      </main>
    </div>
    </>
  );
}

export default App;
