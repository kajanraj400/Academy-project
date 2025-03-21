import { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify";


const UpComingEvents = () => {
    const [bookings, setBookings] = useState([]);

    useEffect(() => {
        fetch('http://localhost:5000/api/getUpcomingBookings', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response =>response.json())
        .then(book => {
            setBookings(book || []);
        }).catch((e) => {
            console.log(e);
        })
    }, [])


    return (
        <div className='w-10/12 bg-blue-300 p-1 m-10 mt-20'>
            <ToastContainer 
                position = "top-center"
                autoClose = {4000}
                hideProgressBar = {false}
                closeOnClick = {true}
                pauseOnHover = {false}
                draggable = {true}
                progress = {undefined}
                newestOnTop = {true}
                rtl = {false}
                style={{ zIndex: 9999, position: 'fixed', top: 0 }} 
            />
        
            <h1 className="text-4xl text-center text-Blue-800 font-bold underline p-6">Upcoming Event Details</h1>
                
            { bookings.length == 0 ? (
                <p className="text-4xl text-center text-red-600">No bookings yet.</p>
            ) : (
                <table className="w-full bg-blue-200">
                    <thead>
                        <tr>
                            <th className="border-2 border-black p-[0.5px] text-center">Name</th>
                            <th className="border-2 border-black p-[0.5px] text-center">Phone Number</th>
                            <th className="border-2 border-black p-[0.5px] text-center">Email</th>
                            <th className="border-2 border-black p-[0.5px] text-center">Address</th>
                            <th className="border-2 border-black p-[0.5px] text-center">Event Type</th>
                            <th className="border-2 border-black p-[0.5px] text-center">Event Date</th>
                            <th className="border-2 border-black p-[0.5px] text-center">Location</th>
                            <th className="border-2 border-black p-[0.5px] text-center">Duration</th>
                            <th className="border-2 border-black p-[0.5px] text-center">Guest Count</th>
                            <th className="border-2 border-black p-[0.5px] text-center">Services</th>
                        </tr>
                        </thead>
                        <tbody>
                    {bookings
                        .slice()
                        .sort((a, b) => new Date(a.eventDate) - new Date(b.eventDate))                        
                        .map((bookings, index) => {
                        const services = [];
                        if (bookings.videography=="true") services.push("Videography");
                        if (bookings.drone=="true") services.push("Drone Photography");
                        if (bookings.live=="true") services.push("Live Streaming");
                        console.log("eventDate" , bookings.eventDate);
                        const eventDate = new Date(bookings.eventDate);
                        const formattedDate = eventDate.toISOString().split("T")[0]; 
                        
                        return <tr key={index}>
                            <td className="border-2 border-black p-[0.5px] text-center">{bookings.clientName}</td>
                            <td className="border-2 border-black p-[0.5px] text-center">{bookings.phoneNumber}</td>
                            <td className="border-2 border-black p-[0.5px] text-center">{bookings.email}</td>
                            <td className="border-2 border-black p-[0.5px] text-center h-3">
                                {bookings.address.split(' ').map((word, index) => (
                                    <span key={index}>
                                        {word} <br />
                                    </span>
                                ))}
                            </td>
                            <td className="border-2 border-black p-[0.5px] text-center">{bookings.eventType}</td>
                            <td className="border-2 border-black p-[0.5px] text-center">{formattedDate}</td>
                            <td className="border-2 border-black p-[0.5px] text-center">{bookings.location}</td>
                            <td className="border-2 border-black p-[0.5px] text-center">{bookings.duration}</td>
                            <td className="border-2 border-black p-[0.5px] text-center">{bookings.guestCount}</td>
                            <td className="border-2 border-black p-[0.5px] text-center">
                                {
                                    services.length > 0 ? services.map((service, idx) => (
                                        <div key={idx}>{service}</div>
                                    )) : "No Services"
                                }
                            </td>
                        </tr>
                                                   
                    })}
                    </tbody>     
                    </table>
                )
            }
        </div>
    )
}

export default UpComingEvents
