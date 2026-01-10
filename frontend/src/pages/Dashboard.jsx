import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const Dashboard = () => {
    const { user } = useAuth();
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadUsers();
    }, []);

    const loadUsers = async () => {
        try {
            const response = await userAPI.getAllUsers();
            setUsers(response.data.data.users);
        } catch (error) {
            console.error('Failed to load users:', error);
        } finally {
            setLoading(false);
        }
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const formatDate = (dateString) => {
        return new Date(dateString).toLocaleDateString('vi-VN', {
            year: 'numeric',
            month: 'long',
            day: 'numeric'
        });
    };

    return (
        <div className="dashboard fade-in">
            <div className="dashboard-header">
                <h1>👋 Xin chào, {user?.name}!</h1>
                <p>Chào mừng bạn đến với Dashboard. Quản lý tài khoản của bạn tại đây.</p>
            </div>

            {/* Stats Cards */}
            <div className="dashboard-stats">
                <div className="stat-card slide-in" style={{ animationDelay: '0.1s' }}>
                    <div className="stat-card-icon">👥</div>
                    <div className="stat-card-value">{users.length}</div>
                    <div className="stat-card-label">Tổng người dùng</div>
                </div>

                <div className="stat-card slide-in" style={{ animationDelay: '0.2s' }}>
                    <div className="stat-card-icon">🛡️</div>
                    <div className="stat-card-value">{user?.role === 'admin' ? 'Admin' : 'User'}</div>
                    <div className="stat-card-label">Vai trò của bạn</div>
                </div>

                <div className="stat-card slide-in" style={{ animationDelay: '0.3s' }}>
                    <div className="stat-card-icon">📅</div>
                    <div className="stat-card-value">{formatDate(user?.created_at)}</div>
                    <div className="stat-card-label">Ngày tham gia</div>
                </div>
            </div>

            {/* Quick Actions */}
            <div className="dashboard-section">
                <h2 className="dashboard-section-title">
                    <span>⚡</span> Hành động nhanh
                </h2>
                <div style={{ display: 'flex', gap: '15px', flexWrap: 'wrap' }}>
                    <Link to="/profile" className="btn btn-primary">
                        👤 Xem Profile
                    </Link>
                    <Link to="/profile" className="btn btn-secondary">
                        ✏️ Chỉnh sửa thông tin
                    </Link>
                </div>
            </div>

            {/* User List */}
            <div className="dashboard-section">
                <h2 className="dashboard-section-title">
                    <span>👥</span> Danh sách người dùng
                </h2>

                {loading ? (
                    <div style={{ textAlign: 'center', padding: '40px' }}>
                        <div className="spinner" style={{ margin: '0 auto' }}></div>
                        <p style={{ marginTop: '15px', color: 'var(--text-secondary)' }}>Đang tải...</p>
                    </div>
                ) : (
                    <div className="user-list">
                        {users.map((u, index) => (
                            <div
                                key={u.id}
                                className="user-item slide-in"
                                style={{ animationDelay: `${0.1 * index}s` }}
                            >
                                <div className="user-item-avatar">
                                    {u.avatar ? (
                                        <img src={u.avatar} alt={u.name} style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
                                    ) : (
                                        getInitials(u.name)
                                    )}
                                </div>
                                <div className="user-item-info">
                                    <div className="user-item-name">
                                        {u.name}
                                        {u.id === user?.id && <span style={{ color: 'var(--accent-primary)', marginLeft: '8px' }}>(Bạn)</span>}
                                    </div>
                                    <div className="user-item-email">{u.email}</div>
                                </div>
                                <div className="profile-badge">{u.role}</div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
};

export default Dashboard;
