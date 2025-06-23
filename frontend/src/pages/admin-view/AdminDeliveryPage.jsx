import { useEffect, useState } from "react";
import axios from "axios";
import { MapContainer, TileLayer, Marker } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import { Link } from "react-router-dom";

function AdminDeliveryPage() {
  const [deliveries, setDeliveries] = useState([]);
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("");
  const [userDetail, setUserDetail] = useState([]);

  // Fetch deliveries
  useEffect(() => {
    axios.get("http://localhost:5000/deliveries").then((res) => {
      setDeliveries(res.data);
    });
  }, []);

  // Fetch user details
  useEffect(() => {
    axios
      .get("http://localhost:5000/studentdetails") // fixed typo
      .then((result) => {
        setUserDetail(result.data);
      })
      .catch((error) => console.error("Error fetching user data:", error));
  }, []);

  // Merge user phone number with delivery info
  const mergedDeliveries = deliveries.map((delivery) => {
    const user = userDetail.find((u) => u.email === delivery.userId);
    return user ? { ...delivery, phone: user.phone } : delivery;
  });

  const updateStatus = async (id, newStatus) => {
    try {
      await axios.put(`http://localhost:5000/deliveries/${id}`, {
        status: newStatus,
      });
      setDeliveries((prev) =>
        prev.map((order) =>
          order._id === id ? { ...order, status: newStatus } : order
        )
      );
    } catch (err) {
      console.error("Failed to update status", err);
    }
  };

  const filtered = mergedDeliveries.filter((d) => {
    return (
      d.userId.toLowerCase().includes(search.toLowerCase()) &&
      (statusFilter === "" || d.status === statusFilter)
    );
  });

  return (
    <div className="p-6 max-w-8xl mx-auto">
      {/* Header */}
      <div className="bg-blue-500 p-4 shadow-lg mt-10 w-11/12 mx-auto">
        <div className="flex justify-between items-center">
          <h1 className="text-white text-xl font-bold">
            📦 Delivery Management
          </h1>
          <Link
            to="/admin/deliveryReport"
            className="text-white text-xl font-bold hover:text-gray-200"
          >
            Delivery Report
          </Link>
        </div>
      </div>

      {/* Filters */}
      <div className="flex justify-center gap-4 mb-6 mt-10">
        <input
          type="text"
          placeholder="Search by User Email"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="border border-gray-400 p-2 rounded w-1/3 bg-white focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="border border-gray-400 p-2 rounded bg-white focus:bg-gray-100 focus:outline-none focus:ring-2 focus:ring-blue-500 transition"
        >
          <option value="">All Status</option>
          <option value="pending">Pending</option>
          <option value="delivered">Delivered</option>
        </select>
      </div>

      {/* Table */}
      <div className="relative z-0 rounded-xl overflow-x-auto">
        <table className="w-full border-collapse border">
          <thead>
            <tr className="bg-gray-100 text-center">
              <th className="border p-2">User Email</th>
              <th className="border p-2">Order ID</th>
              <th className="border p-2">Address</th>
              <th className="border p-2">Phone Number</th>
              <th className="border p-2">Fee</th>
              <th className="border p-2">Status</th>
              <th className="border p-2">Action</th>
              <th className="border p-2">Map</th>
            </tr>
          </thead>
          <tbody>
            {filtered
              .filter((order) => order.deliveryType === "Online Delivery")
              .map((order, index) => (
                <tr
                  key={order._id || index}
                  className="text-center bg-white border-blue-200 border-2"
                >
                  <td className="border p-2">{order.userId}</td>
                  <td className="border p-2">{order.orderId}</td>
                  <td className="border p-2">{order.address}</td>
                  <td className="border p-2">{order.phone || "—"}</td>
                  <td className="border p-2">
                    {order.deliveryFee && order.deliveryFee !== 0
                      ? `Rs. ${order.deliveryFee}`
                      : "Free"}
                  </td>
                  <td className="border p-2">{order.status}</td>
                  <td className="border p-2">
                    {order.status === "pending" ? (
                      <button
                        onClick={() => updateStatus(order._id, "delivered")}
                        className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                      >
                        Mark Delivered
                      </button>
                    ) : (
                      <span className="text-green-700 font-semibold">
                        Delivered
                      </span>
                    )}
                  </td>
                  <td className="border p-2">
                    {order.location?.lat && order.location?.lng ? (
                      <div style={{ overflow: "auto" }}>
                        <MapContainer
                          center={[order.location.lat, order.location.lng]}
                          zoom={13}
                          scrollWheelZoom={false}
                          style={{
                            height: "250px",
                            width: "300px",
                            borderRadius: "10px",
                          }}
                        >
                          <TileLayer url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png" />
                          <Marker
                            position={[order.location.lat, order.location.lng]}
                          />
                        </MapContainer>
                      </div>
                    ) : (
                      <span>—</span>
                    )}
                  </td>
                </tr>
              ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default AdminDeliveryPage;
