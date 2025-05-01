import './App.css';
import { Routes, Route, useNavigate } from 'react-router-dom';
import { useState, useEffect } from 'react';
import axios from 'axios';
import Login from './Components/Login/Login';
import Signup from './Components/Signup/Signup';
import Home from './Components/Home/Home';
import MakeAdmin from './Components/MakeAdmin/MakeAdmin';
import Layout from './Components/Layout/Layout';
import Navbar from './Components/Navbar/Navbar';
import CreateFundraiser from './Components/Fundraiser/CreateFundraiser';
import FundraiserList from './Components/Fundraiser/FundraiserList';
import CreateAuctionItem from './Components/Auction/CreateAuctionItem';
import AuctionDetail from './Components/Auction/AuctionDetail';
import CreateEvent from './Components/Events/CreateEvent';
import EventsList from './Components/Events/EventsList';
import TicketSuccess from './Components/Tickets/TicketsSuccess';
import MyTickets from './Components/Tickets/MyTickets';
import AdminDashboard from './Components/Admin/AdminDashboard';
import RequireAdmin from './Components/Admin/RequireAdmin';
import ManageFundraisers from './Components/Admin/ManageFundraisers';
import ManageAuctions from './Components/Admin/ManageAuctions';
import ManageEvents from './Components/Admin/ManageEvents';
import ManageUsers from './Components/Admin/ManageUsers';
import AdminFundraiserProgress from './Components/Admin/AdminFundraiserProgress';
import FundraiserDetail from './Components/Fundraiser/FundraiserDetail';


function App() {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    axios.get('http://localhost:5000/protected', { withCredentials: true })
      .then((res) => setUser(res.data.user))
      .catch(() => navigate('/login'));
  }, []);

  return (
    <Routes>
      <Route path="/" element={<Layout />}>
        <Route index element={<Home />} />
        <Route path="fundraisers" element={<FundraiserList />} />
        <Route path="login" element={<Login setUser={setUser} />} />
        <Route path="signup" element={<Signup />} />
        <Route path="makeadmin" element={<MakeAdmin />} />
        <Route path="navbar" element={<Navbar />} />
        <Route path="fundraisers/create" element={user ? <CreateFundraiser user={user} /> : <Login />} />
        <Route path="auction/create" element={user ? <CreateAuctionItem user={user} /> : <Login />} />
        <Route path='/auction/:id' element={<AuctionDetail />} />
        <Route path="/event/create" element={<CreateEvent user={user} />} />
        <Route path="/events" element={<EventsList />} />
        <Route path="/tickets/success" element={<TicketSuccess />} />
        <Route path="/mytickets" element={<MyTickets />} />
        <Route path="/admin" element={<RequireAdmin user={user}><AdminDashboard /></RequireAdmin>} />
        {/* <Route path="/admin/fundraisers" element={<RequireAdmin user={user}><ManageFundraisers /></RequireAdmin>} /> */}
        <Route path="/admin/auctions" element={<RequireAdmin user={user}><ManageAuctions /></RequireAdmin>}/>
        <Route path="/admin/events" element={<ManageEvents user={user} />} />
        <Route path="/admin/users" element={<ManageUsers user={user} />} />
        <Route path="/admin/fundraisers" element={<AdminFundraiserProgress user={user} />} />
        <Route path="/fundraisers/:id" element={<FundraiserDetail />} />
      </Route>
    </Routes>
  );
}

export default App;
