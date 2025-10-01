import {BrowserRouter, Routes, Route} from "react-router-dom";
import './App.css';
import Home from './pages/Home';
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import RedirectPage from "./pages/RedirectPage"
import NotFound from "./pages/NotFound";

function App() {
  return (
    <BrowserRouter>
     <Routes>
      <Route path="/" element={<Home />}/>
      <Route path="/login" element={<Login />}/>
      <Route path="/register" element={<Register />}/>
      <Route path="/dashboard" element={<Dashboard />}/>
      <Route path="/:shortCode" element={<RedirectPage/>}/>

      <Route path="not-found" element={<NotFound />}/>
     </Routes>
    </BrowserRouter>
  )
}

export default App
