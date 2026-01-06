export default function AddTransactionModal({ 
  transactionForm, 
  setTransactionForm, 
  creditCards, 
  onSubmit, 
  onClose 
}) {
  return (
    <div className="space-y-4">
      <select
        value={transactionForm.cardId}
        onChange={(e) => setTransactionForm({...transactionForm, cardId: e.target.value})}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
      >
        <option value="">Select Card</option>
        {creditCards.map(card => (
          <option key={card.id} value={card.id}>
            {card.name} (${card.balance.toFixed(2)})
          </option>
        ))}
      </select>
      <input
        type="text"
        placeholder="Transaction Name"
        value={transactionForm.name}
        onChange={(e) => setTransactionForm({...transactionForm, name: e.target.value})}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
      />
      <input
        type="text"
        placeholder="Merchant"
        value={transactionForm.merchant}
        onChange={(e) => setTransactionForm({...transactionForm, merchant: e.target.value})}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
      />
      <input
        type="number"
        step="0.01"
        placeholder="Amount"
        value={transactionForm.amount}
        onChange={(e) => setTransactionForm({...transactionForm, amount: e.target.value})}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
      />
      <textarea
        placeholder="Description (optional)"
        value={transactionForm.description}
        onChange={(e) => setTransactionForm({...transactionForm, description: e.target.value})}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
        rows="3"
      />
      <div className="flex gap-2">
        <button 
          onClick={onSubmit} 
          className="flex-1 bg-purple-500 text-white py-2 rounded-lg font-semibold hover:bg-purple-600"
        >
          Add Transaction
        </button>
        <button 
          onClick={onClose} 
          className="flex-1 bg-gray-200 py-2 rounded-lg font-semibold hover:bg-gray-300"
        >
          Cancel
        </button>
      </div>
    </div>
  );
}