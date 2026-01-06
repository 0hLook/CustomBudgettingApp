import { useState, useEffect } from 'react';
import CardList from '../components/Cards/CardList';
import TransactionList from '../components/Transactions/TransactionsList';
import AddCardModal from '../components/Modals/AddCardModal';
import AddBalanceModal from '../components/Modals/AddBalanceModal';
import AddTransactionModal from '../components/Modals/AddTransactionModal';
import EditTransactionModal from '../components/Modals/EditTransactionModal';
import { useApp } from '../context/AppContext';

export default function DashboardPage() {
  const {
    creditCards,
    transactions,
    searchTerm,
    setSearchTerm,
    modalOpen,
    setModalOpen,
    modalType,
    setModalType,
    cardForm,
    setCardForm,
    transactionForm,
    setTransactionForm,
    handleAddCard,
    handleAddBalance,
    handleAddTransaction,
    handleDeleteCard,
    handleDeleteTransaction,
    handleUpdateTransaction,
    totalBalance,
  } = useApp();

  const [selectedTransaction, setSelectedTransaction] = useState(null);

  const handleTransactionClick = (transaction) => {
    setSelectedTransaction(transaction);
    setModalType('editTransaction');
    setModalOpen(true);
  };

  return (
    <div className="container mx-auto p-4 grid md:grid-cols-2 gap-6">
      <CardList
        cards={creditCards}
        totalBalance={totalBalance}
        onDeleteCard={handleDeleteCard}
      />

      <TransactionList
        transactions={transactions}
        searchTerm={searchTerm}
        onSearchChange={setSearchTerm}
        onDeleteTransaction={handleDeleteTransaction}
        onTransactionClick={handleTransactionClick}
      />

      {modalOpen && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center p-4 z-50">
          <div className="bg-white rounded-2xl p-6 w-full max-w-md">
            <h3 className="text-xl font-bold mb-4">
              {modalType === 'addCard' && 'Add Credit Card'}
              {modalType === 'addBalance' && 'Manage Balance'}
              {modalType === 'addTransaction' && 'Add Transaction'}
              {modalType === 'editTransaction' && 'Edit Transaction'}
            </h3>

            {modalType === 'addCard' && (
              <AddCardModal
                cardForm={cardForm}
                setCardForm={setCardForm}
                onSubmit={handleAddCard}
                onClose={() => setModalOpen(false)}
              />
            )}

            {modalType === 'addBalance' && (
              <AddBalanceModal
                cardForm={cardForm}
                setCardForm={setCardForm}
                creditCards={creditCards}
                onSubmit={handleAddBalance}
                onClose={() => setModalOpen(false)}
              />
            )}

            {modalType === 'addTransaction' && (
              <AddTransactionModal
                transactionForm={transactionForm}
                setTransactionForm={setTransactionForm}
                creditCards={creditCards}
                onSubmit={handleAddTransaction}
                onClose={() => setModalOpen(false)}
              />
            )}

            {modalType === 'editTransaction' && selectedTransaction && (
              <EditTransactionModal
                transaction={selectedTransaction}
                creditCards={creditCards}
                onSubmit={handleUpdateTransaction}
                onClose={() => {
                  setModalOpen(false);
                  setSelectedTransaction(null);
                }}
              />
            )}
          </div>
        </div>
      )}
    </div>
  );
}