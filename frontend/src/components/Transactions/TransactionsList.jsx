import React from 'react';
import { Search, Trash2 } from 'lucide-react';

export default function TransactionList({
  transactions,
  searchTerm,
  onSearchChange,
  onDeleteTransaction,
  onTransactionClick,
}) {
  const groupTransactionsByDate = () => {
    const filtered = transactions.filter(
      (t) =>
        t.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        t.merchant.toLowerCase().includes(searchTerm.toLowerCase())
    );

    const grouped = {};
    filtered.forEach((t) => {
      const date = new Date(t.created_at).toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
      });
      if (!grouped[date]) grouped[date] = [];
      grouped[date].push(t);
    });

    return grouped;
  };

  const handleDelete = (e, transactionId, transactionName) => {
    e.stopPropagation(); // Prevent triggering the click handler
    if (
      window.confirm(
        `Are you sure you want to delete "${transactionName}"? The amount will be refunded to your card.`
      )
    ) {
      onDeleteTransaction(transactionId);
    }
  };

  const groupedTransactions = groupTransactionsByDate();

  return (
    <div className="bg-white rounded-2xl p-6 shadow-lg">
      <div className="mb-4">
        <div className="relative">
          <Search
            className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400"
            size={20}
          />
          <input
            type="text"
            placeholder="Search transactions..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.target.value)}
            className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
          />
        </div>
      </div>

      <div className="space-y-4 max-h-[600px] overflow-y-auto">
        {Object.keys(groupedTransactions).length === 0 ? (
          <p className="text-gray-500 text-center py-8">
            {searchTerm
              ? 'No transactions found matching your search.'
              : 'No transactions yet. Add one to get started!'}
          </p>
        ) : (
          Object.entries(groupedTransactions).map(([date, trans]) => (
            <div key={date}>
              <p className="text-sm text-gray-500 font-medium mb-2">{date}</p>
              <div className="space-y-2 mb-4">
                {trans.map((t) => (
                  <div
                    key={t.id}
                    onClick={() => onTransactionClick && onTransactionClick(t)}
                    className="flex items-center justify-between p-3 bg-gray-50 rounded-lg hover:bg-gray-100 transition group cursor-pointer"
                  >
                    <div className="flex-1">
                      <p className="font-semibold text-gray-800">{t.name}</p>
                      <p className="text-sm text-gray-500">{t.merchant}</p>
                      {t.description && (
                        <p className="text-xs text-gray-400 mt-1">{t.description}</p>
                      )}
                    </div>
                    <div className="flex items-center gap-3">
                      <span className="font-bold text-red-500">
                        -${t.amount.toFixed(2)}
                      </span>
                      <button
                        onClick={(e) => handleDelete(e, t.id, t.name)}
                        className="p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                        title="Delete transaction"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
}