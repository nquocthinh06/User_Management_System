import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Navbar = () => {
    const { user, logout } = useAuth();
    const navigate = useNavigate();

    const handleLogout = () => {
        logout();
        navigate('/login');
    };

    const getInitials = (name) => {
        return name
            .split(' ')
            .map(n => n[0])
            .join('')
            .toUpperCase()
            .slice(0, 2);
    };

    return (
        <nav className="navbar">
            <div className="container navbar-content">
                <Link to="/" className="navbar-brand">
                    <div className="navbar-brand-icon">👤</div>
                    <span>UserHub</span>
                </Link>

                {user ? (
                    <>
                        <ul className="navbar-nav">
                            <li>
                                <Link to="/dashboard" className="navbar-link">
                                    Dashboard
                                </Link>
                            </li>
                            <li>
                                <Link to="/profile" className="navbar-link">
                                    Profile
                                </Link>
                            </li>
                        </ul>
                        <div className="navbar-user">
                            <div className="navbar-avatar">
                                {user.avatar ? (
                                    <img src={user.avatar} alt={user.name} />
                                ) : (
                                    getInitials(user.name)
                                )}
                            </div>
                            <button className="btn btn-sm btn-outline" onClick={handleLogout}>
                                Đăng xuất
                            </button>
                        </div>
                    </>
                ) : (
                    <ul className="navbar-nav">
                        <li>
                            <Link to="/login" className="navbar-link">
                                Đăng nhập
                            </Link>
                        </li>
                        <li>
                            <Link to="/register" className="btn btn-sm btn-primary">
                                Đăng ký
                            </Link>
                        </li>
                    </ul>
                )}
            </div>
        </nav>
    );
};

export default Navbar;
