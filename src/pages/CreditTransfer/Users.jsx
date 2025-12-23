import { useState, useEffect } from 'react';
import { 
  Users as UsersIcon, Plus, Search, Edit2, Trash2, 
  Shield, CheckCircle, XCircle, Key, Mail, Building 
} from 'lucide-react';
import { usersApi, khoaApi } from '../../services/creditTransferApi';

const Users = () => {
  const [users, setUsers] = useState([]);
  const [khoas, setKhoas] = useState([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  
  // State cho Modal
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  
  // Form Data
  const [formData, setFormData] = useState({
    username: '',
    password: '',
    ho_ten: '',
    email: '',
    vai_tro: 'user',
    khoa_id: '',
    is_active: true
  });
  const [error, setError] = useState('');

  // 1. Fetch dữ liệu ban đầu
  const fetchData = async () => {
    try {
      setLoading(true);
      const [usersData, khoasData] = await Promise.all([
        usersApi.getAll(),
        khoaApi.getAll() // Lấy danh sách khoa để fill dropdown
      ]);
      setUsers(usersData);
      setKhoas(khoasData);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  // 2. Xử lý mở Modal
  const handleOpenModal = (user = null) => {
    setError('');
    if (user) {
      setIsEditMode(true);
      setCurrentUser(user);
      setFormData({
        username: user.username,
        password: '', // Để trống khi edit nghĩa là không đổi pass
        ho_ten: user.ho_ten,
        email: user.email || '',
        vai_tro: user.vai_tro,
        khoa_id: user.khoa_id || '', // Backend trả về khoa_id nếu có
        is_active: user.is_active
      });
    } else {
      setIsEditMode(false);
      setCurrentUser(null);
      setFormData({
        username: '',
        password: '',
        ho_ten: '',
        email: '',
        vai_tro: 'user',
        khoa_id: '',
        is_active: true
      });
    }
    setIsModalOpen(true);
  };

  // 3. Xử lý Submit Form (Tạo/Sửa)
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    try {
      // Validate cơ bản
      if (!formData.username || !formData.ho_ten) {
        setError('Vui lòng nhập Username và Họ tên');
        return;
      }
      if (!isEditMode && !formData.password) {
        setError('Vui lòng nhập mật khẩu cho tài khoản mới');
        return;
      }

      // Chuẩn bị payload (chuyển đổi khoa_id sang null nếu rỗng)
      const payload = {
        ...formData,
        khoa_id: formData.khoa_id ? parseInt(formData.khoa_id) : null
      };

      if (isEditMode) {
        await usersApi.update(currentUser.id, payload);
      } else {
        await usersApi.create(payload);
      }

      setIsModalOpen(false);
      fetchData(); // Reload lại bảng
    } catch (err) {
      setError(err.message || 'Có lỗi xảy ra khi lưu dữ liệu');
    }
  };

  // 4. Xử lý Xóa
  const handleDelete = async (id) => {
    if (window.confirm('Bạn có chắc chắn muốn xóa người dùng này?')) {
      try {
        await usersApi.delete(id);
        fetchData();
      } catch (err) {
        alert(err.message || 'Không thể xóa user này');
      }
    }
  };

  // Filter tìm kiếm
  const filteredUsers = users.filter(u => 
    u.ho_ten.toLowerCase().includes(searchTerm.toLowerCase()) ||
    u.username.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 flex items-center gap-2">
            <UsersIcon className="text-blue-600" />
            Quản lý Người dùng
          </h1>
          <p className="text-slate-500 mt-1">Quản lý tài khoản, phân quyền và trạng thái hoạt động.</p>
        </div>
        <button 
          onClick={() => handleOpenModal()}
          className="btn-primary flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-lg transition-colors shadow-md"
        >
          <Plus size={18} /> Thêm người dùng
        </button>
      </div>

      {/* Toolbar */}
      <div className="bg-white p-4 rounded-xl shadow-sm border border-slate-200 mb-6 flex items-center gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Tìm kiếm theo tên hoặc username..." 
            className="w-full pl-10 pr-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />
        </div>
      </div>

      {/* Table */}
      <div className="bg-white rounded-xl shadow-sm border border-slate-200 overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-slate-50 border-b border-slate-200">
              <tr>
                <th className="px-6 py-4 font-semibold text-slate-700">Người dùng</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Vai trò</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Đơn vị (Khoa)</th>
                <th className="px-6 py-4 font-semibold text-slate-700">Trạng thái</th>
                <th className="px-6 py-4 font-semibold text-slate-700 text-right">Thao tác</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-100">
              {loading ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Đang tải dữ liệu...</td></tr>
              ) : filteredUsers.length === 0 ? (
                <tr><td colSpan="5" className="px-6 py-8 text-center text-slate-500">Không tìm thấy người dùng nào.</td></tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className="hover:bg-slate-50 transition-colors">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold uppercase">
                          {user.username.substring(0,2)}
                        </div>
                        <div>
                          <div className="font-medium text-slate-900">{user.ho_ten}</div>
                          <div className="text-slate-500 text-xs">@{user.username}</div>
                          <div className="text-slate-400 text-xs">{user.email}</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize
                        ${user.vai_tro === 'admin' ? 'bg-red-100 text-red-800' : 
                          user.vai_tro === 'staff' ? 'bg-blue-100 text-blue-800' : 
                          'bg-slate-100 text-slate-800'}`}>
                        {user.vai_tro}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-slate-600">
                      {user.ten_khoa || <span className="text-slate-400 italic">-- Hệ thống --</span>}
                    </td>
                    <td className="px-6 py-4">
                      {user.is_active ? (
                        <span className="flex items-center gap-1.5 text-green-600 text-xs font-medium bg-green-50 px-2 py-1 rounded-md w-fit">
                          <CheckCircle size={14} /> Hoạt động
                        </span>
                      ) : (
                        <span className="flex items-center gap-1.5 text-slate-500 text-xs font-medium bg-slate-100 px-2 py-1 rounded-md w-fit">
                          <XCircle size={14} /> Đã khóa
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-2">
                        <button 
                          onClick={() => handleOpenModal(user)}
                          className="p-2 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors"
                          title="Sửa"
                        >
                          <Edit2 size={18} />
                        </button>
                        <button 
                          onClick={() => handleDelete(user.id)}
                          className="p-2 text-red-600 hover:bg-red-50 rounded-lg transition-colors"
                          title="Xóa"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* MODAL FORM */}
      {isModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-fade-in">
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-2xl max-h-[90vh] overflow-y-auto">
            <div className="p-6 border-b border-slate-100 flex justify-between items-center">
              <h2 className="text-xl font-bold text-slate-800">
                {isEditMode ? 'Cập nhật Người dùng' : 'Thêm mới Người dùng'}
              </h2>
              <button onClick={() => setIsModalOpen(false)} className="text-slate-400 hover:text-slate-600">
                <XCircle size={24} />
              </button>
            </div>
            
            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              {error && (
                <div className="p-3 bg-red-50 text-red-600 text-sm rounded-lg flex items-center gap-2">
                  <XCircle size={16} /> {error}
                </div>
              )}

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* Username */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Tên đăng nhập <span className="text-red-500">*</span></label>
                  <div className="relative">
                    <Shield className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input 
                      type="text" 
                      value={formData.username}
                      onChange={(e) => setFormData({...formData, username: e.target.value})}
                      className="w-full pl-10 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="vd: admin"
                      disabled={isEditMode} // Không cho sửa username
                    />
                  </div>
                </div>

                {/* Password */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">
                    Mật khẩu {isEditMode ? '(Để trống nếu không đổi)' : <span className="text-red-500">*</span>}
                  </label>
                  <div className="relative">
                    <Key className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input 
                      type="password" 
                      value={formData.password}
                      onChange={(e) => setFormData({...formData, password: e.target.value})}
                      className="w-full pl-10 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="••••••"
                    />
                  </div>
                </div>

                {/* Họ tên */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Họ và tên <span className="text-red-500">*</span></label>
                  <input 
                    type="text" 
                    value={formData.ho_ten}
                    onChange={(e) => setFormData({...formData, ho_ten: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                    placeholder="vd: Nguyễn Văn A"
                  />
                </div>

                {/* Email */}
                <div className="md:col-span-2">
                  <label className="block text-sm font-medium text-slate-700 mb-1">Email</label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <input 
                      type="email" 
                      value={formData.email}
                      onChange={(e) => setFormData({...formData, email: e.target.value})}
                      className="w-full pl-10 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
                      placeholder="example@domain.com"
                    />
                  </div>
                </div>

                {/* Vai trò */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Vai trò</label>
                  <select 
                    value={formData.vai_tro}
                    onChange={(e) => setFormData({...formData, vai_tro: e.target.value})}
                    className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                  >
                    <option value="user">User (Sinh viên/GV)</option>
                    <option value="staff">Staff (Giáo vụ)</option>
                    <option value="admin">Admin (Quản trị)</option>
                  </select>
                </div>

                {/* Khoa */}
                <div>
                  <label className="block text-sm font-medium text-slate-700 mb-1">Khoa / Đơn vị</label>
                  <div className="relative">
                    <Building className="absolute left-3 top-2.5 text-slate-400" size={18} />
                    <select 
                      value={formData.khoa_id}
                      onChange={(e) => setFormData({...formData, khoa_id: e.target.value})}
                      className="w-full pl-10 px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none bg-white"
                    >
                      <option value="">-- Chọn Khoa --</option>
                      {khoas.map(khoa => (
                        <option key={khoa.id} value={khoa.id}>{khoa.ten_khoa}</option>
                      ))}
                    </select>
                  </div>
                </div>

                {/* Trạng thái */}
                <div className="md:col-span-2 flex items-center gap-3 mt-2">
                  <input 
                    type="checkbox" 
                    id="isActive"
                    checked={formData.is_active}
                    onChange={(e) => setFormData({...formData, is_active: e.target.checked})}
                    className="w-5 h-5 text-blue-600 border-slate-300 rounded focus:ring-blue-500"
                  />
                  <label htmlFor="isActive" className="text-sm font-medium text-slate-700">
                    Kích hoạt tài khoản này
                  </label>
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-6 border-t border-slate-100">
                <button 
                  type="button"
                  onClick={() => setIsModalOpen(false)}
                  className="px-4 py-2 text-slate-700 bg-slate-100 hover:bg-slate-200 rounded-lg transition-colors font-medium"
                >
                  Hủy bỏ
                </button>
                <button 
                  type="submit"
                  className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors font-medium shadow-md"
                >
                  {isEditMode ? 'Cập nhật' : 'Tạo người dùng'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Users;