import { useState } from 'react';
import { useMutation } from '@tanstack/react-query';
import { importApi, dotXetApi } from '../../services/creditTransferApi';
import { useQuery } from '@tanstack/react-query';
import { Upload, FileSpreadsheet, AlertCircle, CheckCircle } from 'lucide-react';

const Import = () => {
  const [selectedFile, setSelectedFile] = useState(null);
  const [importType, setImportType] = useState('sinh-vien');
  const [dotXetId, setDotXetId] = useState('');
  const [result, setResult] = useState(null);

  const { data: dotXetList = [] } = useQuery({
    queryKey: ['dot-xet'],
    queryFn: dotXetApi.getAll,
  });

  const importMutation = useMutation({
    mutationFn: async ({ file, type, dotXetId }) => {
      if (type === 'chuyen-diem') {
        return importApi.chuyenDiem(file, dotXetId);
      } else if (type === 'hoc-phan') {
        return importApi.hocPhan(file);
      } else {
        return importApi.sinhVien(file);
      }
    },
    onSuccess: (data) => {
      setResult(data);
      setSelectedFile(null);
    },
    onError: (error) => {
      setResult({ success: 0, errors: [{ error: error.message }] });
    },
  });

  const handleFileChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setSelectedFile(file);
      setResult(null);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!selectedFile) {
      alert('Vui lòng chọn file');
      return;
    }
    if (importType === 'chuyen-diem' && !dotXetId) {
      alert('Vui lòng chọn đợt xét');
      return;
    }
    importMutation.mutate({ file: selectedFile, type: importType, dotXetId });
  };

  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold text-slate-900 mb-6">Import dữ liệu từ Excel</h1>

      <div className="bg-white rounded-xl shadow-md p-6 space-y-6">
        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Loại dữ liệu cần import
          </label>
          <select
            value={importType}
            onChange={(e) => {
              setImportType(e.target.value);
              setResult(null);
            }}
            className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
          >
            <option value="sinh-vien">Sinh viên</option>
            <option value="hoc-phan">Học phần</option>
            <option value="chuyen-diem">Chuyển điểm</option>
          </select>
        </div>

        {importType === 'chuyen-diem' && (
          <div>
            <label className="block text-sm font-medium text-slate-700 mb-2">
              Chọn đợt xét
            </label>
            <select
              value={dotXetId}
              onChange={(e) => setDotXetId(e.target.value)}
              className="w-full px-4 py-2 border border-slate-300 rounded-lg focus:ring-2 focus:ring-blue-500 outline-none"
            >
              <option value="">-- Chọn đợt xét --</option>
              {dotXetList.map((dx) => (
                <option key={dx.id} value={dx.id}>
                  {dx.ten_dot}
                </option>
              ))}
            </select>
          </div>
        )}

        <div>
          <label className="block text-sm font-medium text-slate-700 mb-2">
            Chọn file Excel
          </label>
          <div className="border-2 border-dashed border-slate-300 rounded-lg p-6 text-center hover:border-blue-400 transition-colors">
            <input
              type="file"
              accept=".xlsx,.xls"
              onChange={handleFileChange}
              className="hidden"
              id="file-input"
            />
            <label
              htmlFor="file-input"
              className="cursor-pointer flex flex-col items-center gap-2"
            >
              <FileSpreadsheet className="text-slate-400" size={48} />
              <span className="text-slate-600">
                {selectedFile ? selectedFile.name : 'Click để chọn file Excel'}
              </span>
            </label>
          </div>
        </div>

        {importType === 'sinh-vien' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Định dạng file:</strong> Mã SV, Họ tên, Email, SĐT, Mã lớp, Ngày sinh, Giới tính, Địa chỉ
            </p>
          </div>
        )}

        {importType === 'hoc-phan' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Định dạng file:</strong> Mã HP, Tên HP, Số tín chỉ, Mô tả
            </p>
          </div>
        )}

        {importType === 'chuyen-diem' && (
          <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
            <p className="text-sm text-blue-800">
              <strong>Định dạng file:</strong> Mã SV, Mã HP gốc, Tên HP gốc, TC gốc, Mã HP chuyển, Tên HP chuyển, TC chuyển, Điểm
            </p>
          </div>
        )}

        <button
          onClick={handleSubmit}
          disabled={!selectedFile || importMutation.isPending}
          className="w-full bg-blue-600 hover:bg-blue-700 text-white font-medium py-3 px-4 rounded-lg transition-colors disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center gap-2"
        >
          <Upload size={18} />
          {importMutation.isPending ? 'Đang import...' : 'Import dữ liệu'}
        </button>

        {result && (
          <div className={`border rounded-lg p-4 ${result.errors?.length > 0 ? 'bg-red-50 border-red-200' : 'bg-green-50 border-green-200'}`}>
            <div className="flex items-center gap-2 mb-2">
              {result.errors?.length > 0 ? (
                <AlertCircle className="text-red-600" size={20} />
              ) : (
                <CheckCircle className="text-green-600" size={20} />
              )}
              <h3 className="font-semibold">
                Import thành công: {result.success} bản ghi
              </h3>
            </div>
            {result.errors?.length > 0 && (
              <div className="mt-2">
                <p className="text-sm font-medium text-red-800 mb-2">
                  Có {result.errors.length} lỗi:
                </p>
                <div className="max-h-48 overflow-y-auto">
                  {result.errors.map((err, idx) => (
                    <div key={idx} className="text-xs text-red-700 mb-1">
                      Dòng {err.row || 'N/A'}: {err.error}
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Import;

