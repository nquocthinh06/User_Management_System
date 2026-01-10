import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';
import { userAPI } from '../services/api';

const Profile = () => {
    const { user, updateUser, logout } = useAuth();
    const navigate = useNavigate();

    const [editing, setEditing] = useState(false);
    const [changingPassword, setChangingPassword] = useState(false);
    const [loading, setLoading] = useState(false);
    const [message, setMessage] = useState({ type: '', text: '' });

    const [formData, setFormData] = useState({
        name: user?.name || '',
        avatar: user?.avatar || ''
    });

    const [passwordData, setPasswordData] = useState({
        currentPassword: '',
        newPassword: '',
        confirmPassword: ''
    });

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
    };

    const handlePasswordChange = (e) => {
        setPasswordData({
            ...passwordData,
            [e.target.name]: e.target.value
        });
    };

    const handleUpdateProfile = async (e) => {
        e.preventDefault();
        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            const response = await userAPI.updateProfile(formData);
            updateUser(response.data.data.user);
            setMessage({ type: 'success', text: 'Cập nhật thành công!' });
            setEditing(false);
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Đã xảy ra lỗi' });
        } finally {
            setLoading(false);
        }
    };

    const handleChangePassword = async (e) => {
        e.preventDefault();

        if (passwordData.newPassword !== passwordData.confirmPassword) {
            setMessage({ type: 'error', text: 'Mật khẩu mới không khớp' });
            return;
        }

        if (passwordData.newPassword.length < 6) {
            setMessage({ type: 'error', text: 'Mật khẩu mới phải có ít nhất 6 ký tự' });
            return;
        }

        setLoading(true);
        setMessage({ type: '', text: '' });

        try {
            await userAPI.changePassword({
                currentPassword: passwordData.currentPassword,
                newPassword: passwordData.newPassword
            });
            setMessage({ type: 'success', text: 'Đổi mật khẩu thành công!' });
            setChangingPassword(false);
            setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Đã xảy ra lỗi' });
        } finally {
            setLoading(false);
        }
    };

    const handleDeleteAccount = async () => {
        if (!window.confirm('Bạn có chắc chắn muốn xóa tài khoản? Hành động này không thể hoàn tác!')) {
            return;
        }

        try {
            await userAPI.deleteAccount();
            logout();
            navigate('/login');
        } catch (err) {
            setMessage({ type: 'error', text: err.response?.data?.message || 'Đã xảy ra lỗi' });
        }
    };

    return (
        <div className="page">
            <div className="card card-md fade-in">
                {/* Profile Header */}
                <div className="profile-header">
                    <div className="profile-avatar">
                        {user?.avatar ? (
                            <img src={user.avatar} alt={user.name} />
                        ) : (
                            getInitials(user?.name || 'U')
                        )}
                    </div>
                    <div className="profile-info">
                        <h2>{user?.name}</h2>
                        <p>{user?.email}</p>
                        <span className="profile-badge">{user?.role}</span>
                    </div>
                </div>

                {/* Messages */}
                {message.text && (
                    <div className={`alert alert-${message.type}`}>
                        <span>{message.type === 'success' ? '✅' : '⚠️'}</span> {message.text}
                    </div>
                )}

                {/* Edit Profile Form */}
                {editing ? (
                    <form onSubmit={handleUpdateProfile} className="profile-section">
                        <h3 className="profile-section-title">
                            <span>✏️</span> Chỉnh sửa thông tin
                        </h3>

                        <div className="form-group">
                            <label className="form-label" htmlFor="name">Họ và tên</label>
                            <input
                                type="text"
                                id="name"
                                name="name"
                                className="form-input"
                                value={formData.name}
                                onChange={handleChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="avatar">URL Avatar (tuỳ chọn)</label>
                            <input
                                type="url"
                                id="avatar"
                                name="avatar"
                                className="form-input"
                                placeholder="https://example.com/avatar.jpg"
                                value={formData.avatar}
                                onChange={handleChange}
                                disabled={loading}
                            />
                        </div>

                        <div className="profile-actions">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Đang lưu...' : 'Lưu thay đổi'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setEditing(false);
                                    setFormData({ name: user?.name || '', avatar: user?.avatar || '' });
                                }}
                                disabled={loading}
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                ) : changingPassword ? (
                    <form onSubmit={handleChangePassword} className="profile-section">
                        <h3 className="profile-section-title">
                            <span>🔒</span> Đổi mật khẩu
                        </h3>

                        <div className="form-group">
                            <label className="form-label" htmlFor="currentPassword">Mật khẩu hiện tại</label>
                            <input
                                type="password"
                                id="currentPassword"
                                name="currentPassword"
                                className="form-input"
                                value={passwordData.currentPassword}
                                onChange={handlePasswordChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="newPassword">Mật khẩu mới</label>
                            <input
                                type="password"
                                id="newPassword"
                                name="newPassword"
                                className="form-input"
                                placeholder="Ít nhất 6 ký tự"
                                value={passwordData.newPassword}
                                onChange={handlePasswordChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="form-group">
                            <label className="form-label" htmlFor="confirmPassword">Xác nhận mật khẩu mới</label>
                            <input
                                type="password"
                                id="confirmPassword"
                                name="confirmPassword"
                                className="form-input"
                                value={passwordData.confirmPassword}
                                onChange={handlePasswordChange}
                                required
                                disabled={loading}
                            />
                        </div>

                        <div className="profile-actions">
                            <button type="submit" className="btn btn-primary" disabled={loading}>
                                {loading ? 'Đang lưu...' : 'Đổi mật khẩu'}
                            </button>
                            <button
                                type="button"
                                className="btn btn-secondary"
                                onClick={() => {
                                    setChangingPassword(false);
                                    setPasswordData({ currentPassword: '', newPassword: '', confirmPassword: '' });
                                }}
                                disabled={loading}
                            >
                                Hủy
                            </button>
                        </div>
                    </form>
                ) : (
                    <>
                        {/* Profile Info */}
                        <div className="profile-section">
                            <h3 className="profile-section-title">
                                <span>📋</span> Thông tin tài khoản
                            </h3>

                            <div style={{ display: 'grid', gap: '15px' }}>
                                <div>
                                    <label className="form-label">Email</label>
                                    <p style={{ color: 'var(--text-primary)' }}>{user?.email}</p>
                                </div>
                                <div>
                                    <label className="form-label">Họ và tên</label>
                                    <p style={{ color: 'var(--text-primary)' }}>{user?.name}</p>
                                </div>
                                <div>
                                    <label className="form-label">Ngày tạo</label>
                                    <p style={{ color: 'var(--text-primary)' }}>
                                        {new Date(user?.created_at).toLocaleDateString('vi-VN', {
                                            year: 'numeric',
                                            month: 'long',
                                            day: 'numeric',
                                            hour: '2-digit',
                                            minute: '2-digit'
                                        })}
                                    </p>
                                </div>
                            </div>
                        </div>

                        {/* Actions */}
                        <div className="profile-actions">
                            <button
                                className="btn btn-primary"
                                onClick={() => setEditing(true)}
                            >
                                ✏️ Chỉnh sửa
                            </button>
                            <button
                                className="btn btn-secondary"
                                onClick={() => setChangingPassword(true)}
                            >
                                🔒 Đổi mật khẩu
                            </button>
                            <button
                                className="btn btn-danger"
                                onClick={handleDeleteAccount}
                            >
                                🗑️ Xóa tài khoản
                            </button>
                        </div>
                    </>
                )}
            </div>
        </div>
    );
};

export default Profile;
