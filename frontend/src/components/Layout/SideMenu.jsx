import { CreditCard, DollarSign, FileText } from 'lucide-react';
import { useApp } from '../../context/AppContext';

export default function SideMenu({ isOpen, onClose }) {
  const { setModalType, setModalOpen } = useApp();

  const handleMenuItemClick = (type) => {
    setModalType(type);
    setModalOpen(true);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50" onClick={onClose}>
      <div className="bg-white w-64 h-full p-6 space-y-4" onClick={(e) => e.stopPropagation()}>
        <h2 className="text-2xl font-bold mb-6">Menu</h2>

        <button
          onClick={() => handleMenuItemClick('addCard')}
          className="w-full flex items-center gap-3 p-3 hover:bg-purple-50 rounded-lg text-left"
        >
          <CreditCard size={20} />
          <span>Add Credit Card</span>
        </button>

        <button
          onClick={() => handleMenuItemClick('addBalance')}
          className="w-full flex items-center gap-3 p-3 hover:bg-purple-50 rounded-lg text-left"
        >
          <DollarSign size={20} />
          <span>Manage Balance</span>
        </button>

        <button
          onClick={() => handleMenuItemClick('addTransaction')}
          className="w-full flex items-center gap-3 p-3 hover:bg-purple-50 rounded-lg text-left"
        >
          <FileText size={20} />
          <span>Add Transaction</span>
        </button>
      </div>
    </div>
  );
}