export default function AddCardModal({ 
  cardForm, 
  setCardForm, 
  onSubmit, 
  onClose 
}) {
  return (
    <div className="space-y-4">
      <input
        type="text"
        placeholder="Card Name"
        value={cardForm.name}
        onChange={(e) => setCardForm({...cardForm, name: e.target.value})}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
      />
      <input
        type="number"
        step="0.01"
        placeholder="Initial Balance"
        value={cardForm.balance}
        onChange={(e) => setCardForm({...cardForm, balance: e.target.value})}
        onKeyPress={(e) => e.key === 'Enter' && onSubmit()}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
      />
      <div className="flex gap-2">
        <button 
          onClick={onSubmit} 
          className="flex-1 bg-purple-500 text-white py-2 rounded-lg font-semibold hover:bg-purple-600"
        >
          Add Card
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