function UserDetailsModal({ user, onClose }) {
  if (!user) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <div className="bg-white rounded-lg p-6 max-w-2xl w-full max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-2xl font-bold">User Details</h2>
          <button
            onClick={onClose}
            className="text-gray-500 hover:text-gray-700"
          >
            &times;
          </button>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h3 className="font-semibold">Basic Information</h3>
            <p>Name: {user.username || "N/A"}</p>
            <p>Email: {user.email || "N/A"}</p>
            <p>Role: {user.role || "N/A"}</p>
            <p>Signup Date: {user.signupDate || "N/A"}</p>
          </div>

          <div>
            <h3 className="font-semibold">Contact Information</h3>
            <p>Address: {user.address || "N/A"}</p>
            <p>Phone: {user.phone || "N/A"}</p>
          </div>

          {user.lastLogin && (
            <div>
              <h3 className="font-semibold">Activity</h3>
              <p>Last Login: {user.lastLogin}</p>
              <p>Status: {user.status || "Active"}</p>
            </div>
          )}
        </div>

        <div className="mt-6 flex justify-end">
          <button
            onClick={onClose}
            className="px-4 py-2 bg-blue-600 text-white rounded hover:bg-blue-700"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}

export default UserDetailsModal;