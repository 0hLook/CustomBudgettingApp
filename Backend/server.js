const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const bodyParser = require("body-parser");

const app = express();
const PORT = 3001;
const JWT_SECRET = "laurieisverygay0924";

// Middleware
app.use(cors());
app.use(bodyParser.json());

// DB setup
const db = new sqlite3.Database('./data/budget.db', (err) => {
  if (err) console.error(err);
  else console.log('Connected to SQLite database');
});

// Table creation
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL,
    email TEXT UNIQUE NOT NULL,
    password TEXT NOT NULL,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS credit_cards (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    balance REAL NOT NULL DEFAULT 0,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id)
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS transactions (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    user_id INTEGER NOT NULL,
    card_id INTEGER NOT NULL,
    name TEXT NOT NULL,
    merchant TEXT NOT NULL,
    amount REAL NOT NULL,
    description TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY (user_id) REFERENCES users(id),
    FOREIGN KEY (card_id) REFERENCES credit_cards(id)
  )`);
});

// Auth middleware using JWT and Bcrypt
const authenticateToken = (req, res, next) => {
  const authHeader = req.headers["authorization"];
  const token = authHeader && authHeader.split(" ")[1];

  if (!token) return res.status(401).json({ error: "Access denied" });

  jwt.verify(token, JWT_SECRET, (err, user) => {
    if (err) return res.status(403).json({ error: "Invalid token" });
    req.userId = user.id;
    next();
  });
};

// Auth routes
app.post("/api/auth/signup", async (req, res) => {
  const { name, email, password } = req.body;

  if (!name || !email || !password) {
    return res.status(400).json({ error: "All fields are required" });
  }

  const hashedPassword = await bcrypt.hash(password, 10);

  db.run(
    "INSERT INTO users (name, email, password) VALUES (?, ?, ?)",
    [name, email, hashedPassword],
    function (err) {
      if (err) {
        return res.status(400).json({ error: "Email already exists" });
      }

      const token = jwt.sign({ id: this.lastID }, JWT_SECRET);
      res.json({ token, user: { id: this.lastID, name, email } });
    }
  );
});

app.post("/api/auth/login", (req, res) => {
  const { email, password } = req.body;

  db.get("SELECT * FROM users WHERE email = ?", [email], async (err, user) => {
    if (err || !user) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const validPassword = await bcrypt.compare(password, user.password);
    if (!validPassword) {
      return res.status(400).json({ error: "Invalid credentials" });
    }

    const token = jwt.sign({ id: user.id }, JWT_SECRET);
    res.json({
      token,
      user: { id: user.id, name: user.name, email: user.email },
    });
  });
});

// Credit card routes
app.get("/api/cards", authenticateToken, (req, res) => {
  db.all(
    "SELECT * FROM credit_cards WHERE user_id = ?",
    [req.userId],
    (err, cards) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(cards);
    }
  );
});

app.post("/api/cards", authenticateToken, (req, res) => {
  const { name, balance } = req.body;

  db.run(
    "INSERT INTO credit_cards (user_id, name, balance) VALUES (?, ?, ?)",
    [req.userId, name, balance],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ id: this.lastID, name, balance });
    }
  );
});

app.put("/api/cards/:id/balance", authenticateToken, (req, res) => {
  const { amount } = req.body;
  const { id } = req.params;

  db.run(
    "UPDATE credit_cards SET balance = balance + ? WHERE id = ? AND user_id = ?",
    [amount, id, req.userId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });
      res.json({ success: true });
    }
  );
});

// DELETE credit card - also deletes all associated transactions
app.delete("/api/cards/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  // First delete all transactions associated with this card
  db.run(
    "DELETE FROM transactions WHERE card_id = ? AND user_id = ?",
    [id, req.userId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      // Then delete the card
      db.run(
        "DELETE FROM credit_cards WHERE id = ? AND user_id = ?",
        [id, req.userId],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          if (this.changes === 0) {
            return res.status(404).json({ error: "Card not found" });
          }
          res.json({
            success: true,
            message: "Card and associated transactions deleted",
          });
        }
      );
    }
  );
});

// Transaction routes
app.get("/api/transactions", authenticateToken, (req, res) => {
  db.all(
    "SELECT * FROM transactions WHERE user_id = ? ORDER BY created_at DESC",
    [req.userId],
    (err, transactions) => {
      if (err) return res.status(500).json({ error: err.message });
      res.json(transactions);
    }
  );
});

app.post("/api/transactions", authenticateToken, (req, res) => {
  const { name, merchant, amount, description, cardId } = req.body;

  // Deduct from card balance
  db.run(
    "UPDATE credit_cards SET balance = balance - ? WHERE id = ? AND user_id = ?",
    [amount, cardId, req.userId],
    function (err) {
      if (err) return res.status(500).json({ error: err.message });

      // Create transaction
      db.run(
        "INSERT INTO transactions (user_id, card_id, name, merchant, amount, description) VALUES (?, ?, ?, ?, ?, ?)",
        [req.userId, cardId, name, merchant, amount, description],
        function (err) {
          if (err) return res.status(500).json({ error: err.message });
          res.json({ id: this.lastID });
        }
      );
    }
  );
});

// DELETE transaction - refunds the amount back to the card
app.delete("/api/transactions/:id", authenticateToken, (req, res) => {
  const { id } = req.params;

  console.log("DELETE request for transaction ID:", id); 
  console.log("User ID:", req.userId); 

  // First get the transaction to know the amount and card_id
  db.get(
    "SELECT * FROM transactions WHERE id = ? AND user_id = ?",
    [id, req.userId],
    (err, transaction) => {
      if (err) {
        console.error("Database error:", err); 
        return res.status(500).json({ error: err.message });
      }
      if (!transaction) {
        console.log("Transaction not found for ID:", id); 
        return res.status(404).json({ error: "Transaction not found" });
      }

      console.log("Found transaction:", transaction); 

      // Refund the amount back to the card
      db.run(
        "UPDATE credit_cards SET balance = balance + ? WHERE id = ? AND user_id = ?",
        [transaction.amount, transaction.card_id, req.userId],
        function (err) {
          if (err) {
            console.error("Error updating balance:", err); 
            return res.status(500).json({ error: err.message });
          }

          // Delete the transaction
          db.run(
            "DELETE FROM transactions WHERE id = ? AND user_id = ?",
            [id, req.userId],
            function (err) {
              if (err) {
                console.error("Error deleting transaction:", err); 
                return res.status(500).json({ error: err.message });
              }
              console.log("Transaction deleted successfully"); 
              res.json({
                success: true,
                message: "Transaction deleted and amount refunded",
              });
            }
          );
        }
      );
    }
  );
});

// UPDATE transaction
app.put("/api/transactions/:id", authenticateToken, (req, res) => {
  const { id } = req.params;
  const { name, merchant, amount, description, cardId } = req.body;

  // First get the old transaction
  db.get(
    "SELECT * FROM transactions WHERE id = ? AND user_id = ?",
    [id, req.userId],
    (err, oldTransaction) => {
      if (err) return res.status(500).json({ error: err.message });
      if (!oldTransaction) {
        return res.status(404).json({ error: "Transaction not found" });
      }

      const amountDiff = parseFloat(amount) - oldTransaction.amount;
      const cardChanged = parseInt(cardId) !== oldTransaction.card_id;

      // If card changed or amount changed, update balances
      if (cardChanged) {
        // Refund to old card
        db.run(
          "UPDATE credit_cards SET balance = balance + ? WHERE id = ? AND user_id = ?",
          [oldTransaction.amount, oldTransaction.card_id, req.userId],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });

            // Deduct from new card
            db.run(
              "UPDATE credit_cards SET balance = balance - ? WHERE id = ? AND user_id = ?",
              [amount, cardId, req.userId],
              (err) => {
                if (err) return res.status(500).json({ error: err.message });
                updateTransaction();
              }
            );
          }
        );
      } else if (amountDiff !== 0) {
        // Same card, different amount
        db.run(
          "UPDATE credit_cards SET balance = balance - ? WHERE id = ? AND user_id = ?",
          [amountDiff, cardId, req.userId],
          (err) => {
            if (err) return res.status(500).json({ error: err.message });
            updateTransaction();
          }
        );
      } else {
        updateTransaction();
      }

      function updateTransaction() {
        db.run(
          "UPDATE transactions SET name = ?, merchant = ?, amount = ?, description = ?, card_id = ? WHERE id = ? AND user_id = ?",
          [name, merchant, amount, description, cardId, id, req.userId],
          function (err) {
            if (err) return res.status(500).json({ error: err.message });
            res.json({
              success: true,
              message: "Transaction updated successfully",
            });
          }
        );
      }
    }
  );
});

app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});
