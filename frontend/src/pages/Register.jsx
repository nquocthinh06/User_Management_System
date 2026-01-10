import { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { authAPI } from '../services/api';
import { useAuth } from '../context/AuthContext';

const Register = () => {
    const [formData, setFormData] = useState({
        name: '',
        email: '',
        password: '',
        confirmPassword: ''
    });
    const [errors, setErrors] = useState({});
    const [serverError, setServerError] = useState('');
    const [loading, setLoading] = useState(false);

    const { login } = useAuth();
    const navigate = useNavigate();

    const handleChange = (e) => {
        setFormData({
            ...formData,
            [e.target.name]: e.target.value
        });
        // Clear error for this field
        if (errors[e.target.name]) {
            setErrors({
                ...errors,
                [e.target.name]: ''
            });
        }
        setServerError('');
    };

    const validate = () => {
        const newErrors = {};

        if (formData.name.length < 2) {
            newErrors.name = 'Tên phải có ít nhất 2 ký tự';
        }

        if (!/\S+@\S+\.\S+/.test(formData.email)) {
            newErrors.email = 'Email không hợp lệ';
        }

        if (formData.password.length < 6) {
            newErrors.password = 'Mật khẩu phải có ít nhất 6 ký tự';
        }

        if (formData.password !== formData.confirmPassword) {
            newErrors.confirmPassword = 'Mật khẩu xác nhận không khớp';
        }

        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        if (!validate()) return;

        setLoading(true);
        setServerError('');

        try {
            const response = await authAPI.register({
                name: formData.name,
                email: formData.email,
                password: formData.password
            });
            const { user, token } = response.data.data;
            login(user, token);
            navigate('/dashboard');
        } catch (err) {
            setServerError(err.response?.data?.message || 'Đã xảy ra lỗi, vui lòng thử lại');
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="page">
            <div className="card card-sm fade-in">
                <h1 className="card-title">Đăng Ký</h1>
                <p className="card-subtitle">Tạo tài khoản mới để bắt đầu.</p>

                {serverError && (
                    <div className="alert alert-error">
                        <span>⚠️</span> {serverError}
                    </div>
                )}

                <form onSubmit={handleSubmit}>
                    <div className="form-group">
                        <label className="form-label" htmlFor="name">Họ và tên</label>
                        <input
                            type="text"
                            id="name"
                            name="name"
                            className="form-input"
                            placeholder="Nhập họ và tên"
                            value={formData.name}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                        {errors.name && <p className="form-error">⚠️ {errors.name}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="email">Email</label>
                        <input
                            type="email"
                            id="email"
                            name="email"
                            className="form-input"
                            placeholder="Nhập email của bạn"
                            value={formData.email}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                        {errors.email && <p className="form-error">⚠️ {errors.email}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="password">Mật khẩu</label>
                        <input
                            type="password"
                            id="password"
                            name="password"
                            className="form-input"
                            placeholder="Tạo mật khẩu (ít nhất 6 ký tự)"
                            value={formData.password}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                        {errors.password && <p className="form-error">⚠️ {errors.password}</p>}
                    </div>

                    <div className="form-group">
                        <label className="form-label" htmlFor="confirmPassword">Xác nhận mật khẩu</label>
                        <input
                            type="password"
                            id="confirmPassword"
                            name="confirmPassword"
                            className="form-input"
                            placeholder="Nhập lại mật khẩu"
                            value={formData.confirmPassword}
                            onChange={handleChange}
                            required
                            disabled={loading}
                        />
                        {errors.confirmPassword && <p className="form-error">⚠️ {errors.confirmPassword}</p>}
                    </div>

                    <button
                        type="submit"
                        className="btn btn-primary btn-block"
                        disabled={loading}
                    >
                        {loading ? (
                            <>
                                <div className="spinner"></div>
                                Đang đăng ký...
                            </>
                        ) : (
                            'Đăng Ký'
                        )}
                    </button>
                </form>

                <div className="auth-footer">
                    Đã có tài khoản? <Link to="/login">Đăng nhập</Link>
                </div>
            </div>
        </div>
    );
};

export default Register;
