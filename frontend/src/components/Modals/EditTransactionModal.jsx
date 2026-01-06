import { useState, useEffect } from 'react';
import { Trash2 } from 'lucide-react';

export default function EditTransactionModal({
  transaction,
  creditCards,
  onSubmit,
  onDelete,
  onClose,
}) {
  const [formData, setFormData] = useState({
    name: transaction.name,
    merchant: transaction.merchant,
    amount: transaction.amount.toString(),
    description: transaction.description || '',
    cardId: transaction.card_id.toString(),
  });

  const [hasChanges, setHasChanges] = useState(false);

  useEffect(() => {
    const changed =
      formData.name !== transaction.name ||
      formData.merchant !== transaction.merchant ||
      parseFloat(formData.amount) !== transaction.amount ||
      formData.description !== (transaction.description || '') ||
      parseInt(formData.cardId) !== transaction.card_id;

    setHasChanges(changed);
  }, [formData, transaction]);

  const handleSubmit = async () => {
    if (!hasChanges) {
      onClose();
      return;
    }

    await onSubmit(transaction.id, {
      ...formData,
      amount: parseFloat(formData.amount),
      cardId: parseInt(formData.cardId),
    });
    onClose();
  };

  return (
    <div className="space-y-4">
      <select
        value={formData.cardId}
        onChange={(e) => setFormData({ ...formData, cardId: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
      >
        {creditCards.map((card) => (
          <option key={card.id} value={card.id}>
            {card.name} (${card.balance.toFixed(2)})
          </option>
        ))}
      </select>

      <input
        type="text"
        placeholder="Transaction Name"
        value={formData.name}
        onChange={(e) => setFormData({ ...formData, name: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
      />

      <input
        type="text"
        placeholder="Merchant"
        value={formData.merchant}
        onChange={(e) => setFormData({ ...formData, merchant: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
      />

      <input
        type="number"
        step="0.01"
        placeholder="Amount"
        value={formData.amount}
        onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
      />

      <textarea
        placeholder="Description (optional)"
        value={formData.description}
        onChange={(e) => setFormData({ ...formData, description: e.target.value })}
        className="w-full px-4 py-2 border rounded-lg focus:ring-2 focus:ring-purple-400 outline-none"
        rows="3"
      />

      <div className="text-xs text-gray-500">
        Created: {new Date(transaction.created_at).toLocaleString()}
      </div>

      {hasChanges && (
        <div className="text-sm text-orange-600 bg-orange-50 p-2 rounded">
          You have unsaved changes. They will be saved when you close this window.
        </div>
      )}

      <div className="flex gap-2">
        <button
          onClick={handleSubmit}
          className="flex-1 bg-purple-500 text-white py-2 rounded-lg font-semibold hover:bg-purple-600"
        >
          {hasChanges ? 'Save & Close' : 'Close'}
        </button>
        <button
          onClick={onDelete}
          className="px-4 bg-red-500 text-white py-2 rounded-lg font-semibold hover:bg-red-600 flex items-center gap-2"
        >
          <Trash2 size={18} />
          Delete
        </button>
      </div>
    </div>
  );
}