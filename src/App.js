import "./App.css";
import { Routes, Route } from "react-router-dom";
import Users from "./pages/Users";
import Addresses from "./pages/Addresses";
import Start from "./pages/Start";

function App() {
  return (
    <div className="App">
      <Routes>
        <Route path="/" element={<Start />} />
        <Route path="/users" element={<Users />} />
        <Route path="/addresses" element={<Addresses />} />
      </Routes>
    </div>
  );
}

export default App;
