import { Routes, Route } from 'react-router-dom'
import MainLayout from './layouts/MainLayout'
import AdminLayout from './layouts/AdminLayout'
import Home from './pages/Home'
import UpazilaList from './pages/UpazilaList'
import UpazilaDetail from './pages/UpazilaDetail'
import Hospitals from './pages/Hospitals'
import HomeTutors from './pages/HomeTutors'
import HomeTutorCreate from './pages/HomeTutorCreate'
import ToLetCreate from './pages/ToLetCreate'
import BusinessCreate from './pages/BusinessCreate'
import TouristPlaceCreate from './pages/TouristPlaceCreate'
import ToLets from './pages/ToLets'
import Businesses from './pages/Businesses'
import TouristPlaces from './pages/TouristPlaces'
import TouristPlaceDetail from './pages/TouristPlaceDetail'
import BlogList from './pages/BlogList'
import BlogDetail from './pages/BlogDetail'
import BlogCreate from './pages/BlogCreate'
import Login from './pages/auth/Login'
import Register from './pages/auth/Register'
import Profile from './pages/Profile'
import AdminDashboard from './pages/admin/Dashboard'
import AdminUsers from './pages/admin/Users'
import CreateUser from './pages/admin/CreateUser'
import AdminApprovals from './pages/admin/Approvals'
import ManageHospitals from './pages/admin/ManageHospitals'
import ManageTutors from './pages/admin/ManageTutors'
import ManageToLets from './pages/admin/ManageToLets'
import ManageBusinesses from './pages/admin/ManageBusinesses'
import ManageUpazilas from './pages/admin/ManageUpazilas'
import ManageSliders from './pages/admin/ManageSliders'
import ManageTouristPlaces from './pages/admin/ManageTouristPlaces'
import ManageBlogs from './pages/admin/ManageBlogs'
import ManageAccessRequests from './pages/admin/ManageAccessRequests'
import SiteSettings from './pages/admin/SiteSettings'
import ProtectedRoute from './components/ProtectedRoute'
import UserProtectedRoute from './components/UserProtectedRoute'
import NotFound from './pages/NotFound'

function App() {
  return (
    <Routes>
      <Route element={<MainLayout />}>
        <Route path="/" element={<Home />} />
        <Route path="/upazilas" element={<UpazilaList />} />
        <Route path="/upazilas/:slug" element={<UpazilaDetail />} />
        <Route path="/hospitals" element={<Hospitals />} />
        <Route path="/home-tutors" element={<HomeTutors />} />
        <Route path="/to-lets" element={<ToLets />} />
        <Route path="/businesses" element={<Businesses />} />
        <Route path="/tourist-places" element={<TouristPlaces />} />
        <Route path="/tourist-places/:id" element={<TouristPlaceDetail />} />
        <Route path="/blogs" element={<BlogList />} />
        <Route path="/blogs/:slug" element={<BlogDetail />} />
        <Route path="/login" element={<Login />} />
        <Route path="/register" element={<Register />} />
      </Route>

      <Route element={<UserProtectedRoute />}>
        <Route element={<MainLayout />}>
          <Route path="/profile" element={<Profile />} />
          <Route path="/profile/add-home-tutor" element={<HomeTutorCreate />} />
          <Route path="/profile/add-to-let" element={<ToLetCreate />} />
          <Route path="/profile/add-business" element={<BusinessCreate />} />
          <Route path="/profile/add-blog" element={<BlogCreate />} />
          <Route path="/profile/add-tourist-place" element={<TouristPlaceCreate />} />
        </Route>
      </Route>

      <Route element={<ProtectedRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin" element={<AdminDashboard />} />
          <Route path="/admin/users" element={<AdminUsers />} />
          <Route path="/admin/users/create" element={<CreateUser />} />
          <Route path="/admin/approvals" element={<AdminApprovals />} />
          <Route path="/admin/hospitals" element={<ManageHospitals />} />
          <Route path="/admin/tutors" element={<ManageTutors />} />
          <Route path="/admin/tolets" element={<ManageToLets />} />
          <Route path="/admin/businesses" element={<ManageBusinesses />} />
          <Route path="/admin/upazilas" element={<ManageUpazilas />} />
          <Route path="/admin/sliders" element={<ManageSliders />} />
          <Route path="/admin/tourist-places" element={<ManageTouristPlaces />} />
          <Route path="/admin/blogs" element={<ManageBlogs />} />
          <Route path="/admin/access-requests" element={<ManageAccessRequests />} />
          <Route path="/admin/settings" element={<SiteSettings />} />
        </Route>
      </Route>

      <Route path="*" element={<NotFound />} />
    </Routes>
  )
}

export default App
