import { Link, useLocation } from 'react-router-dom';
import { logout } from '../../services/creditTransferApi';
import { LogOut, Home } from 'lucide-react';

const CreditTransferNavbar = () => {
  const location = useLocation();
  const userInfoStr = localStorage.getItem('user_info');
  let userInfo = null;
  try {
    userInfo = userInfoStr ? JSON.parse(userInfoStr) : null;
  } catch (e) {}

  const handleLogout = () => {
    logout();
    window.location.href = '/credit-transfer/login';
  };

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="bg-white shadow-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center gap-8">
            <Link
              to="/credit-transfer/dashboard"
              className="text-xl font-bold text-blue-600 hover:text-blue-700"
            >
              Hệ thống Chuyển điểm
            </Link>
            <div className="flex gap-4">
              <Link
                to="/credit-transfer/dashboard"
                className={`px-3 py-2 rounded-lg text-sm font-medium transition-colors ${
                  isActive('/credit-transfer/dashboard')
                    ? 'bg-blue-100 text-blue-700'
                    : 'text-slate-600 hover:bg-slate-100'
                }`}
              >
                <Home size={18} className="inline mr-1" />
                Dashboard
              </Link>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {userInfo && (
              <span className="text-sm text-slate-600">
                {userInfo.ho_ten || userInfo.username}
              </span>
            )}
            <button
              onClick={handleLogout}
              className="flex items-center gap-2 px-4 py-2 text-slate-600 hover:text-slate-900 hover:bg-slate-100 rounded-lg transition-colors"
            >
              <LogOut size={18} />
              Đăng xuất
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
};

export default CreditTransferNavbar;

