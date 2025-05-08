import React, { useEffect, useState, useMemo, useCallback } from "react";
import { Link } from "react-router-dom";
import { Bar } from "react-chartjs-2";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import markerIcon2x from "leaflet/dist/images/marker-icon-2x.png";
import markerIcon from "leaflet/dist/images/marker-icon.png";
import markerShadow from "leaflet/dist/images/marker-shadow.png";

// Fix for default marker icons
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: markerIcon2x,
  iconUrl: markerIcon,
  shadowUrl: markerShadow,
});

const DeliveryReport = () => {
  const [deliveries, setDeliveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [timeFilter, setTimeFilter] = useState("all");
  const [selectedMonth, setSelectedMonth] = useState(new Date().getMonth());
  const [selectedYear, setSelectedYear] = useState(new Date().getFullYear());
  const [showMap, setShowMap] = useState(false);
  const [pendingLocations, setPendingLocations] = useState([]);

  const fetchDeliveries = useCallback(async () => {
    try {
      const res = await fetch("http://localhost:5000/deliveries");
      if (!res.ok) throw new Error("Failed to fetch deliveries");
      const data = await res.json();
      setDeliveries(data);

      // Extract pending delivery locations for the map
      const pending = data.filter((d) => d.status === "pending" && d.location);
      setPendingLocations(pending);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    fetchDeliveries();
  }, [fetchDeliveries]);

  // Format date to dd/mm/yy
  const formatDate = (dateString) => {
    const date = new Date(dateString);
    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear().toString().slice(-2);
    return `${day}/${month}/${year}`;
  };

  // Filter deliveries based on time selection
  const filteredDeliveries = useMemo(() => {
    if (timeFilter === "all") return deliveries;

    return deliveries.filter((d) => {
      const deliveryDate = new Date(d.createdAt);
      if (timeFilter === "monthly") {
        return (
          deliveryDate.getMonth() === selectedMonth &&
          deliveryDate.getFullYear() === selectedYear
        );
      } else if (timeFilter === "yearly") {
        return deliveryDate.getFullYear() === selectedYear;
      }
      return true;
    });
  }, [deliveries, timeFilter, selectedMonth, selectedYear]);

  // Summary calculation
  const summary = useMemo(() => {
    const total = filteredDeliveries.length;
    const delivered = filteredDeliveries.filter(
      (d) => d.status === "delivered"
    ).length;
    const pending = total - delivered;
    const totalRevenue = filteredDeliveries.reduce(
      (sum, d) => sum + (d.deliveryFee || 0),
      0
    );
    const freeDeliveries = filteredDeliveries.filter(
      (d) => !d.deliveryFee || d.deliveryFee === 0
    ).length;

    return { total, delivered, pending, totalRevenue, freeDeliveries };
  }, [filteredDeliveries]);

  // Monthly revenue data for chart
  const monthlyRevenueData = useMemo(() => {
    const months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];

    const revenueByMonth = months.map((month, index) => {
      const monthDeliveries = deliveries.filter(
        (d) =>
          new Date(d.createdAt).getMonth() === index &&
          new Date(d.createdAt).getFullYear() === selectedYear
      );
      return monthDeliveries.reduce((sum, d) => sum + (d.deliveryFee || 0), 0);
    });

    return {
      labels: months,
      datasets: [
        {
          label: "Monthly Revenue (Rs)",
          data: revenueByMonth,
          backgroundColor: "rgba(54, 162, 235, 0.6)",
          borderColor: "rgba(54, 162, 235, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [deliveries, selectedYear]);

  // Yearly revenue data for chart
  const yearlyRevenueData = useMemo(() => {
    const years = Array.from(
      new Set(deliveries.map((d) => new Date(d.createdAt).getFullYear()))
    ).sort();

    const revenueByYear = years.map((year) => {
      const yearDeliveries = deliveries.filter(
        (d) => new Date(d.createdAt).getFullYear() === year
      );
      return yearDeliveries.reduce((sum, d) => sum + (d.deliveryFee || 0), 0);
    });

    return {
      labels: years.map((y) => y.toString()),
      datasets: [
        {
          label: "Yearly Revenue (Rs)",
          data: revenueByYear,
          backgroundColor: "rgba(75, 192, 192, 0.6)",
          borderColor: "rgba(75, 192, 192, 1)",
          borderWidth: 1,
        },
      ],
    };
  }, [deliveries]);

  // Available years for filter dropdown
  const availableYears = useMemo(() => {
    return Array.from(
      new Set(deliveries.map((d) => new Date(d.createdAt).getFullYear()))
    ).sort();
  }, [deliveries]);

  if (loading)
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
      </div>
    );

  if (error)
    return (
      <div className="bg-red-100 border-l-4 border-red-500 text-red-700 p-4 my-4">
        <p>Error: {error}</p>
        <button
          onClick={fetchDeliveries}
          className="mt-2 bg-red-500 hover:bg-red-700 text-white font-bold py-1 px-3 rounded text-sm"
        >
          Retry
        </button>
      </div>
    );

  return (
    <div className="max-w-7xl mx-auto p-4 sm:p-6">
      <header className="bg-blue-600 p-4 shadow-lg rounded-lg mb-6">
        <div className="container mx-auto flex flex-col sm:flex-row justify-between items-center">
          <h1 className="text-white text-xl font-bold mb-2 sm:mb-0">
            📦 Delivery Analytics Dashboard
          </h1>
          <div className="flex gap-4">
            <Link
              to="/admin/deliveryReport"
              className="text-white hover:text-gray-200 font-bold text-lg"
            >
              Delivery Report
            </Link>
            <button
              onClick={() => setShowMap(!showMap)}
              className="bg-white text-blue-600 px-3 py-1 rounded font-semibold text-sm"
            >
              {showMap ? "Hide Map" : "Show Pending Deliveries Map"}
            </button>
          </div>
        </div>
      </header>

      {/* Map View for Pending Deliveries */}
      {showMap && pendingLocations.length > 0 && (
        <div className="bg-white p-4 rounded-lg shadow mb-6 h-96">
          <h3 className="text-lg font-semibold mb-2">
            Pending Deliveries Locations
          </h3>
          <MapContainer
            center={[
              pendingLocations[0]?.location?.lat || 6.9271,
              pendingLocations[0]?.location?.lng || 79.8612,
            ]}
            zoom={12}
            style={{ height: "100%", width: "100%" }}
          >
            <TileLayer
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
              attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            />
            {pendingLocations.map((delivery, index) => (
              <Marker
                key={index}
                position={[delivery.location.lat, delivery.location.lng]}
              >
                <Popup>
                  <div>
                    <p>
                      <strong>Order ID:</strong> {delivery.orderId}
                    </p>
                    <p>
                      <strong>Address:</strong>{" "}
                      {delivery.formattedAddress || delivery.address}
                    </p>
                    <p>
                      <strong>Date:</strong> {formatDate(delivery.createdAt)}
                    </p>
                  </div>
                </Popup>
              </Marker>
            ))}
          </MapContainer>
        </div>
      )}

      {/* Time Filter Controls */}
      <div className="bg-white p-4 rounded-lg shadow mb-6">
        <div className="flex flex-wrap gap-4 items-center">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Time Period
            </label>
            <select
              value={timeFilter}
              onChange={(e) => setTimeFilter(e.target.value)}
              className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
            >
              <option value="all">All Time</option>
              <option value="monthly">Monthly</option>
              <option value="yearly">Yearly</option>
            </select>
          </div>

          {timeFilter === "monthly" && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Month
              </label>
              <select
                value={selectedMonth}
                onChange={(e) => setSelectedMonth(parseInt(e.target.value))}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {[
                  "January",
                  "February",
                  "March",
                  "April",
                  "May",
                  "June",
                  "July",
                  "August",
                  "September",
                  "October",
                  "November",
                  "December",
                ].map((month, index) => (
                  <option key={month} value={index}>
                    {month}
                  </option>
                ))}
              </select>
            </div>
          )}

          {(timeFilter === "monthly" || timeFilter === "yearly") && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Year
              </label>
              <select
                value={selectedYear}
                onChange={(e) => setSelectedYear(parseInt(e.target.value))}
                className="block w-full pl-3 pr-10 py-2 text-base border-gray-300 focus:outline-none focus:ring-blue-500 focus:border-blue-500 sm:text-sm rounded-md"
              >
                {availableYears.map((year) => (
                  <option key={year} value={year}>
                    {year}
                  </option>
                ))}
              </select>
            </div>
          )}
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        {[
          {
            title: "Total Deliveries",
            value: summary.total,
            bg: "bg-blue-600",
            icon: "📦",
          },
          {
            title: "Delivered",
            value: summary.delivered,
            bg: "bg-green-600",
            icon: "✅",
          },
          {
            title: "Pending",
            value: summary.pending,
            bg: "bg-yellow-500",
            icon: "⏳",
          },
          {
            title: "Free Deliveries",
            value: summary.freeDeliveries,
            bg: "bg-gray-600",
            icon: "🎁",
          },
          {
            title: "Total Revenue",
            value: `Rs ${summary.totalRevenue.toFixed(2)}`,
            bg: "bg-purple-600",
            icon: "💰",
          },
        ].map((card, index) => (
          <div
            key={index}
            className={`${card.bg} p-4 rounded-lg shadow text-white`}
          >
            <div className="flex justify-between items-start">
              <div>
                <h3 className="text-sm sm:text-base">{card.title}</h3>
                <p className="text-xl sm:text-2xl font-semibold">
                  {card.value}
                </p>
              </div>
              <span className="text-2xl">{card.icon}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Revenue Charts Section */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">
            Monthly Revenue ({selectedYear})
          </h3>
          <div className="h-64">
            <Bar
              data={monthlyRevenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Revenue (Rs)",
                    },
                  },
                },
              }}
            />
          </div>
        </div>

        <div className="bg-white p-4 rounded-lg shadow">
          <h3 className="text-lg font-semibold mb-4">Yearly Revenue</h3>
          <div className="h-64">
            <Bar
              data={yearlyRevenueData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                scales: {
                  y: {
                    beginAtZero: true,
                    title: {
                      display: true,
                      text: "Revenue (Rs)",
                    },
                  },
                },
              }}
            />
          </div>
        </div>
      </div>

      {/* Delivery Table */}
      <div className="overflow-x-auto bg-white rounded-lg shadow">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Order ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                User ID
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Type
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Address
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Status
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Fee
              </th>
              <th className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                Date
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {filteredDeliveries.map((d) => (
              <tr key={d._id} className="hover:bg-gray-50">
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-900">
                  {d.orderId}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {d.userId}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {d.deliveryType}
                </td>
                <td className="px-4 py-3 text-sm text-gray-500 max-w-xs truncate">
                  {d.formattedAddress || d.address}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm">
                  <span
                    className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                      d.status === "delivered"
                        ? "bg-green-100 text-green-800"
                        : "bg-yellow-100 text-yellow-800"
                    }`}
                  >
                    {d.status}
                  </span>
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {d.deliveryFee ? `Rs ${d.deliveryFee.toFixed(2)}` : "Free"}
                </td>
                <td className="px-4 py-3 whitespace-nowrap text-sm text-gray-500">
                  {formatDate(d.createdAt)}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default React.memo(DeliveryReport);
