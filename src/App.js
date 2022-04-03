import "./App.css";

import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Landing from "./components/Landing/Landing";
import Create from "./components/CreateBlog/Create";

function App() {
  return (
    <Router>
      <Routes>
        <Route path='/' element={<Landing />} />
        <Route path='/create' element={<Create />} />
      </Routes>
    </Router>
  );
}

export default App;
