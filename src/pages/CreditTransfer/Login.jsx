import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useMutation } from '@tanstack/react-query';
import { login } from '../../services/creditTransferApi'; //
import { 
  LogIn, 
  AlertCircle, 
  Eye, 
  EyeOff, 
  User, 
  Lock, 
  CheckSquare, 
  Square 
} from 'lucide-react';

const CreditTransferLogin = () => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [error, setError] = useState('');
  
  const navigate = useNavigate();

  // Xử lý Ghi nhớ đăng nhập: Lấy username từ localStorage khi component mount
  useEffect(() => {
    const savedUser = localStorage.getItem('saved_username');
    if (savedUser) {
      setUsername(savedUser);
      setRememberMe(true);
    }
  }, []);

  const loginMutation = useMutation({
    mutationFn: login,
    onSuccess: () => {
      // Lưu hoặc Xóa username tùy vào trạng thái Remember Me
      if (rememberMe) {
        localStorage.setItem('saved_username', username);
      } else {
        localStorage.removeItem('saved_username');
      }
      navigate('/credit-transfer/dashboard');
    },
    onError: (err) => {
      setError(err.message || 'Đăng nhập thất bại. Vui lòng kiểm tra lại.');
    },
  });

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (!username.trim() || !password.trim()) {
      setError('Vui lòng nhập đầy đủ thông tin');
      return;
    }
    loginMutation.mutate({ username, password });
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-slate-50 px-4 py-12">
      {/* Background decoration (optional) */}
      <div className="absolute inset-0 bg-gradient-to-br from-blue-50 to-indigo-100 z-0" />
      
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-md relative z-10 overflow-hidden border border-slate-100">
        {/* Decorative Top Bar */}
        <div className="h-2 bg-blue-600 w-full" />

        <div className="p-8">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-full mb-4 ring-8 ring-blue-50/50">
              <LogIn className="w-8 h-8 text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-slate-800 tracking-tight">Chào mừng trở lại</h1>
            <p className="text-slate-500 mt-2 text-sm">Hệ thống Chuyển điểm Đại học</p>
          </div>

          {/* Error Message */}
          {error && (
            <div className="mb-6 p-4 bg-red-50 border-l-4 border-red-500 rounded-r-md flex items-start gap-3 animate-fade-in">
              <AlertCircle className="w-5 h-5 text-red-500 shrink-0 mt-0.5" />
              <div className="flex-1">
                <h3 className="text-sm font-medium text-red-800">Lỗi đăng nhập</h3>
                <p className="text-sm text-red-700 mt-1">{error}</p>
              </div>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-5">
            {/* Username Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 ml-1">
                Tên đăng nhập
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <User className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type="text"
                  value={username}
                  onChange={(e) => setUsername(e.target.value)}
                  required
                  className="w-full pl-10 pr-4 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                  placeholder="Tên đăng nhập / Email"
                />
              </div>
            </div>

            {/* Password Input */}
            <div className="space-y-1.5">
              <label className="block text-sm font-medium text-slate-700 ml-1">
                Mật khẩu
              </label>
              <div className="relative group">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <Lock className="h-5 w-5 text-slate-400 group-focus-within:text-blue-500 transition-colors" />
                </div>
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="w-full pl-10 pr-12 py-2.5 bg-slate-50 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500/20 focus:border-blue-500 focus:bg-white transition-all outline-none text-slate-900 placeholder:text-slate-400"
                  placeholder="Nhập mật khẩu của bạn"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 pr-3 flex items-center text-slate-400 hover:text-slate-600 focus:outline-none"
                >
                  {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                </button>
              </div>
            </div>

            {/* Remember Me & Forgot Password */}
            <div className="flex items-center justify-between pt-2">
              <div 
                className="flex items-center gap-2 cursor-pointer group"
                onClick={() => setRememberMe(!rememberMe)}
              >
                <div className={`text-blue-600 transition-transform ${rememberMe ? 'scale-110' : ''}`}>
                  {rememberMe ? <CheckSquare size={18} /> : <Square size={18} className="text-slate-300" />}
                </div>
                <span className="text-sm text-slate-600 select-none group-hover:text-slate-800">
                  Ghi nhớ đăng nhập
                </span>
              </div>
              
              <a href="#" className="text-sm font-medium text-blue-600 hover:text-blue-700 hover:underline">
                Quên mật khẩu?
              </a>
            </div>

            {/* Submit Button */}
            <button
              type="submit"
              disabled={loginMutation.isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white font-semibold py-3 px-4 rounded-lg shadow-md hover:shadow-lg transition-all transform active:scale-[0.98] disabled:opacity-70 disabled:cursor-not-allowed disabled:shadow-none mt-6 flex items-center justify-center gap-2"
            >
              {loginMutation.isPending ? (
                <>
                  <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                  <span>Đang xử lý...</span>
                </>
              ) : (
                <>
                  <span>Đăng nhập</span>
                  <LogIn size={18} className="opacity-80" />
                </>
              )}
            </button>
          </form>
        </div>
        
        {/* Footer */}
        <div className="px-8 py-4 bg-slate-50 border-t border-slate-100 text-center">
          <p className="text-xs text-slate-500">
            © 2025 Hệ thống chuyển điểm. <br/>Vui lòng liên hệ phòng đào tạo nếu gặp sự cố.
          </p>
        </div>
      </div>
    </div>
  );
};

export default CreditTransferLogin;