import { Routes, Route } from "react-router-dom";
import Home from "./pages/customer-view/Home";
import Blog from "./pages/customer-view/Blog";
import ClientLayout from './components/customer-view/common/Layout'
import AdminLayout from "./components/admin-view/common/Layout";
import Dashboard from "./pages/admin-view/Dashboard";
import DisplayOldFullEvent from "./pages/customer-view/DisplayOldFullEvent";
import DisplayOldFullEventAdmin from "./pages/admin-view/DisplayOldFullEvent";
import UpcomingEvent from "./pages/admin-view/UpcomingEvent";
import DisplayOldEvents from "./pages/admin-view/DisplayOldEvents";
import OldEventUploadPage from "./pages/admin-view/OldEventUpload";

function App() {
    return (
        <>
            <Routes>
                <Route path='/' element={<Home />} />

                <Route path='/client' element={<ClientLayout />}>
                    <Route path='home' element={<Home />} />
                    <Route path='blog' element={<Blog />} />
                </Route>

                <Route path='/client/DisplayOldFullEvent/:id' element={<DisplayOldFullEvent />} />

                <Route path='/admin' element={<AdminLayout />}>
                    <Route path='dashboard' element={<Dashboard />} />
                    <Route path='upcomingEvents' element={<UpcomingEvent />} />
                    <Route path='oldEvents' element={<DisplayOldEvents />} />
                    <Route path='oldEventUpload' element={<OldEventUploadPage />} />
                </Route>

                <Route path='/admin/DisplayOldFullEvent/:id' element={<DisplayOldFullEventAdmin />} />
                
            </Routes>
        </>
    )
}

export default App;