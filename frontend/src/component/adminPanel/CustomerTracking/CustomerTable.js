import React, { useState, useEffect } from "react";
import axios from "axios";

const UserTable = () => {
  const [users, setUsers] = useState([]); // Initially set users as an empty array
  const [loading, setLoading] = useState(true);
  const [selectedUser, setSelectedUser] = useState(null);
  const [filters, setFilters] = useState({ country: "", city: "", timeSpent: "", ip: "" });
  const [showAllUrls, setShowAllUrls] = useState(false); // Controls expanded URLs

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = () => {
    setLoading(true);
    axios
      .get(`http://localhost:3001/api/customers`)
      .then((response) => {
        const userData = response.data?.data || [];
        setUsers(userData);
        setLoading(false);
      })
      .catch((error) => {
        console.error("Error fetching user data:", error);
        setUsers([]);
        setLoading(false);
      });
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    setFilters((prev) => ({ ...prev, [name]: value }));
  };

  const filteredUsers = users.filter((user) => {
    return (
      (filters.country === "" || user.country?.toLowerCase().includes(filters.country.toLowerCase())) &&
      (filters.ip === "" || user.ip_address?.includes(filters.ip)) &&
      (filters.timeSpent === "" || user.time_spent?.toString().includes(filters.timeSpent)) &&
      (filters.city === "" || user.city?.toLowerCase().includes(filters.city.toLowerCase()))
    );
  });

  return (
    <div className="bg-white p-8 rounded-lg shadow-lg">
      <h3 className="text-lg font-semibold text-gray-900 mb-6">Visitors</h3>

      {/* Filters Section */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-4">
        <input
          type="text"
          name="country"
          placeholder="Search by Country"
          value={filters.country}
          onChange={handleFilterChange}
          className="border text-gray-800 p-2 rounded"
        />
        <input
          type="text"
          name="city"
          placeholder="Search by City"
          value={filters.city}
          onChange={handleFilterChange}
          className="border text-gray-800 p-2 rounded"
        />
        <input
          type="text"
          name="timeSpent"
          placeholder="Search by Time Spent"
          value={filters.timeSpent}
          onChange={handleFilterChange}
          className="border text-gray-800 p-2 rounded"
        />
        <input
          type="text"
          name="ip"
          placeholder="Search by IP Address"
          value={filters.ip}
          onChange={handleFilterChange}
          className="border text-gray-800 p-2 rounded"
        />
      </div>

      {loading ? (
        <div className="flex justify-center py-6">
          <div className="spinner-border animate-spin w-12 h-12 border-4 border-blue-600 border-t-transparent rounded-full"></div>
        </div>
      ) : (
        <div className="overflow-x-auto shadow-lg rounded-lg">
          <table className="min-w-full table-auto">
            <thead>
              <tr className="bg-gray-100 text-gray-700 text-sm">
                <th className="px-6 py-3 border-b">IP Address</th>
                <th className="px-6 py-3 border-b">Emails</th>
                <th className="px-6 py-3 border-b">Time Spent (s)</th>
                <th className="px-6 py-3 border-b">Country</th>
                <th className="px-6 py-3 border-b">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredUsers.length > 0 ? (
                filteredUsers.map((user, index) => (
                  <tr key={index} className="hover:bg-gray-50 transition-colors duration-300">
                    <td className="px-6 py-4 text-gray-800 border-b">{user.ip_address}</td>
                    <td className="px-6 py-4 text-gray-800 border-b">
                      {user.emails &&
                        JSON.parse(user.emails || "[]").map((email, i) => (
                          <a
                            key={i}
                            href={`mailto:${email}`}
                            className="text-blue-600 hover:underline block"
                          >
                            {email}
                          </a>
                        ))}
                    </td>
                    <td className="px-6 py-4 text-gray-800 border-b">{user.time_spent}</td>
                    <td className="px-6 py-4 text-gray-800 border-b">{user.country || "N/A"}</td>
                    <td className="px-6 py-4 text-gray-800 border-b">
                      <button
                        onClick={() => setSelectedUser(user)}
                        className="bg-blue-600 text-white px-3 py-1 rounded hover:bg-blue-700"
                      >
                        View Details
                      </button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="5" className="text-center text-gray-500 py-4">
                    No user data found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}

      {selectedUser && (
        <div className="fixed inset-0 mt-4 bg-gray-900 bg-opacity-50 flex justify-center items-center p-4 z-50">
          <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
            <h3 className="text-xl text-gray-800 font-semibold mb-4">User Details</h3>
            <p className="text-gray-800"><strong>IP Address:</strong> {selectedUser.ip_address}</p>
            <p className="text-gray-800"><strong>Time Spent (s):</strong> {selectedUser.time_spent || "N/A"}</p>

            <p className="text-gray-800"><strong>Device:</strong> {selectedUser.device_type || "N/A"}</p>
            <p className="text-gray-800"><strong>Browser:</strong> {selectedUser.browser || "N/A"}</p>

            <p className="text-gray-800"><strong>Pages Visited:</strong></p>
            <ul className="list-disc pl-5 text-blue-600">
              {selectedUser.urls && JSON.parse(selectedUser.urls || "[]").slice(0, 3).map((url, i) => (
                <li key={i}>
                  <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                    {url.length > 50 ? `${url.substring(0, 50)}...` : url}
                  </a>
                </li>
              ))}
              {selectedUser.urls && JSON.parse(selectedUser.urls || "[]").length > 3 && (
                <button
                  onClick={() => setShowAllUrls(!showAllUrls)}
                  className="text-blue-500 text-sm underline mt-2"
                >
                  {showAllUrls ? "Show Less" : "Show More"}
                </button>
              )}
              {showAllUrls &&
                JSON.parse(selectedUser.urls || "[]").slice(3).map((url, i) => (
                  <li key={i}>
                    <a href={url} target="_blank" rel="noopener noreferrer" className="hover:underline">
                      {url}
                    </a>
                  </li>
                ))}
            </ul>
            <p className="text-gray-800"><strong>Location:</strong></p>
            <ul className="list-disc pl-5 text-gray-800">
              <li><strong>Country:</strong> {selectedUser.country || "Unknown"}</li>
              <li><strong>Region:</strong> {selectedUser.region || "Unknown"}</li>
              <li><strong>City:</strong> {selectedUser.city || "Unknown"}</li>
              <li><strong>Latitude:</strong> {selectedUser.latitude || "N/A"}</li>
              <li><strong>Longitude:</strong> {selectedUser.longitude || "N/A"}</li>
            </ul>
            <button
              onClick={() => setSelectedUser(null)}
              className="mt-4 bg-red-500 text-white px-4 py-2 rounded hover:bg-red-600"
            >
              Close
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default UserTable;
