import { useParams, Link } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { chuyenDiemApi, dotXetApi, exportApi } from '../../services/creditTransferApi';
import { Download, AlertTriangle, CheckCircle, XCircle, ArrowLeft } from 'lucide-react';

const ChuyenDiemDetail = () => {
  const { dotXetId } = useParams();

  const { data: dotXet } = useQuery({
    queryKey: ['dot-xet', dotXetId],
    queryFn: () => dotXetApi.getById(dotXetId),
    enabled: !!dotXetId,
  });

  const { data: chuyenDiemList = [], isLoading } = useQuery({
    queryKey: ['chuyen-diem', dotXetId],
    queryFn: () => chuyenDiemApi.getByDotXet(dotXetId),
    enabled: !!dotXetId,
  });

  const handleExport = async () => {
    try {
      await exportApi.chuyenDiemByDotXet(dotXetId);
    } catch (error) {
      alert('Lỗi khi export: ' + error.message);
    }
  };

  const getRowClass = (row) => {
    if (row.loi_sai_ten_hoc_phan || row.loi_sai_so_tin_chi || !row.kiem_tra_hoc_phan) {
      return 'bg-red-50 border-red-200';
    }
    if (row.kiem_tra_hoc_phan && !row.loi_sai_ten_hoc_phan && !row.loi_sai_so_tin_chi) {
      return 'bg-green-50 border-green-200';
    }
    return 'bg-white border-slate-200';
  };

  const getStatusIcon = (row) => {
    if (row.loi_sai_ten_hoc_phan || row.loi_sai_so_tin_chi || !row.kiem_tra_hoc_phan) {
      return <XCircle className="text-red-500" size={20} />;
    }
    if (row.kiem_tra_hoc_phan && !row.loi_sai_ten_hoc_phan && !row.loi_sai_so_tin_chi) {
      return <CheckCircle className="text-green-500" size={20} />;
    }
    return <AlertTriangle className="text-yellow-500" size={20} />;
  };

  if (isLoading) {
    return <div className="text-center py-8">Đang tải...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="mb-6 flex justify-between items-center">
        <div>
          <Link to="/credit-transfer/dot-xet" className="text-blue-600 hover:text-blue-800 flex items-center gap-2 mb-2">
            <ArrowLeft size={18} />
            Quay lại danh sách đợt xét
          </Link>
          <h1 className="text-3xl font-bold text-slate-900">
            Chi tiết chuyển điểm - {dotXet?.ten_dot || 'Đang tải...'}
          </h1>
        </div>
        <button
          onClick={handleExport}
          className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-lg transition-colors"
        >
          <Download size={18} />
          Export Excel
        </button>
      </div>

      <div className="mb-4 flex gap-4">
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-green-100 border border-green-300 rounded"></div>
          <span className="text-sm text-slate-700">Hợp lệ</span>
        </div>
        <div className="flex items-center gap-2">
          <div className="w-4 h-4 bg-red-100 border border-red-300 rounded"></div>
          <span className="text-sm text-slate-700">Có lỗi</span>
        </div>
      </div>

      <div className="bg-white rounded-xl shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-slate-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Trạng thái</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mã SV</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tên SV</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mã HP gốc</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tên HP gốc</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">TC gốc</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Mã HP chuyển</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Tên HP chuyển</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">TC chuyển</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Điểm</th>
                <th className="px-4 py-3 text-left text-xs font-medium text-slate-500 uppercase">Lỗi</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {chuyenDiemList.length === 0 ? (
                <tr>
                  <td colSpan={11} className="px-4 py-8 text-center text-slate-500">
                    Chưa có dữ liệu chuyển điểm
                  </td>
                </tr>
              ) : (
                chuyenDiemList.map((row, idx) => (
                  <tr key={idx} className={getRowClass(row)}>
                    <td className="px-4 py-3">{getStatusIcon(row)}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{row.ma_sinh_vien}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{row.ten_sinh_vien}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{row.ma_hoc_phan_goc}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{row.ten_hoc_phan_goc}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{row.so_tin_chi_goc}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{row.ma_hoc_phan_chuyen}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{row.ten_hoc_phan_chuyen}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{row.so_tin_chi_chuyen}</td>
                    <td className="px-4 py-3 text-sm text-slate-900">{row.diem_chuyen}</td>
                    <td className="px-4 py-3 text-sm">
                      {row.thong_bao_loi ? (
                        <div className="text-red-600 text-xs max-w-xs">{row.thong_bao_loi}</div>
                      ) : (
                        <span className="text-green-600">✓ OK</span>
                      )}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default ChuyenDiemDetail;

