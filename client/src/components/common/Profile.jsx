import React, { useEffect, useState, useContext } from 'react';
import axios from 'axios';
import { userAuthorContextObj } from '../contexts/UserAuthorContext';

function Profile() {
  const [counts, setCounts] = useState({ users: 0, authors: 0, articles: 0 });
  const [email, setEmail] = useState('');
  const { currentUser } = useContext(userAuthorContextObj);

  useEffect(() => {
    if (currentUser?.role === 'admin') {
      axios.get('/admin-api/user-counts')
        .then(res => setCounts(res.data))
        .catch(err => console.error(err));
    }
  }, [currentUser]);

  const makeAdmin = () => {
    axios.post('/admin-api/make-admin', { email })
      .then(() => alert("Admin role assigned successfully"))
      .catch(() => alert("Failed to assign admin role"));
  };

  if (!currentUser) return <div className="text-center mt-4">Loading...</div>;
  // console.log(counts)
  return (
    <div className="container mt-5">
      <div className="card shadow p-4">
        <div className="text-center">
          <img
            src={currentUser.profileImageUrl}
            alt="Profile"
            className="rounded-circle mb-3"
            width="100"
            height="100"
          />
          <h4>{currentUser.firstName} {currentUser.lastName}</h4>
          <p className="text-muted">{currentUser.email}</p>
          <span className="badge bg-primary text-capitalize">{currentUser.role}</span>
        </div>

        {currentUser.role === 'admin' && (
          <div className="mt-4">
            <h5 className="text-center">Admin Dashboard</h5>
            <div className="row text-center my-3">
              <div className="col-md-4"><strong>Users:</strong> {counts.users}</div>
              <div className="col-md-4"><strong>Authors:</strong> {counts.authors}</div>
              <div className="col-md-4"><strong>Articles:</strong> {counts.articles}</div>
            </div>

            <div className="input-group">
              <input
                type="email"
                className="form-control"
                placeholder="Enter email to promote"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button className="btn btn-success" onClick={makeAdmin}>
                Make Admin
              </button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default Profile;
