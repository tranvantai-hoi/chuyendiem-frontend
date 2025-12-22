import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { sinhVienApi, lopApi, chuongTrinhApi } from '../../services/creditTransferApi';
import DataTable from '../../components/CreditTransfer/DataTable';
import Modal from '../../components/CreditTransfer/Modal';
import { AlertCircle } from 'lucide-react';

const SinhVien = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ ma_sinh_vien: '', ho_ten: '', email: '', so_dien_thoai: '', lop_id: '', chuong_trinh_id: '', ngay_sinh: '', gioi_tinh: '', dia_chi: '' });
  const [error, setError] = useState('');

  const queryClient = useQueryClient();
  const { data: sinhVienList = [] } = useQuery({ queryKey: ['sinh-vien'], queryFn: sinhVienApi.getAll });
  const { data: lopList = [] } = useQuery({ queryKey: ['lop'], queryFn: lopApi.getAll });
  const { data: chuongTrinhList = [] } = useQuery({ queryKey: ['chuong-trinh'], queryFn: chuongTrinhApi.getAll });

  const createMutation = useMutation({ mutationFn: sinhVienApi.create, onSuccess: () => { queryClient.invalidateQueries(['sinh-vien']); setIsModalOpen(false); resetForm(); }, onError: (err) => setError(err.message) });
  const updateMutation = useMutation({ mutationFn: ({ id, data }) => sinhVienApi.update(id, data), onSuccess: () => { queryClient.invalidateQueries(['sinh-vien']); setIsModalOpen(false); resetForm(); }, onError: (err) => setError(err.message) });
  const deleteMutation = useMutation({ mutationFn: sinhVienApi.delete, onSuccess: () => queryClient.invalidateQueries(['sinh-vien']) });

  const resetForm = () => { setFormData({ ma_sinh_vien: '', ho_ten: '', email: '', so_dien_thoai: '', lop_id: '', chuong_trinh_id: '', ngay_sinh: '', gioi_tinh: '', dia_chi: '' }); setEditingItem(null); setError(''); };

  const handleCreate = () => { resetForm(); setIsModalOpen(true); };
  const handleEdit = (item) => { setEditingItem(item); setFormData({ ma_sinh_vien: item.ma_sinh_vien, ho_ten: item.ho_ten, email: item.email || '', so_dien_thoai: item.so_dien_thoai || '', lop_id: item.lop_id || '', chuong_trinh_id: item.chuong_trinh_id || '', ngay_sinh: item.ngay_sinh ? item.ngay_sinh.split('T')[0] : '', gioi_tinh: item.gioi_tinh || '', dia_chi: item.dia_chi || '' }); setIsModalOpen(true); };
  const handleDelete = (item) => { if (window.confirm(`Xóa sinh viên "${item.ho_ten}"?`)) deleteMutation.mutate(item.id); };
  const handleSubmit = (e) => { e.preventDefault(); setError(''); const data = { ...formData, lop_id: formData.lop_id ? parseInt(formData.lop_id) : null, chuong_trinh_id: formData.chuong_trinh_id ? parseInt(formData.chuong_trinh_id) : null }; if (editingItem) updateMutation.mutate({ id: editingItem.id, data }); else createMutation.mutate(data); };

  const columns = [
    { key: 'ma_sinh_vien', header: 'Mã SV' },
    { key: 'ho_ten', header: 'Họ tên' },
    { key: 'ma_lop', header: 'Lớp' },
    { key: 'ten_chuong_trinh', header: 'Chương trình' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Quản lý Sinh viên</h1>
      <DataTable data={sinhVienList} columns={columns} onEdit={handleEdit} onDelete={handleDelete} onCreate={handleCreate} title="Danh sách sinh viên" />
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingItem ? 'Chỉnh sửa' : 'Thêm mới'} size="lg">
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600"><AlertCircle size={16} /><span className="text-sm">{error}</span></div>}
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Mã SV *</label><input type="text" value={formData.ma_sinh_vien} onChange={(e) => setFormData({ ...formData, ma_sinh_vien: e.target.value })} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Họ tên *</label><input type="text" value={formData.ho_ten} onChange={(e) => setFormData({ ...formData, ho_ten: e.target.value })} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Email</label><input type="email" value={formData.email} onChange={(e) => setFormData({ ...formData, email: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">SĐT</label><input type="text" value={formData.so_dien_thoai} onChange={(e) => setFormData({ ...formData, so_dien_thoai: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Lớp</label><select value={formData.lop_id} onChange={(e) => setFormData({ ...formData, lop_id: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"><option value="">Chọn lớp</option>{lopList.map(l => <option key={l.id} value={l.id}>{l.ma_lop} - {l.ten_lop}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Chương trình</label><select value={formData.chuong_trinh_id} onChange={(e) => setFormData({ ...formData, chuong_trinh_id: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"><option value="">Chọn CT</option>{chuongTrinhList.map(ct => <option key={ct.id} value={ct.id}>{ct.ma_chuong_trinh} - {ct.ten_chuong_trinh}</option>)}</select></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Ngày sinh</label><input type="date" value={formData.ngay_sinh} onChange={(e) => setFormData({ ...formData, ngay_sinh: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Giới tính</label><select value={formData.gioi_tinh} onChange={(e) => setFormData({ ...formData, gioi_tinh: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"><option value="">Chọn</option><option value="Nam">Nam</option><option value="Nữ">Nữ</option></select></div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Địa chỉ</label><textarea value={formData.dia_chi} onChange={(e) => setFormData({ ...formData, dia_chi: e.target.value })} rows={2} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 border rounded-lg">Hủy</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Lưu</button></div>
        </form>
      </Modal>
    </div>
  );
};

export default SinhVien;

