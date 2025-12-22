import { Link } from 'react-router-dom';
import { 
  Building2, BookOpen, Users, GraduationCap, 
  FileText, Calendar, Database, Upload, Download 
} from 'lucide-react';

const Dashboard = () => {
  const menuItems = [
    { icon: Building2, label: 'Quản lý Khoa', path: '/credit-transfer/khoa', color: 'bg-blue-500' },
    { icon: GraduationCap, label: 'Quản lý Chương trình', path: '/credit-transfer/chuong-trinh', color: 'bg-green-500' },
    { icon: BookOpen, label: 'Quản lý Học phần', path: '/credit-transfer/hoc-phan', color: 'bg-purple-500' },
    { icon: Users, label: 'Quản lý Lớp', path: '/credit-transfer/lop', color: 'bg-orange-500' },
    { icon: Users, label: 'Quản lý Sinh viên', path: '/credit-transfer/sinh-vien', color: 'bg-pink-500' },
    { icon: Calendar, label: 'Quản lý Đợt xét', path: '/credit-transfer/dot-xet', color: 'bg-indigo-500' },
    { icon: FileText, label: 'Chuyển điểm', path: '/credit-transfer/chuyen-diem', color: 'bg-red-500' },
    { icon: Upload, label: 'Import Excel', path: '/credit-transfer/import', color: 'bg-teal-500' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-8">
        <h1 className="text-3xl font-bold text-slate-900 mb-2">Dashboard - Hệ thống chuyển điểm</h1>
        <p className="text-slate-600">Quản lý và theo dõi quá trình chuyển điểm</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {menuItems.map((item, index) => {
          const Icon = item.icon;
          return (
            <Link
              key={index}
              to={item.path}
              className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow p-6 flex items-center gap-4 border border-slate-100 hover:border-blue-300"
            >
              <div className={`${item.color} p-3 rounded-lg text-white`}>
                <Icon size={24} />
              </div>
              <div>
                <h3 className="font-semibold text-slate-900">{item.label}</h3>
              </div>
            </Link>
          );
        })}
      </div>
    </div>
  );
};

export default Dashboard;

