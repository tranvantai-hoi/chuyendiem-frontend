import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { lopApi, chuongTrinhApi, khoaApi } from '../../services/creditTransferApi';
import DataTable from '../../components/CreditTransfer/DataTable';
import Modal from '../../components/CreditTransfer/Modal';
import { AlertCircle } from 'lucide-react';

const Lop = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ ma_lop: '', ten_lop: '', chuong_trinh_id: '', khoa_id: '', khoa_hoc: '' });
  const [error, setError] = useState('');

  const queryClient = useQueryClient();
  const { data: lopList = [] } = useQuery({ queryKey: ['lop'], queryFn: lopApi.getAll });
  const { data: chuongTrinhList = [] } = useQuery({ queryKey: ['chuong-trinh'], queryFn: chuongTrinhApi.getAll });
  const { data: khoaList = [] } = useQuery({ queryKey: ['khoa'], queryFn: khoaApi.getAll });

  const createMutation = useMutation({ mutationFn: lopApi.create, onSuccess: () => { queryClient.invalidateQueries(['lop']); setIsModalOpen(false); resetForm(); }, onError: (err) => setError(err.message) });
  const updateMutation = useMutation({ mutationFn: ({ id, data }) => lopApi.update(id, data), onSuccess: () => { queryClient.invalidateQueries(['lop']); setIsModalOpen(false); resetForm(); }, onError: (err) => setError(err.message) });
  const deleteMutation = useMutation({ mutationFn: lopApi.delete, onSuccess: () => queryClient.invalidateQueries(['lop']) });

  const resetForm = () => { setFormData({ ma_lop: '', ten_lop: '', chuong_trinh_id: '', khoa_id: '', khoa_hoc: '' }); setEditingItem(null); setError(''); };

  const handleCreate = () => { resetForm(); setIsModalOpen(true); };
  const handleEdit = (item) => { setEditingItem(item); setFormData({ ma_lop: item.ma_lop, ten_lop: item.ten_lop, chuong_trinh_id: item.chuong_trinh_id || '', khoa_id: item.khoa_id || '', khoa_hoc: item.khoa_hoc || '' }); setIsModalOpen(true); };
  const handleDelete = (item) => { if (window.confirm(`Xóa lớp "${item.ten_lop}"?`)) deleteMutation.mutate(item.id); };
  const handleSubmit = (e) => { e.preventDefault(); setError(''); const data = { ...formData, chuong_trinh_id: parseInt(formData.chuong_trinh_id), khoa_id: parseInt(formData.khoa_id) }; if (editingItem) updateMutation.mutate({ id: editingItem.id, data }); else createMutation.mutate(data); };

  const columns = [
    { key: 'ma_lop', header: 'Mã lớp' },
    { key: 'ten_lop', header: 'Tên lớp' },
    { key: 'ten_chuong_trinh', header: 'Chương trình' },
    { key: 'ten_khoa', header: 'Khoa' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Quản lý Lớp</h1>
      <DataTable data={lopList} columns={columns} onEdit={handleEdit} onDelete={handleDelete} onCreate={handleCreate} title="Danh sách lớp" />
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingItem ? 'Chỉnh sửa' : 'Thêm mới'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600"><AlertCircle size={16} /><span className="text-sm">{error}</span></div>}
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Mã lớp *</label><input type="text" value={formData.ma_lop} onChange={(e) => setFormData({ ...formData, ma_lop: e.target.value })} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Tên lớp *</label><input type="text" value={formData.ten_lop} onChange={(e) => setFormData({ ...formData, ten_lop: e.target.value })} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Chương trình *</label><select value={formData.chuong_trinh_id} onChange={(e) => setFormData({ ...formData, chuong_trinh_id: e.target.value })} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"><option value="">Chọn CT</option>{chuongTrinhList.map(ct => <option key={ct.id} value={ct.id}>{ct.ma_chuong_trinh} - {ct.ten_chuong_trinh}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Khoa *</label><select value={formData.khoa_id} onChange={(e) => setFormData({ ...formData, khoa_id: e.target.value })} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"><option value="">Chọn khoa</option>{khoaList.map(k => <option key={k.id} value={k.id}>{k.ten_khoa}</option>)}</select></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Khóa học</label><input type="text" value={formData.khoa_hoc} onChange={(e) => setFormData({ ...formData, khoa_hoc: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 border rounded-lg">Hủy</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Lưu</button></div>
        </form>
      </Modal>
    </div>
  );
};

export default Lop;

