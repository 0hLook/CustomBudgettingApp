import { useState } from 'react';

export default function AddBalanceModal({ 
  cardForm, 
  setCardForm, 
  creditCards, 
  onSubmit, 
  onClose 
}) {
  const [isAdding, setIsAdding] = useState(true);

  const selectedCard = creditCards.find(c => c.id === parseInt(cardForm.cardId));
  const amount = parseFloat(cardForm.balance) || 0;
  const canRemove = selectedCard && amount <= selectedCard.balance;

  const handleSubmit = () => {
    if (!isAdding && !canRemove) {
      alert('Cannot remove more than the card balance!');
      return;
    }
    onSubmit(isAdding);
  };

  return (
    <div className="space-y-4">
      <select
        value={cardForm.cardId}
        onChange={(e) => setCardForm({...cardForm, cardId: e.target.value})}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
      >
        <option value="">Select Card</option>
        {creditCards.map(card => (
          <option key={card.id} value={card.id}>
            {card.name} (${card.balance.toFixed(2)})
          </option>
        ))}
      </select>

      <div className="flex gap-2 bg-gray-100 p-1 rounded-lg">
        <button
          onClick={() => setIsAdding(true)}
          className={`flex-1 py-2 rounded-md font-medium transition ${
            isAdding 
              ? 'bg-white text-purple-600 shadow' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Add Balance
        </button>
        <button
          onClick={() => setIsAdding(false)}
          className={`flex-1 py-2 rounded-md font-medium transition ${
            !isAdding 
              ? 'bg-white text-red-600 shadow' 
              : 'text-gray-600 hover:text-gray-800'
          }`}
        >
          Remove Balance
        </button>
      </div>

      <input
        type="number"
        step="0.01"
        placeholder={isAdding ? "Amount to Add" : "Amount to Remove"}
        value={cardForm.balance}
        onChange={(e) => setCardForm({...cardForm, balance: e.target.value})}
        onKeyPress={(e) => e.key === 'Enter' && handleSubmit()}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
      />

      {/* Warning for remove */}
      {!isAdding && selectedCard && amount > selectedCard.balance && (
        <p className="text-red-500 text-sm">
          Amount exceeds card balance (${selectedCard.balance.toFixed(2)})
        </p>
      )}

      {/* Preview */}
      {selectedCard && amount > 0 && (
        <div className="bg-gray-50 p-3 rounded-lg text-sm">
          <p className="text-gray-600">Preview:</p>
          <p className="font-semibold text-gray-800">
            ${selectedCard.balance.toFixed(2)} {isAdding ? '+' : '-'} ${amount.toFixed(2)} = 
            <span className={isAdding ? 'text-green-600' : 'text-orange-600'}>
              {' '}${(selectedCard.balance + (isAdding ? amount : -amount)).toFixed(2)}
            </span>
          </p>
        </div>
      )}

      <div className="flex gap-2">
        <button 
          onClick={handleSubmit}
          disabled={!isAdding && !canRemove}
          className={`flex-1 py-2 rounded-lg font-semibold transition ${
            isAdding
              ? 'bg-purple-500 text-white hover:bg-purple-600'
              : 'bg-red-500 text-white hover:bg-red-600 disabled:bg-gray-300 disabled:cursor-not-allowed'
          }`}
        >
          {isAdding ? 'Add Balance' : 'Remove Balance'}
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