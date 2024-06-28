import { BrowserRouter, Routes, Route } from "react-router-dom";
import './App.css'
import Register from "./pages/Register";
import Login from "./pages/Login";
import { AuthProvider } from "./provider/AuthProvider";
import Layout from "./layout/Layout";
import Dashboard from "./pages/user/Dashboard";
import Recruitment from "./pages/user/Recruitment";
import RecruitmentDetail from "./pages/user/RecruitmentDetail";
import Training from "./pages/user/Training";
import TrainingDetail from "./pages/user/TrainingDetail";
import Store from "./pages/user/Store";
import Profile from "./pages/user/Profile";
import Event from "./pages/user/Event";
import EventDetail from "./pages/user/EventDetail";
import Ranking from "./pages/user/Ranking";
import NotFound from "./pages/NotFound";
import AdminLayout from "./layout/AdminLayout";
import CRUDPanel from "./pages/admin/CRUDPanel";
import AdminProfile from "./pages/admin/AdminProfile";
import AdminDashboard from "./pages/admin/AdminDashboard";
import EventDashboard from "./pages/user/EventDashboard";
import Forum from "./pages/Forum";
import EventManagement from "./pages/admin/EventManagement";
import EventApproval from "./pages/admin/EventApproval";
import History from "./pages/user/History";

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
            <Route path="/events/:eventId" element={<EventDetail />} />
            <Route path="/events/dashboard/:eventId" element={<EventDashboard />} />
            <Route path="/events/forum/:eventId" element={<Forum />} />
            <Route path="/recruitment" element={<Recruitment />} />
            <Route path="/recruitment/:volunteerId" element={<RecruitmentDetail />} />
            <Route path="/training" element={<Training />} />
            <Route path="/training/:trainingId" element={<TrainingDetail />} />
            <Route path="/store" element={<Store />}/>
            <Route path="/profile" element={<Profile />}/>
            <Route path="/ranking" element={<Ranking />}/>
            <Route path="/history" element={<History />}/>
          </Route>
          <Route path="/" element={<AdminLayout />}>
            <Route path="/admin/dashboard" element={<AdminDashboard />}/>
            <Route path="/admin/crud-panel" element={<CRUDPanel />}/>
            <Route path="/admin/profile" element={<AdminProfile />}/>
            <Route path="/admin/events" element={<EventManagement />}/>
            <Route path="/admin/events/:eventId" element={<EventApproval />}/>
          </Route>
          <Route path="/admin/forum/:eventId" element={<Forum />} />
        </Routes>
      </BrowserRouter>
    </AuthProvider>
  )
}

export default App
