import { Routes, Route } from "react-router-dom";
import './App.css'
import Header from "./components/header/header";
import Footer from './components/footer/footer';
import Home from './pages/home/home';
import Complaint from './pages/complaint/complaint';
import Registration from './pages/registration/registration';
import LoginPage from "./pages/login/login";
import AdminPage from "./pages/admin/admin";
import Referendum from "./pages/referendum/referendum";
import NoticeBoard from "./pages/noticeboard/noticeBoard";
import GovLinks from "./pages/govlinks/govLinks";
import Dashboard from "./pages/dashboard/Dashboard";
import Authority from './pages/authority/authority';
import LegalChat from './pages/legalchat/legalchat';
import CitizenTrack from './pages/citizenTrack/CitizenTrack';

// In your routes


function App() {

  return (
    <>
        <div className="d-flex flex-column min-vh-100">

          <Header />

          <div className="flex-grow-1">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/complaint" element={<Complaint />} />
              <Route path="/registration" element={<Registration />} />
              <Route path="/login" element={<LoginPage />} />
              <Route path="/admin" element={<AdminPage />} />
              <Route path="/referendum" element={<Referendum />} />
              <Route path="/notice-board" element={<NoticeBoard />} />
              <Route path="/govt-links" element={<GovLinks />} />
              <Route path="/Dashboard" element={<Dashboard />} />
              <Route path="/authority" element={<Authority />} />
              <Route path="/legal-chat" element={<LegalChat />} />
              <Route path="/track" element={<CitizenTrack />} />
            </Routes>
          </div>

          <Footer />

      </div>
    </>
  )
}

export default App;







