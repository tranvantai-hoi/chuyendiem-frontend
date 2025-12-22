import { Navigate } from 'react-router-dom';
import CreditTransferNavbar from '../../components/CreditTransfer/Navbar';

const CreditTransferLayout = ({ children }) => {
  const token = localStorage.getItem('credit_transfer_token');
  
  if (!token) {
    return <Navigate to="/credit-transfer/login" replace />;
  }

  return (
    <div className="min-h-screen bg-slate-50">
      <CreditTransferNavbar />
      <main className="py-8">{children}</main>
    </div>
  );
};

export default CreditTransferLayout;

