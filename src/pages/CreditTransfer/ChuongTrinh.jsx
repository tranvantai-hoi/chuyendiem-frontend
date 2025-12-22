import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { chuongTrinhApi, khoaApi } from '../../services/creditTransferApi';
import DataTable from '../../components/CreditTransfer/DataTable';
import Modal from '../../components/CreditTransfer/Modal';
import { AlertCircle } from 'lucide-react';

const ChuongTrinh = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ ma_chuong_trinh: '', ten_chuong_trinh: '', khoa_id: '', mo_ta: '' });
  const [error, setError] = useState('');

  const queryClient = useQueryClient();

  const { data: chuongTrinhList = [] } = useQuery({
    queryKey: ['chuong-trinh'],
    queryFn: chuongTrinhApi.getAll,
  });

  const { data: khoaList = [] } = useQuery({
    queryKey: ['khoa'],
    queryFn: khoaApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: chuongTrinhApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['chuong-trinh']);
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err) => setError(err.message),
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => chuongTrinhApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['chuong-trinh']);
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err) => setError(err.message),
  });

  const deleteMutation = useMutation({
    mutationFn: chuongTrinhApi.delete,
    onSuccess: () => queryClient.invalidateQueries(['chuong-trinh']),
  });

  const resetForm = () => {
    setFormData({ ma_chuong_trinh: '', ten_chuong_trinh: '', khoa_id: '', mo_ta: '' });
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
      ma_chuong_trinh: item.ma_chuong_trinh,
      ten_chuong_trinh: item.ten_chuong_trinh,
      khoa_id: item.khoa_id,
      mo_ta: item.mo_ta || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = (item) => {
    if (window.confirm(`Xóa chương trình "${item.ten_chuong_trinh}"?`)) {
      deleteMutation.mutate(item.id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    const data = { ...formData, khoa_id: parseInt(formData.khoa_id) };
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data });
    } else {
      createMutation.mutate(data);
    }
  };

  const columns = [
    { key: 'ma_chuong_trinh', header: 'Mã chương trình' },
    { key: 'ten_chuong_trinh', header: 'Tên chương trình' },
    { key: 'ten_khoa', header: 'Khoa' },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Quản lý Chương trình</h1>
      
      <DataTable
        data={chuongTrinhList}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        title="Danh sách chương trình"
      />

      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingItem ? 'Chỉnh sửa' : 'Thêm mới'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mã chương trình *</label>
            <input type="text" value={formData.ma_chuong_trinh} onChange={(e) => setFormData({ ...formData, ma_chuong_trinh: e.target.value })} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Tên chương trình *</label>
            <input type="text" value={formData.ten_chuong_trinh} onChange={(e) => setFormData({ ...formData, ten_chuong_trinh: e.target.value })} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Khoa *</label>
            <select value={formData.khoa_id} onChange={(e) => setFormData({ ...formData, khoa_id: e.target.value })} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none">
              <option value="">Chọn khoa</option>
              {khoaList.map(k => <option key={k.id} value={k.id}>{k.ten_khoa}</option>)}
            </select>
          </div>
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label>
            <textarea value={formData.mo_ta} onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" />
          </div>
          <div className="flex justify-end gap-3 pt-4">
            <button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 border rounded-lg">Hủy</button>
            <button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Lưu</button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default ChuongTrinh;

