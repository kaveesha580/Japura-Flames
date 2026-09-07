import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "./Home/Home.jsx";
import Admin from "./Admin/Admin.jsx";
import Login from "./Login/Login.jsx";
import Booking from './Booking/Booking.jsx';
import Registration from './Registration/Registration.jsx';

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/Admin" element={<Admin />} />
        <Route path="/Login" element={<Login />} />
        <Route path="/Booking" element={<Booking />} />
        <Route path="/register" element={<Registration />} />
       
        <Route path="*" element={<h1>404 - Page Not Found</h1>} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;