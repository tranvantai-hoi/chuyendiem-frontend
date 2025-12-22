import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { hocPhanApi } from '../../services/creditTransferApi';
import DataTable from '../../components/CreditTransfer/DataTable';
import Modal from '../../components/CreditTransfer/Modal';
import { AlertCircle } from 'lucide-react';

const HocPhan = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ ma_hoc_phan: '', ten_hoc_phan: '', so_tin_chi: '', mo_ta: '' });
  const [error, setError] = useState('');

  const queryClient = useQueryClient();

  const { data: hocPhanList = [] } = useQuery({
    queryKey: ['hoc-phan'],
    queryFn: hocPhanApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: hocPhanApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['hoc-phan']);
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err) => setError(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => hocPhanApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['hoc-phan']);
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err) => setError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: hocPhanApi.delete,
    onSuccess: () => queryClient.invalidateQueries(['hoc-phan']),
  });

  const resetForm = () => {
    setFormData({ ma_hoc_phan: '', ten_hoc_phan: '', so_tin_chi: '', mo_ta: '' });
    setEditingItem(null);
    setError('');
  };

  const handleCreate = () => {
    resetForm();
    setIsModalOpen(true);
  };

  const handleEdit = (item) => {
    setEditingItem(item);
    setFormData({
      ma_hoc_phan: item.ma_hoc_phan,
      ten_hoc_phan: item.ten_hoc_phan,
      so_tin_chi: item.so_tin_chi,
      mo_ta: item.mo_ta || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Xóa học phần "${item.ten_hoc_phan}"?`)) {
      deleteMutation.mutate(item.id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const data = { ...formData, so_tin_chi: parseInt(formData.so_tin_chi) };
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const columns = [
    { key: 'ma_hoc_phan', header: 'Mã học phần' },
    { key: 'ten_hoc_phan', header: 'Tên học phần' },
    { key: 'so_tin_chi', header: 'Số tín chỉ' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Quản lý Học phần</h1>
      <DataTable data={hocPhanList} columns={columns} onEdit={handleEdit} onDelete={handleDelete} onCreate={handleCreate} title="Danh sách học phần" />
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingItem ? 'Chỉnh sửa' : 'Thêm mới'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600"><AlertCircle size={16} /><span className="text-sm">{error}</span></div>}
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Mã học phần *</label><input type="text" value={formData.ma_hoc_phan} onChange={(e) => setFormData({ ...formData, ma_hoc_phan: e.target.value })} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Tên học phần *</label><input type="text" value={formData.ten_hoc_phan} onChange={(e) => setFormData({ ...formData, ten_hoc_phan: e.target.value })} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Số tín chỉ *</label><input type="number" value={formData.so_tin_chi} onChange={(e) => setFormData({ ...formData, so_tin_chi: e.target.value })} required min="1" className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label><textarea value={formData.mo_ta} onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 border rounded-lg">Hủy</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Lưu</button></div>
        </form>
      </Modal>
    </div>
  );
};

export default HocPhan;

