import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendancePaginated } from '../features/attendance/attendanceThunks';
import { setPage, setFilters } from '../features/attendance/attendanceSlice';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import api from '../api';

function AdminPanel() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const { records, loading, error, page, totalPages, filters } = useSelector(
    (state) => state.attendance
  );
  const { user } = useSelector((state) => state.auth);

  const [allUsers, setAllUsers] = useState([]);

  useEffect(() => {
    if (user?.role !== 'admin') return navigate('/');
    dispatch(fetchAttendancePaginated({ page, limit: 10, ...filters }));
  }, [dispatch, page, filters, navigate, user]);

  useEffect(() => {
    // Fetch all users for dropdown
    api
      .get('/auth/all')
      .then((res) => setAllUsers(res.data))
      .catch((err) => console.error('❌ Failed to load users:', err));
  }, []);

  const handleLogout = () => {
    dispatch(logout());
    navigate('/');
  };

  const handleFilterChange = (e) => {
    const { name, value } = e.target;
    dispatch(setFilters({ ...filters, [name]: value }));
  };

  const handleClearFilters = () => {
    dispatch(setFilters({ from: '', to: '', user: '' }));
    dispatch(setPage(1));
  };

  const handlePageChange = (newPage) => {
    dispatch(setPage(newPage));
  };

  const handleRegister = () => {
    navigate('/register');
  };

  const renderPagination = () => {
    const maxVisible = 5;
    const pageNumbers = [];

    const startPage = Math.max(1, page - Math.floor(maxVisible / 2));
    const endPage = Math.min(totalPages, startPage + maxVisible - 1);

    for (let i = startPage; i <= endPage; i++) {
      pageNumbers.push(i);
    }

    return (
      <div style={{ marginTop: '1rem' }}>
        {page > 1 && (
          <>
            <button onClick={() => handlePageChange(1)}>« First</button>
            <span>...</span>
          </>
        )}

        {pageNumbers.map((pg) => (
          <button
            key={pg}
            onClick={() => handlePageChange(pg)}
            disabled={pg === page}
            style={{
              marginRight: 4,
              backgroundColor: pg === page ? '#ccc' : '#fff',
            }}
          >
            {pg}
          </button>
        ))}

        {page < totalPages && (
          <>
            <span>...</span>
            <button onClick={() => handlePageChange(totalPages)}>Last »</button>
          </>
        )}
      </div>
    );
  };

  return (
    <div style={{ padding: '20px' }}>
      <h2>Admin Panel</h2>
      <button onClick={handleLogout}>Logout</button>
      &nbsp;
      <button onClick={handleRegister}>+ Register New User</button>

      {/* Filters */}
      <div style={{ marginTop: '1rem' }}>
        <label>
          From:{' '}
          <input
            type="date"
            name="from"
            value={filters.from}
            onChange={handleFilterChange}
          />
        </label>
        &nbsp;
        <label>
          To:{' '}
          <input
            type="date"
            name="to"
            value={filters.to}
            onChange={handleFilterChange}
          />
        </label>
        &nbsp;
        <label>
          Employee:{' '}
          <select name="user" value={filters.user} onChange={handleFilterChange}>
            <option value="">All</option>
            {allUsers.map((u) => (
              <option key={u._id} value={u._id}>
                {u.name}
              </option>
            ))}
          </select>
        </label>
        &nbsp;
        <button onClick={handleClearFilters}>Clear</button>
      </div>

      {/* Attendance Table */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" style={{ marginTop: '1rem', width: '100%' }}>
        <thead>
          <tr>
            <th>Name</th>
            <th>Date</th>
            <th>Check-In</th>
            <th>Check-Out</th>
          </tr>
        </thead>
        <tbody>
          {records?.map((rec, i) => (
            <tr key={i}>
              <td>{rec.user?.name}</td>
              <td>{new Date(rec.date).toLocaleDateString()}</td>
              <td>{rec.checkInTime || '-'}</td>
              <td>{rec.checkOutTime || '-'}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {renderPagination()}
    </div>
  );
}

export default AdminPanel;
