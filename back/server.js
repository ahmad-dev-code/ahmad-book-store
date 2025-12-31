const express = require('express');
const cors = require('cors');
const db = require('./db');

const app = express();
const PORT = process.env.PORT || 5000;

app.use(cors({
  origin: 'https://transcendent-klepon-55987f.netlify.app',
  methods: ['GET', 'POST', 'PUT', 'DELETE'],
  credentials: true
}));

app.use(express.json());

// Login
app.post('/api/login', (req, res) => {
  const { username, password } = req.body;
  if (!username || !password) {
    return res.status(400).json({ message: 'Username and password are required' });
  }
  db.query('SELECT * FROM users WHERE username = ? AND password = ?', [username, password], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.length === 0) {
      res.status(401).json({ message: 'Invalid credentials' });
    } else {
      res.json({ message: 'Login successful', user: results[0] });
    }
  });
});

// Get all books
app.get('/api/books', (req, res) => {
  db.query('SELECT * FROM books', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.json(results);
    }
  });
});

// Get book by id
app.get('/api/books/:id', (req, res) => {
  const { id } = req.params;
  db.query('SELECT * FROM books WHERE id = ?', [id], (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (results.length === 0) {
      res.status(404).json({ message: 'Book not found' });
    } else {
      res.json(results[0]);
    }
  });
});

// Create new book (for admin)
app.post('/api/books', (req, res) => {
  const { title, author, price, category, imgSrc, description } = req.body;
  if (!title || !author || !price) {
    return res.status(400).json({ message: 'Title, author, and price are required' });
  }
  db.query('INSERT INTO books (title, author, price, category, imgSrc, description) VALUES (?, ?, ?, ?, ?, ?)', 
    [title, author, price, category, imgSrc, description], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: result.insertId, title, author, price, category, imgSrc, description });
    }
  });
});

// Update book
app.put('/api/books/:id', (req, res) => {
  const { id } = req.params;
  const { title, author, price, category, imgSrc, description } = req.body;
  if (!title || !author || !price) {
    return res.status(400).json({ message: 'Title, author, and price are required' });
  }
  db.query('UPDATE books SET title = ?, author = ?, price = ?, category = ?, imgSrc = ?, description = ? WHERE id = ?',
    [title, author, price, category, imgSrc, description, id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Book not found' });
    } else {
      res.json({ message: 'Book updated successfully' });
    }
  });
});

// Delete book
app.delete('/api/books/:id', (req, res) => {
  const { id } = req.params;
  db.query('DELETE FROM books WHERE id = ?', [id], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else if (result.affectedRows === 0) {
      res.status(404).json({ message: 'Book not found' });
    } else {
      res.json({ message: 'Book deleted successfully' });
    }
  });
});

// Create new order
app.post('/api/orders', (req, res) => {
  const { customer_name, customer_email, customer_address, customer_mobile, ordered_books, total_amount } = req.body;
  if (!customer_name || !customer_email || !customer_address || !customer_mobile || !ordered_books || !total_amount) {
    return res.status(400).json({ message: 'All customer details and order information are required' });
  }
  db.query('INSERT INTO orders (customer_name, customer_email, customer_address, customer_mobile, ordered_books, total_amount) VALUES (?, ?, ?, ?, ?, ?)', 
    [customer_name, customer_email, customer_address, customer_mobile, JSON.stringify(ordered_books), total_amount], (err, result) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      res.status(201).json({ id: result.insertId, message: 'Order placed successfully' });
    }
  });
});

// Get all orders (for admin)
app.get('/api/orders', (req, res) => {
  db.query('SELECT * FROM orders', (err, results) => {
    if (err) {
      res.status(500).json({ error: err.message });
    } else {
      // Parse ordered_books JSON
      const orders = results.map(order => {
        console.log('Raw ordered_books for order', order.id, ':', order.ordered_books, 'Type:', typeof order.ordered_books);
        if (!order.ordered_books) {
          return {
            ...order,
            ordered_books: []
          };
        }
        if (Array.isArray(order.ordered_books)) {
          // Already parsed
          return order;
        }
        try {
          const parsed = JSON.parse(order.ordered_books);
          console.log('Parsed successfully:', parsed);
          return {
            ...order,
            ordered_books: parsed
          };
        } catch (e) {
          console.error('Error parsing ordered_books for order', order.id, ':', order.ordered_books, 'Error:', e.message);
          return {
            ...order,
            ordered_books: []
          };
        }
      });
      res.json(orders);
    }
  });
});

app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});