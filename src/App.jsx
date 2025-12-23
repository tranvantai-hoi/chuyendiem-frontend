import { Routes, Route, Navigate } from 'react-router-dom';

// CREDIT TRANSFER PAGES
import CreditTransferLogin from './pages/CreditTransfer/Login.jsx';
import CreditTransferLayout from './pages/CreditTransfer/Layout.jsx';
import Dashboard from './pages/CreditTransfer/Dashboard.jsx';
import Khoa from './pages/CreditTransfer/Khoa.jsx';
import ChuongTrinh from './pages/CreditTransfer/ChuongTrinh.jsx';
import HocPhan from './pages/CreditTransfer/HocPhan.jsx';
import Lop from './pages/CreditTransfer/Lop.jsx';
import SinhVien from './pages/CreditTransfer/SinhVien.jsx';
import DotXet from './pages/CreditTransfer/DotXet.jsx';
import ChuyenDiemDetail from './pages/CreditTransfer/ChuyenDiemDetail.jsx';
import Import from './pages/CreditTransfer/Import.jsx';
// Import Users nếu bạn đã tạo trang này (dành cho Admin)
import Users from './pages/CreditTransfer/Users.jsx'; 

const App = () => {
  return (
    <div className="min-h-screen bg-slate-50">
      <Routes>
        {/* Trang đăng nhập hệ thống chuyển điểm */}
        <Route path="/credit-transfer/login" element={<CreditTransferLogin />} />

        {/* Các route cần đăng nhập, bọc bởi layout có navbar */}
        <Route
          path="/credit-transfer/dashboard"
          element={(
            <CreditTransferLayout>
              <Dashboard />
            </CreditTransferLayout>
          )}
        />
        <Route
          path="/credit-transfer/khoa"
          element={(
            <CreditTransferLayout>
              <Khoa />
            </CreditTransferLayout>
          )}
        />
        <Route
          path="/credit-transfer/chuong-trinh"
          element={(
            <CreditTransferLayout>
              <ChuongTrinh />
            </CreditTransferLayout>
          )}
        />
        <Route
          path="/credit-transfer/hoc-phan"
          element={(
            <CreditTransferLayout>
              <HocPhan />
            </CreditTransferLayout>
          )}
        />
        <Route
          path="/credit-transfer/lop"
          element={(
            <CreditTransferLayout>
              <Lop />
            </CreditTransferLayout>
          )}
        />
        <Route
          path="/credit-transfer/sinh-vien"
          element={(
            <CreditTransferLayout>
              <SinhVien />
            </CreditTransferLayout>
          )}
        />
        <Route
          path="/credit-transfer/dot-xet"
          element={(
            <CreditTransferLayout>
              <DotXet />
            </CreditTransferLayout>
          )}
        />

        {/* --- KHU VỰC SỬA LỖI --- */}
        {/* Route 1: Vào trực tiếp để chọn đợt xét (không có ID) */}
        <Route
          path="/credit-transfer/chuyen-diem"
          element={(
            <CreditTransferLayout>
              <ChuyenDiemDetail />
            </CreditTransferLayout>
          )}
        />
        {/* Route 2: Vào chi tiết một đợt xét cụ thể (có ID) */}
        <Route
          path="/credit-transfer/chuyen-diem/:dotXetId"
          element={(
            <CreditTransferLayout>
              <ChuyenDiemDetail />
            </CreditTransferLayout>
          )}
        />
        {/* ----------------------- */}

        <Route
          path="/credit-transfer/import"
          element={(
            <CreditTransferLayout>
              <Import />
            </CreditTransferLayout>
          )}
        />

        {/* Route cho Admin quản lý Users (nếu có) */}
        <Route
          path="/credit-transfer/users"
          element={(
            <CreditTransferLayout>
              <Users />
            </CreditTransferLayout>
          )}
        /> 

        {/* Mặc định chuyển về trang login chuyển điểm */}
        <Route path="*" element={<Navigate to="/credit-transfer/login" replace />} />
      </Routes>
    </div>
  );
};

export default App;