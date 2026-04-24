import { Routes, Route } from "react-router-dom";
import './App.css'
import Header from "./components/header/header";
import Footer from './components/footer/footer';
import Home from './pages/home/home';
import Complaint from './pages/complaint/complaint';
import Registration from './pages/registration/registration';
import LoginPage from "./pages/login/login";
import NoticeBoard from "./pages/noticeboard/noticeBoard";
import GovLinks from "./pages/govlinks/govLinks";

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
              <Route path="/notice-board" element={<NoticeBoard />} />
              <Route path="/govt-links" element={<GovLinks />} />
            </Routes>
          </div>

          <Footer />

      </div>
    </>
  )
}

export default App;