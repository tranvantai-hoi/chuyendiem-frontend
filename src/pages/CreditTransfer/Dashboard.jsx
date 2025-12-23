import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, BookOpen, Users, GraduationCap, 
  FileText, Shield, Settings, 
  ArrowRight, Activity
} from 'lucide-react';

const Dashboard = () => {
  const [user, setUser] = useState({ ho_ten: 'Người dùng', vai_tro: 'user' });

  useEffect(() => {
    try {
      const storedUser = localStorage.getItem('user_info');
      if (storedUser) {
        setUser(JSON.parse(storedUser));
      }
    } catch (error) {
      console.error('Lỗi khi đọc thông tin user:', error);
    }
  }, []);

  const features = [
    // --- ADMIN ONLY ---
    { 
      title: 'Quản lý Người dùng', 
      desc: 'Tạo tài khoản, phân quyền Admin/Staff',
      icon: Shield, 
      path: '/credit-transfer/users', 
      color: 'bg-indigo-600',
      roles: ['admin'] 
    },
    { 
      title: 'Quản lý Khoa', 
      desc: 'Danh sách các Khoa/Viện đào tạo',
      icon: Building2, 
      path: '/credit-transfer/khoa', 
      color: 'bg-blue-600',
      roles: ['admin'] 
    },
    { 
      title: 'Chương trình đào tạo', 
      desc: 'Thiết lập khung chương trình học',
      icon: GraduationCap, 
      path: '/credit-transfer/chuong-trinh', 
      color: 'bg-emerald-600',
      roles: ['admin'] 
    },
    { 
      title: 'Quản lý Học phần', 
      desc: 'Ngân hàng môn học và tín chỉ',
      icon: BookOpen, 
      path: '/credit-transfer/hoc-phan', 
      color: 'bg-violet-600',
      roles: ['admin'] 
    },

    // --- ADMIN + STAFF ---
    { 
      title: 'Quản lý Lớp', 
      desc: 'Danh sách lớp hành chính',
      icon: Users, 
      path: '/credit-transfer/lop', 
      color: 'bg-orange-500',
      roles: ['admin', 'staff'] 
    },
    { 
      title: 'Quản lý Sinh viên', 
      desc: 'Hồ sơ sinh viên và thông tin liên lạc',
      icon: Users, 
      path: '/credit-transfer/sinh-vien', 
      color: 'bg-pink-500',
      roles: ['admin', 'staff'] 
    },
    { 
      title: 'Thực hiện Chuyển điểm', 
      desc: 'Xét duyệt và xử lý kết quả chuyển điểm',
      icon: FileText, 
      // SỬA: Trỏ thẳng vào trang Detail (không qua trang DotXet nữa)
      path: '/credit-transfer/chuyen-diem', 
      color: 'bg-red-500',
      roles: ['admin', 'staff'],
      highlight: true 
    },
  ];

  const visibleFeatures = features.filter(item => item.roles.includes(user.vai_tro));

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Banner giữ nguyên như cũ */}
      <div className="bg-gradient-to-r from-blue-700 to-indigo-800 rounded-2xl p-8 mb-10 text-white shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-4 opacity-10">
          <Activity size={150} />
        </div>
        <div className="relative z-10">
          <h1 className="text-3xl font-bold mb-2">Xin chào, {user.ho_ten}!</h1>
          <p className="text-blue-100 text-lg opacity-90">
            Bạn đang đăng nhập với vai trò: <span className="font-semibold uppercase text-yellow-300">{user.vai_tro}</span>
          </p>
        </div>
      </div>

      {/* Grid Menu */}
      <div>
        <div className="flex items-center gap-2 mb-6">
          <Settings className="text-slate-400" size={20} />
          <h2 className="text-xl font-bold text-slate-800 uppercase tracking-wide">Danh sách chức năng</h2>
          <div className="h-px bg-slate-200 flex-1 ml-4"></div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {visibleFeatures.map((item, index) => {
            const Icon = item.icon;
            return (
              <Link
                key={index}
                to={item.path}
                className={`
                  group relative bg-white rounded-xl p-6 border border-slate-100 shadow-sm 
                  hover:shadow-xl hover:-translate-y-1 transition-all duration-300
                  ${item.highlight ? 'ring-2 ring-red-100 hover:ring-red-200' : ''}
                `}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className={`${item.color} p-3 rounded-lg text-white shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <Icon size={24} />
                  </div>
                  <div className="bg-slate-50 p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity text-slate-400">
                    <ArrowRight size={16} />
                  </div>
                </div>
                <h3 className="text-lg font-bold text-slate-800 mb-2 group-hover:text-blue-700 transition-colors">
                  {item.title}
                </h3>
                <p className="text-slate-500 text-sm leading-relaxed">
                  {item.desc}
                </p>
                <div className={`absolute bottom-0 left-0 h-1 w-0 group-hover:w-full transition-all duration-500 rounded-b-xl ${item.color.replace('bg-', 'bg-')}`} />
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
};

export default Dashboard;