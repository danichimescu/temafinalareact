import { useEffect, useMemo, useState } from 'react';
import { useAuthContext } from './AuthContext';
import { toast } from 'react-toastify';
import styles from './Profile.module.css';

const apiUrl = import.meta.env.VITE_API_URL;

export function Profile() {
  const { accessToken, user, login } = useAuthContext();

  // Profile form state
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');

  // Password form state
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');

  // Orders state
  const [orders, setOrders] = useState([]);

  const authHeader = useMemo(() => ({
    Authorization: `Bearer ${accessToken}`,
    'Content-Type': 'application/json',
  }), [accessToken]);

  // Load user data into form
  useEffect(() => {
    if (user) {
      setFirstName(user.firstName || '');
      setLastName(user.lastName || '');
      setPhone(user.phone || '');
    }
  }, [user]);

  // Fetch user's orders
  useEffect(() => {
    if (!user?.id) return;

    fetch(`${apiUrl}/comanda?userId=${user.id}`, {
      headers: authHeader,
    })
      .then((res) => res.json())
      .then((data) => {
        if (Array.isArray(data)) {
          setOrders(data);
        }
      })
      .catch((err) => {
        console.error('Failed to fetch orders:', err);
      });
  }, [user?.id, authHeader]);

  // Update profile info
  async function handleProfileUpdate(e) {
    e.preventDefault();

    if (!firstName.trim() || !lastName.trim()) {
      toast.error('First name and last name are required');
      return;
    }

    if (phone && phone.length < 10) {
      toast.error('Phone number must be at least 10 characters');
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/users/${user.id}`, {
        method: 'PATCH',
        headers: authHeader,
        body: JSON.stringify({
          firstName: firstName.trim(),
          lastName: lastName.trim(),
          phone: phone.trim(),
        }),
      });

      if (res.ok) {
        const updatedUser = await res.json();
        // Update auth context with new user data
        login({ accessToken, user: updatedUser });
        toast.success('Profile updated successfully');
      } else {
        toast.error('Failed to update profile');
      }
    } catch (err) {
      toast.error('Error updating profile');
      console.error(err);
    }
  }

  // Update password
  async function handlePasswordUpdate(e) {
    e.preventDefault();

    if (newPassword.length < 6) {
      toast.error('Password must be at least 6 characters');
      return;
    }

    if (newPassword !== confirmPassword) {
      toast.error('Passwords do not match');
      return;
    }

    try {
      const res = await fetch(`${apiUrl}/users/${user.id}`, {
        method: 'PATCH',
        headers: authHeader,
        body: JSON.stringify({
          password: newPassword,
        }),
      });

      if (res.ok) {
        toast.success('Password updated successfully');
        setNewPassword('');
        setConfirmPassword('');
      } else {
        toast.error('Failed to update password');
      }
    } catch (err) {
      toast.error('Error updating password');
      console.error(err);
    }
  }

  if (!user) {
    return <p>Please log in to view your profile.</p>;
  }

  return (
    <div className={styles.profileContainer}>
      <h1>My Profile</h1>

      {/* Profile Info Section */}
      <section className={styles.section}>
        <h2>Edit Profile</h2>
        <form className="brandForm" onSubmit={handleProfileUpdate}>
          <label htmlFor="profileEmail">Email</label>
          <input
            id="profileEmail"
            type="email"
            value={user.email}
            disabled
            className={styles.disabledInput}
          />

          <label htmlFor="profileFirstName">First Name</label>
          <input
            id="profileFirstName"
            type="text"
            value={firstName}
            onChange={(e) => setFirstName(e.target.value)}
            placeholder="First Name"
          />

          <label htmlFor="profileLastName">Last Name</label>
          <input
            id="profileLastName"
            type="text"
            value={lastName}
            onChange={(e) => setLastName(e.target.value)}
            placeholder="Last Name"
          />

          <label htmlFor="profilePhone">Phone</label>
          <input
            id="profilePhone"
            type="tel"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            placeholder="Phone Number"
          />

          <button type="submit" className="secondColumn autoWidth">
            Update Profile
          </button>
        </form>
      </section>

      {/* Password Section */}
      <section className={styles.section}>
        <h2>Change Password</h2>
        <form className="brandForm" onSubmit={handlePasswordUpdate}>
          <label htmlFor="newPassword">New Password</label>
          <input
            id="newPassword"
            type="password"
            value={newPassword}
            onChange={(e) => setNewPassword(e.target.value)}
            placeholder="New Password"
          />

          <label htmlFor="confirmPassword">Confirm Password</label>
          <input
            id="confirmPassword"
            type="password"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            placeholder="Confirm Password"
          />

          <button type="submit" className="secondColumn autoWidth">
            Change Password
          </button>
        </form>
      </section>

      {/* Orders Section */}
      <section className={styles.section}>
        <h2>My Orders</h2>
        {orders.length === 0 ? (
          <p>You have no orders yet.</p>
        ) : (
          <div className={styles.ordersList}>
            {orders.map((order) => (
              <div key={order.id} className={styles.orderCard}>
                <div className={styles.orderHeader}>
                  <span className={styles.orderType}>
                    {order.serviceType?.toUpperCase() || 'ORDER'}
                  </span>
                  <span className={styles.orderPrice}>
                    {order.price?.toFixed(2)} RON
                  </span>
                </div>
                {order.serviceType === 'printing' && (
                  <div className={styles.orderDetails}>
                    <p><strong>Format:</strong> {order.format}</p>
                    <p><strong>Copies:</strong> {order.copies}</p>
                    <p><strong>Print Type:</strong> {order.printType}</p>
                    <p><strong>Color:</strong> {order.colorType}</p>
                  </div>
                )}
                <div className={styles.orderStatus}>
                  Status: {order.completed ? 'Completed' : 'Pending'}
                </div>
              </div>
            ))}
          </div>
        )}
      </section>
    </div>
  );
}
