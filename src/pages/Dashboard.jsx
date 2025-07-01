import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import {
  checkInUser,
  checkOutUser,
} from '../features/attendance/attendanceThunks';
import { logout } from '../features/auth/authSlice';

function Dashboard() {
  const [position, setPosition] = useState(null);
  const dispatch = useDispatch();

  const { user } = useSelector((state) => state.auth);
  const {
    checkInTime,
    checkOutTime,
    statusMessage,
    loading,
    error,
  } = useSelector((state) => state.attendance);

  useEffect(() => {
    navigator.geolocation.getCurrentPosition(
      (pos) => {
        const { latitude, longitude } = pos.coords;
        setPosition({ lat: latitude, lon: longitude });
      },
      () => alert('Enable location access and refresh.')
    );
  }, []);

  const office = { lat: 19.068144, lon: 72.833042 }; // Example: Mumbai. Replace with real office GPS

  const withinOffice = () => {
    if (!position) return false;
    const dist = Math.sqrt(
      Math.pow(position.lat - office.lat, 2) +
        Math.pow(position.lon - office.lon, 2)
    );
    return dist < 0.01; // ~1 km
  };

  const handleCheck = (type) => {
    if (!withinOffice()) return alert('You are not at the office location');
    if (type === 'checkin') dispatch(checkInUser(position));
    else dispatch(checkOutUser(position));
  };

  const handleLogout = () => {
    dispatch(logout());
    window.location.href = '/';
  };

  return (
    <div>
      <h2>Welcome, {user?.name}</h2>
      <p>Your location: {position ? `${position.lat}, ${position.lon}` : 'Getting location...'}</p>

      <button onClick={() => handleCheck('checkin')} disabled={loading || !!checkInTime}>
        {checkInTime ? 'Already Checked In' : loading ? 'Checking in...' : 'Check In'}
      </button>

      <button onClick={() => handleCheck('checkout')} disabled={loading || !!checkOutTime}>
        {checkOutTime ? 'Already Checked Out' : loading ? 'Checking out...' : 'Check Out'}
      </button>

      <br /><br />
      <button onClick={handleLogout}>Logout</button>

      {statusMessage && <p style={{ color: 'green' }}>{statusMessage}</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}
    </div>
  );
}

export default Dashboard;
