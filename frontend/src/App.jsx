import { useState, useEffect } from 'react';
import { api } from './services/api';
import './App.css';

function App() {
  const [users, setUsers] = useState([]);
  const [formData, setFormData] = useState({ name: '', email: '' });
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    try {
      setLoading(true);
      const data = await api.getUsers();
      setUsers(data.users || []);
    } catch (error) {
      setMessage('Error fetching users: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      setLoading(true);
      await api.createUser(formData);
      setFormData({ name: '', email: '' });
      setMessage('User created successfully!');
      fetchUsers();
    } catch (error) {
      setMessage('Error creating user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (id) => {
    try {
      setLoading(true);
      await api.deleteUser(id);
      setMessage('User deleted successfully!');
      fetchUsers();
    } catch (error) {
      setMessage('Error deleting user: ' + error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="App">
      <h1>Node.js + React + SQLite Demo</h1>
      
      {message && (
        <div className="message" style={{ 
          padding: '10px', 
          marginBottom: '20px', 
          backgroundColor: '#e8f5e9', 
          borderRadius: '5px' 
        }}>
          {message}
        </div>
      )}

      <div className="form-container">
        <h2>Add New User</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Name"
            value={formData.name}
            onChange={(e) => setFormData({ ...formData, name: e.target.value })}
            required
          />
          <input
            type="email"
            placeholder="Email"
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            required
          />
          <button type="submit" disabled={loading}>
            {loading ? 'Adding...' : 'Add User'}
          </button>
        </form>
      </div>

      <div className="users-container">
        <h2>Users List</h2>
        {loading && <p>Loading...</p>}
        {users.length === 0 ? (
          <p>No users found. Add some users to get started!</p>
        ) : (
          <table>
            <thead>
              <tr>
                <th>ID</th>
                <th>Name</th>
                <th>Email</th>
                <th>Created At</th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              {users.map((user) => (
                <tr key={user.id}>
                  <td>{user.id}</td>
                  <td>{user.name}</td>
                  <td>{user.email}</td>
                  <td>{new Date(user.created_at).toLocaleString()}</td>
                  <td>
                    <button 
                      onClick={() => handleDelete(user.id)}
                      disabled={loading}
                      style={{ backgroundColor: '#f44336' }}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}

export default App;
