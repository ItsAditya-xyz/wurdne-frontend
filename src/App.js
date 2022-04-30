import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./components/Landing/Landing";
import Create from "./components/CreateBlog/Create";
import Post from "./components/Posts/Post";
import Profile from "./components/Profile/Profile";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/create' element={<Create />} />
        <Route path="/post/:hash" element={<Post />} />
        <Route path="/u/:userName" element={<Profile/>} />
      </Routes>
    </Router>
  );
}

export default App;
