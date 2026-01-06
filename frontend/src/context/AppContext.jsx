import React, { createContext, useContext, useState, useEffect } from 'react';

const AppContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export function AppProvider({ children }) {
  const [creditCards, setCreditCards] = useState([]);
  const [transactions, setTransactions] = useState([]);
  const [searchTerm, setSearchTerm] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [modalType, setModalType] = useState('');
  
  const [cardForm, setCardForm] = useState({
    name: '',
    balance: '',
    cardId: '',
  });
  
  const [transactionForm, setTransactionForm] = useState({
    name: '',
    merchant: '',
    amount: '',
    description: '',
    cardId: '',
  });

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      fetchUserData(token);
    }
  }, []);

  const fetchUserData = async (token) => {
    try {
      const headers = { Authorization: `Bearer ${token}` };

      const [cardsRes, transRes] = await Promise.all([
        fetch(`${API_URL}/cards`, { headers }),
        fetch(`${API_URL}/transactions`, { headers }),
      ]);

      if (cardsRes.ok && transRes.ok) {
        setCreditCards(await cardsRes.json());
        setTransactions(await transRes.json());
      } else {
        localStorage.removeItem('token');
        localStorage.removeItem('user');
      }
    } catch (err) {
      console.error('Error fetching data:', err);
    }
  };

  const handleAddCard = async () => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/cards`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          name: cardForm.name,
          balance: parseFloat(cardForm.balance),
        }),
      });

      if (res.ok) {
        await fetchUserData(token);
        setCardForm({ name: '', balance: '', cardId: '' });
        setModalOpen(false);
      }
    } catch (err) {
      alert('Error adding card');
    }
  };

  const handleAddBalance = async (isAdding = true) => {
    const token = localStorage.getItem('token');
    const amount = parseFloat(cardForm.balance);
    const finalAmount = isAdding ? amount : -amount;

    try {
      const res = await fetch(`${API_URL}/cards/${cardForm.cardId}/balance`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ amount: finalAmount }),
      });

      if (res.ok) {
        await fetchUserData(token);
        setCardForm({ name: '', balance: '', cardId: '' });
        setModalOpen(false);
      }
    } catch (err) {
      alert('Error updating balance');
    }
  };

  const handleAddTransaction = async () => {
    const token = localStorage.getItem('token');

    const card = creditCards.find((c) => c.id === parseInt(transactionForm.cardId));
    if (!card) {
      alert('Please select a card');
      return;
    }
    if (parseFloat(transactionForm.amount) > card.balance) {
      alert('Transaction amount exceeds card balance!');
      return;
    }

    try {
      const res = await fetch(`${API_URL}/transactions`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          ...transactionForm,
          amount: parseFloat(transactionForm.amount),
          cardId: parseInt(transactionForm.cardId),
        }),
      });

      if (res.ok) {
        await fetchUserData(token);
        setTransactionForm({
          name: '',
          merchant: '',
          amount: '',
          description: '',
          cardId: '',
        });
        setModalOpen(false);
      }
    } catch (err) {
      alert('Error adding transaction');
    }
  };

  const handleUpdateTransaction = async (transactionId, updatedData) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/transactions/${transactionId}`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(updatedData),
      });

      if (res.ok) {
        await fetchUserData(token);
      } else {
        const data = await res.json();
        alert(data.error || 'Error updating transaction');
      }
    } catch (err) {
      alert('Error updating transaction');
    }
  };

  const handleDeleteCard = async (cardId) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/cards/${cardId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await fetchUserData(token);
      } else {
        const data = await res.json();
        alert(data.error || 'Error deleting card');
      }
    } catch (err) {
      alert('Error deleting card');
    }
  };

  const handleDeleteTransaction = async (transactionId) => {
    const token = localStorage.getItem('token');

    try {
      const res = await fetch(`${API_URL}/transactions/${transactionId}`, {
        method: 'DELETE',
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (res.ok) {
        await fetchUserData(token);
      } else {
        const data = await res.json();
        alert(data.error || 'Error deleting transaction');
      }
    } catch (err) {
      alert('Error deleting transaction');
    }
  };

  const totalBalance = creditCards.reduce((sum, card) => sum + card.balance, 0);

  const value = {
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
    handleUpdateTransaction,
    handleDeleteCard,
    handleDeleteTransaction,
    totalBalance,
  };

  return <AppContext.Provider value={value}>{children}</AppContext.Provider>;
}

export function useApp() {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
}