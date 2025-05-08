import React from 'react'
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom'
import Layout from './components/Usercomponents/Layout'
import Homepage from './pages/Userpages/Homepage'
import AdminLayout from './components/Admincomponents/AdminLayout'
import Productlist from './pages/AdminPages/Productlist'
import Addproducts from './pages/AdminPages/Addproducts'
import Category from './pages/AdminPages/Category'
import Addcategory from './pages/AdminPages/Addcategory'
import Register from './pages/Userpages/Register'
import Login from './pages/Userpages/Login'
import AdminRegister from './pages/AdminPages/AdminRegister'
import AdminLogin from './pages/AdminPages/AdminLogin'
import VolunteerForm from './pages/Volunters/VolunteerForm'
import VolunteerList from './pages/Volunters/VolunteerList'
import Payment from './pages/Userpages/Payment'
import PaymentSuccess from './pages/Userpages/PaymentSuccess'
import PayementFailure from './pages/Userpages/PayementFailure'
import PaymentList from './pages/Userpages/PaymentList'
import AdminUserList from './pages/AdminPages/AdminUserList'
import DashboardStats from './pages/AdminPages/DashboardStats'
import ReliefProducts from './pages/Userpages/ReliefProducts'
import Profile from './components/Usercomponents/Profile'
import VolunterProfile from './pages/Volunters/VolunterProfile'
import ContactUs from './pages/Volunters/ContactUs'
import ContactMessages from './pages/Volunters/ContactMessages'
import ForgotPassword from './pages/Userpages/ForgotPassword'
import ResetPassword from './pages/Userpages/ResetPassword'
import VolunteerAssignmentPage from './pages/Volunters/VolunteerAssignmentPage'
import AssignmentList from './pages/Volunters/AssignmentList copy'
import DisasterDashboard from './services/DisasterDashboard'
import WeatherCard from './services/WeatherCard'
import Vologin from './pages/Volunters/Vologin'
import Volid from './pages/Volunters/Volid'


const Myroutes = () => {
  return (
    <>
    <Router>
        <Routes>
            <Route path='/' element={<Layout/>}>
                <Route index element={<Homepage/>}/>
                <Route path='register' element={<Register/>}/>
                <Route path='login' element={<Login/>}/>
                <Route path='profile' element={<Profile/>}/>
                <Route path='contactus' element={<ContactUs/>}/>
                <Route path='/forgot-password' element={<ForgotPassword/>}/>
                <Route path="/reset-password/:uidb64/:token/" element={<ResetPassword />} />
                <Route path='service' element={<DisasterDashboard/>}/>
                <Route path='weather' element={<WeatherCard/>}/>
                <Route path='loginvol' element={<Vologin/>}/>
                <Route path='volid' element={<Volid/>}/>





                <Route path='resources' element={<ReliefProducts/>}/>
               
                <Route path='donatepg' element={<Payment/>}/>
                <Route path='adminregister' element={<AdminRegister/>}/>
                <Route path='adminlogin' element={<AdminLogin/>}/>
                <Route path='adminlogin' element={<AdminLogin/>}/>
                <Route path="/paymentsuccess" element={<PaymentSuccess />} />
                <Route path="/paymentfailure" element={<PayementFailure />} />
                <Route path='registervolunteer' element={<VolunteerForm/>}/>





            </Route>
            <Route path='/admin/' element={<AdminLayout/>}>
            <Route path='donations' element={<PaymentList/>}/>
            <Route path='listvolunteer' element={<VolunteerList/>}/>
            <Route path='volunteerprof/:id' element={<VolunterProfile/>}/>
            <Route path='dashboard' element={<DashboardStats/>}/>
            <Route path='userverify' element={<AdminUserList/>}/>
            <Route path='productlist' element={<Productlist/>}/>
            <Route path='addproduct' element={<Addproducts />}/>
            <Route path='category' element={<Category/>}/>
            <Route path='addcategory' element={<Addcategory/>}/>
            <Route path='message' element={<ContactMessages/>}/>
            <Route path='assignvol' element={<VolunteerAssignmentPage/>}/>
            <Route path='assignlist' element={<AssignmentList/>}/>


            
            </Route>
            
        </Routes>
    </Router>
      
    </>
  )
}

export default Myroutes
