import { useState } from 'react';
import { Search, List, Table as TableIcon } from 'lucide-react';
import { useApp } from '../context/AppContext';
import EditTransactionModal from '../components/Modals/EditTransactionModal';

export default function TransactionsPage() {
  const {
    transactions,
    creditCards,
    modalOpen,
    setModalOpen,
    handleDeleteTransaction,
    handleUpdateTransaction,
  } = useApp();

  const [searchTerm, setSearchTerm] = useState('');
  const [viewMode, setViewMode] = useState('list'); // 'list' or 'table'
  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const filteredTransactions = transactions.filter(t =>
    t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
    t.merchant.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setModalOpen(true);
  };

  const getCardName = (cardId) => {
    const card = creditCards.find(c => c.id === cardId);
    return card ? card.name : 'Unknown';
  };

  return (
    <div className="container mx-auto p-4">
      <div className="bg-white rounded-2xl p-6 shadow-lg">
        {/* Header with Search and View Toggle */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4 mb-6">
          <h2 className="text-2xl font-bold text-gray-800">All Transactions</h2>
          
          <div className="flex gap-4 items-center">
            {/* Search */}
            <div className="relative flex-1 md:w-64">
              <Search
                className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
                size={20}
              />
              <input
                type="text"
                placeholder="Search transactions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
              />
            </div>

            {/* View Toggle */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-lg">
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 rounded ${
                  viewMode === 'list'
                    ? 'bg-white text-purple-600 shadow'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                title="List View"
              >
                <List size={20} />
              </button>
              <button
                onClick={() => setViewMode('table')}
                className={`p-2 rounded ${
                  viewMode === 'table'
                    ? 'bg-white text-purple-600 shadow'
                    : 'text-gray-600 hover:text-gray-800'
                }`}
                title="Table View"
              >
                <TableIcon size={20} />
              </button>
            </div>
          </div>
        </div>

        {/* List View */}
        {viewMode === 'list' && (
          <div className="space-y-3">
            {filteredTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {searchTerm ? 'No transactions found.' : 'No transactions yet.'}
              </p>
            ) : (
              filteredTransactions.map(t => (
                <div
                  key={t.id}
                  onClick={() => handleTransactionClick(t)}
                  className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition cursor-pointer group"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-2">
                      <p className="font-semibold text-gray-800">{t.name}</p>
                      <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                        {getCardName(t.card_id)}
                      </span>
                    </div>
                    <p className="text-sm text-gray-500">{t.merchant}</p>
                    {t.description && (
                      <p className="text-xs text-gray-400 mt-1">{t.description}</p>
                    )}
                    <p className="text-xs text-gray-400 mt-1">
                      {new Date(t.created_at).toLocaleDateString('en-US', {
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric',
                      })}
                    </p>
                  </div>
                  <span className="font-bold text-red-500 text-lg">
                    -${t.amount.toFixed(2)}
                  </span>
                </div>
              ))
            )}
          </div>
        )}

        {/* Table View */}
        {viewMode === 'table' && (
          <div className="overflow-x-auto">
            {filteredTransactions.length === 0 ? (
              <p className="text-gray-500 text-center py-8">
                {searchTerm ? 'No transactions found.' : 'No transactions yet.'}
              </p>
            ) : (
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Date</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Name</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Merchant</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Card</th>
                    <th className="text-left py-3 px-4 font-semibold text-gray-700">Description</th>
                    <th className="text-right py-3 px-4 font-semibold text-gray-700">Amount</th>
                  </tr>
                </thead>
                <tbody>
                  {filteredTransactions.map(t => (
                    <tr
                      key={t.id}
                      onClick={() => handleTransactionClick(t)}
                      className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer transition"
                    >
                      <td className="py-3 px-4 text-sm text-gray-600">
                        {new Date(t.created_at).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric',
                        })}
                      </td>
                      <td className="py-3 px-4 font-medium text-gray-800">{t.name}</td>
                      <td className="py-3 px-4 text-sm text-gray-600">{t.merchant}</td>
                      <td className="py-3 px-4">
                        <span className="text-xs bg-purple-100 text-purple-600 px-2 py-1 rounded">
                          {getCardName(t.card_id)}
                        </span>
                      </td>
                      <td className="py-3 px-4 text-sm text-gray-500 max-w-xs truncate">
                        {t.description || '-'}
                      </td>
                      <td className="py-3 px-4 text-right font-bold text-red-500">
                        -${t.amount.toFixed(2)}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        )}
      </div>

      {/* Edit Transaction Modal */}
      {modalOpen && selectedTransaction && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">Edit Transaction</h3>
            <EditTransactionModal
              transaction={selectedTransaction}
              creditCards={creditCards}
              onSubmit={handleUpdateTransaction}
              onDelete={() => {
                handleDeleteTransaction(selectedTransaction.id);
                setModalOpen(false);
                setSelectedTransaction(null);
              }}
              onClose={() => {
                setModalOpen(false);
                setSelectedTransaction(null);
              }}
            />
          </div>
        </div>
      )}
    </div>
  );
}