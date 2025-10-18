import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Header from "./components/Header/Header";
import Footer from "./components/Footer/Footer";
import PrivateRoute from "./routes/PrivateRoute";

import 'bootstrap/dist/css/bootstrap.min.css';
import 'bootstrap-icons/font/bootstrap-icons.css';
import './App.css';

// Public Pages
import About from "./pages/ClientSide/About/About.jsx";
import Catalogo from "./pages/ClientSide/Catalogo/Catalogo.jsx";
import Blogs from "./pages/ClientSide/Blogs/Blogs.jsx";
import Contacto from "./pages/ClientSide/Contacto/Contacto.jsx";
import HeroPage from "./pages/ClientSide/HeroPage/HeroPage.jsx";

// User Pages (Protected)
import UserProfile from "./pages/ClientSide/UserProfile.jsx";
import ClientProfile from "./pages/ClientSide/ClientProfile/ClientProfile.jsx"; // Backward compatibility

// Admin Pages (Protected)
import AdminProfile from "./pages/AdminSide/AdminProfile.jsx";

function App() {
  return (
    <Router>
      <Header />
      <Routes>
        {/* Public Routes */}
        <Route path="/" element={<HeroPage />} />
        <Route path="/about" element={<About />} />
        <Route path="/catalogo" element={<Catalogo />} />
        <Route path="/blogs" element={<Blogs />} />
        <Route path="/contacto" element={<Contacto />} />

        {/* Protected User Routes */}
        <Route
          path="/perfil"
          element={
            <PrivateRoute>
              <UserProfile />
            </PrivateRoute>
          }
        />

        {/* Backward compatibility - can be removed later */}
        <Route
          path="/profile"
          element={
            <PrivateRoute>
              <ClientProfile />
            </PrivateRoute>
          }
        />

        {/* Protected Admin Routes */}
        <Route
          path="/admin-perfil"
          element={
            <PrivateRoute>
              <AdminProfile />
            </PrivateRoute>
          }
        />
      </Routes>
      <Footer />
    </Router>
  );
}

export default App;
