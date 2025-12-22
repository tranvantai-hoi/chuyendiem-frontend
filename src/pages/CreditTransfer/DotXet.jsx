import { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { dotXetApi } from '../../services/creditTransferApi';
import DataTable from '../../components/CreditTransfer/DataTable';
import Modal from '../../components/CreditTransfer/Modal';
import { Link } from 'react-router-dom';
import { AlertCircle, Eye } from 'lucide-react';

const DotXet = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [editingItem, setEditingItem] = useState(null);
  const [formData, setFormData] = useState({ ten_dot: '', nam_hoc: '', hoc_ky: '', ngay_bat_dau: '', ngay_ket_thuc: '', trang_thai: 'draft', mo_ta: '' });
  const [error, setError] = useState('');

  const queryClient = useQueryClient();
  const { data: dotXetList = [] } = useQuery({ queryKey: ['dot-xet'], queryFn: dotXetApi.getAll });

  const createMutation = useMutation({ mutationFn: dotXetApi.create, onSuccess: () => { queryClient.invalidateQueries(['dot-xet']); setIsModalOpen(false); resetForm(); }, onError: (err) => setError(err.message) });
  const updateMutation = useMutation({ mutationFn: ({ id, data }) => dotXetApi.update(id, data), onSuccess: () => { queryClient.invalidateQueries(['dot-xet']); setIsModalOpen(false); resetForm(); }, onError: (err) => setError(err.message) });
  const deleteMutation = useMutation({ mutationFn: dotXetApi.delete, onSuccess: () => queryClient.invalidateQueries(['dot-xet']) });

  const resetForm = () => { setFormData({ ten_dot: '', nam_hoc: '', hoc_ky: '', ngay_bat_dau: '', ngay_ket_thuc: '', trang_thai: 'draft', mo_ta: '' }); setEditingItem(null); setError(''); };

  const handleCreate = () => { resetForm(); setIsModalOpen(true); };
  const handleEdit = (item) => { setEditingItem(item); setFormData({ ten_dot: item.ten_dot, nam_hoc: item.nam_hoc || '', hoc_ky: item.hoc_ky || '', ngay_bat_dau: item.ngay_bat_dau ? item.ngay_bat_dau.split('T')[0] : '', ngay_ket_thuc: item.ngay_ket_thuc ? item.ngay_ket_thuc.split('T')[0] : '', trang_thai: item.trang_thai, mo_ta: item.mo_ta || '' }); setIsModalOpen(true); };
  const handleDelete = (item) => { if (window.confirm(`Xóa đợt xét "${item.ten_dot}"?`)) deleteMutation.mutate(item.id); };
  const handleSubmit = (e) => { e.preventDefault(); setError(''); if (editingItem) updateMutation.mutate({ id: editingItem.id, data: formData }); else createMutation.mutate(formData); };

  const columns = [
    { key: 'ten_dot', header: 'Tên đợt' },
    { key: 'nam_hoc', header: 'Năm học' },
    { key: 'hoc_ky', header: 'Học kỳ' },
    { key: 'trang_thai', header: 'Trạng thái', render: (row) => <span className={`px-2 py-1 rounded text-xs ${row.trang_thai === 'open' ? 'bg-green-100 text-green-800' : row.trang_thai === 'closed' ? 'bg-gray-100 text-gray-800' : 'bg-yellow-100 text-yellow-800'}`}>{row.trang_thai}</span> },
    { header: 'Xem chi tiết', render: (row) => <Link to={`/credit-transfer/chuyen-diem/${row.id}`} className="text-blue-600 hover:text-blue-800"><Eye size={18} /></Link> },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Quản lý Đợt xét</h1>
      <DataTable data={dotXetList} columns={columns} onEdit={handleEdit} onDelete={handleDelete} onCreate={handleCreate} title="Danh sách đợt xét" />
      <Modal isOpen={isModalOpen} onClose={() => { setIsModalOpen(false); resetForm(); }} title={editingItem ? 'Chỉnh sửa' : 'Thêm mới'}>
        <form onSubmit={handleSubmit} className="space-y-4">
          {error && <div className="p-3 bg-red-50 border border-red-200 rounded-lg flex items-center gap-2 text-red-600"><AlertCircle size={16} /><span className="text-sm">{error}</span></div>}
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Tên đợt *</label><input type="text" value={formData.ten_dot} onChange={(e) => setFormData({ ...formData, ten_dot: e.target.value })} required className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Năm học</label><input type="text" value={formData.nam_hoc} onChange={(e) => setFormData({ ...formData, nam_hoc: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Học kỳ</label><input type="text" value={formData.hoc_ky} onChange={(e) => setFormData({ ...formData, hoc_ky: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          </div>
          <div className="grid grid-cols-2 gap-4">
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Ngày bắt đầu</label><input type="date" value={formData.ngay_bat_dau} onChange={(e) => setFormData({ ...formData, ngay_bat_dau: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
            <div><label className="block text-sm font-medium text-slate-700 mb-1">Ngày kết thúc</label><input type="date" value={formData.ngay_ket_thuc} onChange={(e) => setFormData({ ...formData, ngay_ket_thuc: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          </div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Trạng thái</label><select value={formData.trang_thai} onChange={(e) => setFormData({ ...formData, trang_thai: e.target.value })} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"><option value="draft">Draft</option><option value="open">Open</option><option value="closed">Closed</option></select></div>
          <div><label className="block text-sm font-medium text-slate-700 mb-1">Mô tả</label><textarea value={formData.mo_ta} onChange={(e) => setFormData({ ...formData, mo_ta: e.target.value })} rows={3} className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-blue-500 outline-none" /></div>
          <div className="flex justify-end gap-3 pt-4"><button type="button" onClick={() => { setIsModalOpen(false); resetForm(); }} className="px-4 py-2 border rounded-lg">Hủy</button><button type="submit" className="px-4 py-2 bg-blue-600 text-white rounded-lg">Lưu</button></div>
        </form>
      </Modal>
    </div>
  );
};

export default DotXet;

