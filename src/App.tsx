import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from "./provider/AuthProvider";
import Layout from "./layout/Layout";
import Dashboard from "./pages/Dashboard";
import Recruitment from "./pages/Recruitment";
import RecruitmentDetail from "./pages/RecruitmentDetail";
import Training from "./pages/Training";
import TrainingDetail from "./pages/TrainingDetail";
import Store from "./pages/Store";
import Profile from "./pages/Profile";
import Event from "./pages/Event";
import EventDetail from "./pages/EventDetail";
import Ranking from "./pages/Rank";
import NotFound from "./pages/NotFound";
import AdminLayout from "./layout/AdminLayout";
import CRUDPanel from "./pages/admin/CRUDPanel";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";

function App() {

  return (
    <AuthProvider>
      <BrowserRouter>
        <Routes>
          <Route path="*" element={<NotFound />} />
          <Route path="/" element={<Login />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route path="/" element={<Layout />}>
            <Route path="/home" element={<Dashboard />} />
            <Route path="/events" element={<Event />} />
            <Route path="/events/detail" element={<EventDetail />} />
            <Route path="/recruitment" element={<Recruitment />} />
            <Route path="/recruitment/detail" element={<RecruitmentDetail />} />
            <Route path="/training" element={<Training />} />
            <Route path="/training/detail" element={<TrainingDetail />} />
            <Route path="/store" element={<Store />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/ranking" element={<Ranking />}/>
          </Route>
          <Route path="/" element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />}/>
            <Route path="/admin/crud-panel" element={<CRUDPanel />}/>
            <Route path="/admin/profile" element={<AdminProfile />}/>
          </Route>
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
