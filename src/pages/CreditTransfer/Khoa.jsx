import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { khoaApi } from '../../services/creditTransferApi';
import DataTable from '../../components/CreditTransfer/DataTable';
import Modal from '../../components/CreditTransfer/Modal';
import { AlertCircle } from 'lucide-react';

const Khoa = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ ma_khoa: '', ten_khoa: '', mo_ta: '' });
  const [error, setError] = useState('');

  const queryClient = useQueryClient();

  const { data: khoaList = [], isLoading } = useQuery({
    queryKey: ['khoa'],
    queryFn: khoaApi.getAll,
  });

  const createMutation = useMutation({
    mutationFn: khoaApi.create,
    onSuccess: () => {
      queryClient.invalidateQueries(['khoa']);
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const updateMutation = useMutation({
    mutationFn: ({ id, data }) => khoaApi.update(id, data),
    onSuccess: () => {
      queryClient.invalidateQueries(['khoa']);
      setIsModalOpen(false);
      resetForm();
    },
    onError: (err) => {
      setError(err.message);
    },
  });

  const deleteMutation = useMutation({
    mutationFn: khoaApi.delete,
    onSuccess: () => {
      queryClient.invalidateQueries(['khoa']);
    },
  });

  const resetForm = () => {
    setFormData({ ma_khoa: '', ten_khoa: '', mo_ta: '' });
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
      ma_khoa: item.ma_khoa,
      ten_khoa: item.ten_khoa,
      mo_ta: item.mo_ta || '',
    });
    setIsModalOpen(true);
  };

  const handleDelete = async (item) => {
    if (window.confirm(`Bạn có chắc chắn muốn xóa khoa "${item.ten_khoa}"?`)) {
      deleteMutation.mutate(item.id);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    setError('');
    if (editingItem) {
      updateMutation.mutate({ id: editingItem.id, data: formData });
    } else {
      createMutation.mutate(formData);
    }
  };

  const columns = [
    { key: 'ma_khoa', header: 'Mã khoa' },
    { key: 'ten_khoa', header: 'Tên khoa' },
    { key: 'mo_ta', header: 'Mô tả' },
  ];

  if (isLoading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6">
        <h1 className="text-3xl font-bold text-slate-900">Quản lý Khoa</h1>
      </div>

      <DataTable
        data={khoaList}
        columns={columns}
        onEdit={handleEdit}
        onDelete={handleDelete}
        onCreate={handleCreate}
        title="Danh sách khoa"
      />

      <Modal
        isOpen={isModalOpen}
        onClose={() => {
          setIsModalOpen(false);
          resetForm();
        }}
        title={editingItem ? 'Chỉnh sửa khoa' : 'Thêm khoa mới'}
      >
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && (
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600">
              <AlertCircle size={16} />
              <span className="text-sm">{error}</span>
            </div>
          )}

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mã khoa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.ma_khoa}
              onChange={(e) => setFormData({ ...formData, ma_khoa: e.target.value })}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Tên khoa <span className="text-red-500">*</span>
            </label>
            <input
              type="text"
              value={formData.ten_khoa}
              onChange={(e) => setFormData({ ...formData, ten_khoa: e.target.value })}
              required
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-700 mb-1">
              Mô tả
            </label>
            <textarea
              value={formData.mo_ta}
              onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })}
              rows={3}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            />
          </div>

          <div className="flex justify-end gap-3 pt-4">
            <button
              type="button"
              onClick={() => {
                setIsModalOpen(false);
                resetForm();
              }}
              className="px-4 py-2 border border-slate-300 rounded-lg text-slate-700 hover:bg-slate-50"
            >
              Hủy
            </button>
            <button
              type="submit"
              disabled={createMutation.isPending || updateMutation.isPending}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg disabled:opacity-50"
            >
              {createMutation.isPending || updateMutation.isPending
                ? 'Đang lưu...'
                : editingItem
                ? 'Cập nhật'
                : 'Thêm mới'}
            </button>
          </div>
        </form>
      </Modal>
    </div>
  );
};

export default Khoa;

