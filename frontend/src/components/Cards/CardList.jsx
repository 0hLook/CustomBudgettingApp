import { CreditCard, Trash2 } from 'lucide-react';

export default function CardList({ cards, totalBalance, onDeleteCard }) {
  const handleDelete = (cardId, cardName) => {
    if (window.confirm(`Are you sure you want to delete "${cardName}"? This will also delete all associated transactions.`)) {
      onDeleteCard(cardId);
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-gradient-to-r from-purple-500 to-pink-500 rounded-2xl p-6 text-white shadow-lg">
        <p className="text-sm opacity-90 mb-2">Net Worth</p>
        <h2 className="text-4xl font-bold">${totalBalance.toFixed(2)}</h2>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-lg">
        <h3 className="text-lg font-semibold mb-4 flex items-center gap-2">
          <CreditCard size={20} />
          Credit Cards
        </h3>
        <div className="space-y-3">
          {cards.length === 0 ? (
            <p className="text-gray-500 text-center py-4">No credit cards yet. Add one to get started!</p>
          ) : (
            cards.map(card => (
              <div 
                key={card.id} 
                className="flex items-center justify-between p-3 bg-gray-50 rounded-lg group hover:bg-gray-100 transition"
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-purple-500 rounded-full flex items-center justify-center text-white font-bold">
                    {card.name.charAt(0)}
                  </div>
                  <span className="font-medium">{card.name}</span>
                </div>
                <div className="flex items-center gap-3">
                  <span className="font-semibold text-purple-600">
                    ${card.balance.toFixed(2)}
                  </span>
                  <button
                    onClick={() => handleDelete(card.id, card.name)}
                    className="p-2 text-red-500 hover:bg-red-50 rounded-lg opacity-0 group-hover:opacity-100 transition"
                    title="Delete card"
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
}