import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { fetchAttendanceExport, fetchAttendancePaginated } from '../features/attendance/attendanceThunks';
import { setPage, setFilters } from '../features/attendance/attendanceSlice';
import { logout } from '../features/auth/authSlice';
import { useNavigate } from 'react-router-dom';
import api from '../api';
import { handleExportRows } from '../utils/handleExportRows';

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


  //  const getTimeDifference = (checkIn, checkOut) => {
  //   const today = new Date().toDateString();
  //   const inTime = new Date(`${today} ${checkIn}`);
  //   const outTime = new Date(`${today} ${checkOut}`);

  //   const diffMs = outTime - inTime;

  //   if (diffMs < 0) return 'Invalid';

  //   const hours = Math.floor(diffMs / (1000 * 60 * 60));
  //   const minutes = Math.floor((diffMs % (1000 * 60 * 60)) / (1000 * 60));

  //   return `${hours}h ${minutes}m`;
  // };

  return (
    <div className='d-flex justify-content-center align-items-center vh-100 vw-100'>

    <div className='d-flex flex-column p-1'>
      <div className='d-flex justify-content-between'>
        <h2 style={{fontSize:"22px"}}>Admin Panel</h2>
        <dv>
          <button onClick={handleLogout}>Logout</button>
          &nbsp;
          <button onClick={handleRegister}>+ Register New User</button>
          &nbsp;
          <button onClick={()=>{
            dispatch(fetchAttendanceExport(filters)) .unwrap()
  .then((data) => {
    console.log(data);
    

   const customHeaders = {
  'user.name': 'Employee Name',
  'user.email': 'Email',
  date: 'Date',
  checkInTime: 'Check-In Time',
  checkOutTime: 'Check-Out Time',
  duration:"Total Hours",
};

    handleExportRows(data.data,customHeaders,["totalRecords","checkInLocation","checkOutLocation","user._id","_id"]);

  })
  .catch((error) => {
    console.error("Export failed:", error);
  });
          }}>Export</button>
        </dv>
      </div>

<hr />
      {/* Filters */}
      <div className='d-flex flex-wrap gap-2 mt-2'>
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
        <button className='p-0 p-1 px-3' style={{fontSize:"14px"}} onClick={handleClearFilters}>Clear</button>
      </div>

      {/* Attendance Table */}
      {loading && <p>Loading...</p>}
      {error && <p style={{ color: 'red' }}>{error}</p>}

      <table border="1" style={{ marginTop: '1rem', width: '100%' }}>
        <thead style={{border: '1px solid black'}}>
          <tr>
            <th style={{border:"1px solid black"}}>Name</th>
            <th style={{border:"1px solid black"}}>Date</th>
            <th style={{border:"1px solid black"}}>Check-In</th>
            <th style={{border:"1px solid black"}}>Check-Out</th>
            <th style={{border:"1px solid black"}}>Total Hours</th>
            
          </tr>
        </thead>
        <tbody >
          {records?.map((rec, i) => (
            <tr key={i}>
              <td style={{border:"1px solid black"}}>{rec.user?.name}</td>
              <td style={{border:"1px solid black"}}>{new Date(rec.date).toLocaleDateString()}</td>
              <td style={{border:"1px solid black"}}>{rec.checkInTime || '-'}</td>
              <td style={{border:"1px solid black"}}>{rec.checkOutTime || '-'}</td>
              <td style={{border:"1px solid black"}}>{rec.duration || "-"}</td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Pagination */}
      {renderPagination()}
    </div>
    </div>

  );
}

export default AdminPanel;
