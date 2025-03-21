import { useEffect, useState } from "react"
import { ToastContainer, toast } from "react-toastify";


const EventBookings = () => {
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);

    const handleAccept = (id, clientName, email, eDate, eType, location) => {
        const status = "Accepted";
        const isConfirmed = window.confirm(`Are you sure you want to accept ${clientName}'s booking?`);

        if( isConfirmed ) {
            fetch(`http://localhost:5000/api/updatebookings/${id}/${email}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: status,
                    clientName : clientName,
                    eventDate : eDate, 
                    eventType : eType, 
                    eventLocation : location

                }),
            }).then((res) => {
                if(res.ok) {
                    toast.success(`${clientName}'s booking Accepted successfully!`);
                    setTimeout(() => {
                        const updatedBooking = bookings.filter((book) => book._id !== id);
                        setBookings(updatedBooking);
                    }, 3000)
                } else {
                    console.log("Unable to update")
                }
            }).catch(error => {
                toast.error('Error updating user:', error);
            });   
        }
    }

    const handleReject = (id, clientName, email, eDate, eType, location) => {
        const status = 'Rejected';
        const isConfirmed = window.confirm(`Are you sure you want to reject ${clientName}'s booking?`);

        if( isConfirmed ) {
            fetch(`http://localhost:5000/api/updatebookings/${id}/${email}`, {
                method: "PUT",
                headers: {
                    "Content-Type": "application/json"
                },
                body: JSON.stringify({
                    status: status,
                    clientName : clientName,
                    eventDate : eDate, 
                    eventType : eType, 
                    eventLocation : location
                }),
            }).then((res) => {
                if(res.ok) {
                    toast.success(`${clientName}'s booking Rejected successfully!`);
                    setTimeout(() => {
                        const updatedBooking = bookings.filter((book) => book._id !== id);
                        setBookings(updatedBooking);
                    }, 3000)
                } else {
                    console.log("Unable to update")
                }
                
            }).catch(error => {
                toast.error('Error updating user:', error);
            });   
        }
    }


    useEffect(() => {
        fetch('http://localhost:5000/api/getbookings', {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            }
        }).then(response =>response.json())
        .then(book => {
            setBookings(book || []);
        }).catch((e) => {
            console.log(e);
        }).finally(() => {
            setLoading(false);
        })
    }, [])

    if( loading ) {
        return <h1 className="text-center text-green-800 p-10 border-black border-4 m-10 text-4xl">Loading...</h1>
    }

    return (
            <div className="w-full bg-blue-200 p-1 m-10 mt-20">
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
                <h1 className="text-4xl text-center text-Blue-900 p-6">Event Booking Details</h1>
                
                { bookings.length == 0 ? (
                        <p className="text-4xl text-center text-red-600">No bookings available.</p>
                    ) : (
                        <table className="w-full bg-blue-100">
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
                                <th className="border-2 border-black p-[0.5px] text-center">Budget</th>
                                <th className="border-2 border-black p-[0.5px] text-center">Know Us</th>
                                <th className="border-2 border-black p-[0.5px] text-center">Services</th>
                                <th className="border-2 border-black p-[0.5px] text-center" colSpan="2">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                        {bookings.map((bookings, index) => {
                            const services = [];
                            if (bookings.videography=="true") services.push("Videography");
                            if (bookings.drone=="true") services.push("Drone Photography");
                            if (bookings.live=="true") services.push("Live Streaming");
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
                                <td className="border-2 border-black p-[0.5px] text-center">{bookings.budgetRange}</td>
                                <td className="border-2 border-black p-[0.5px] text-center">{bookings.knowUs}</td>
                                <td className="border-2 border-black p-[0.5px] text-center">
                                    {
                                        services.length > 0 ? services.map((service, idx) => (
                                            <div key={idx}>{service}</div>
                                        )) : "No Services"
                                    }
                                </td>
                                <td className="border-2 border-black p-[0.5px] text-center">
                                    <button className="px-1 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 focus:outline-none focus:ring-2 focus:ring-green-400"
                                        onClick={() => handleAccept(bookings._id, bookings.clientName, bookings.email, formattedDate, bookings.eventType, bookings.location)}
                                    >
                                        Accept
                                    </button>
                                </td>
                                <td className="border-2 border-black p-[0.5px] text-center">
                                    <button className="px-1 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 focus:outline-none focus:ring-2 focus:ring-red-400"
                                        onClick={() => handleReject(bookings._id, bookings.clientName, bookings.email, formattedDate, bookings.eventType, bookings.location)}
                                    >
                                        Reject
                                    </button>
                                </td>
                            </tr>
                                                   
                        })}
                        </tbody>     
                        </table>
                    )
                }
            </div>

        );
}

export default EventBookings;