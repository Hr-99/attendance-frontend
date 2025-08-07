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

  const office = { lat: 19.068144, lon: 72.833042 }; 

  // const withinOffice = () => {
  //   if (!position) return false;
  //   const dist = Math.sqrt(
  //     Math.pow(position.lat - office.lat, 2) +
  //       Math.pow(position.lon - office.lon, 2)
  //   );
  //   return dist < 0.01; // ~1 km
  // };

  const withinOffice = () => {
  if (!position) return false;

  const toRad = (value) => (value * Math.PI) / 180;

  const R = 6371000; // Earth radius in meters
  const dLat = toRad(position.lat - office.lat);
  const dLon = toRad(position.lon - office.lon);

  const lat1 = toRad(office.lat);
  const lat2 = toRad(position.lat);

  const a =
    Math.sin(dLat / 2) ** 2 +
    Math.cos(lat1) * Math.cos(lat2) *
    Math.sin(dLon / 2) ** 2;

  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));

  const dist = R * c;

  return dist <= 100; // within 100 meters
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
    <div className='d-flex justify-content-center align-items-center vh-100 vw-100'>

    <div className=''>
      <h2>Welcome, {user?.name}</h2>
      {/* <p>Your location: {position ? `${position.lat}, ${position.lon}` : 'Getting location...'}</p> */}
      {/* <p>Your location: {position ? `${position.lat}, ${position.lon}` : 'Getting location...'}</p> */}

      <div className='d-flex justify-content-between gap-3'>
        <button onClick={() => handleCheck('checkin')} disabled={loading || !!checkInTime}>
          {checkInTime ? 'Checked In' : loading ? 'Checking in...' : 'Check In'}
        </button>
        <button onClick={() => handleCheck('checkout')} disabled={loading || !!checkOutTime}>
          {checkOutTime ? 'Checked Out' : loading ? 'Checking out...' : 'Check Out'}
        </button>
      </div>

      <br />
      <div className='d-flex justify-content-center'><button onClick={handleLogout}>Logout</button></div>

      {statusMessage && <p className='text-center' style={{ color: 'green' }}>{statusMessage}</p>}
      {error && <p className='text-center' style={{ color: 'red' }}>{error}</p>}
    </div>
    </div>

  );
}

export default Dashboard;
