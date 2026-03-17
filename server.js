/**
 * Horoscope 2026 – Express server with EJS and PostgreSQL.
 * Run: npm run dev  (or set PORT in .env)
 */
require('dotenv').config();
const path = require('path');
const express = require('express');
const expressLayouts = require('express-ejs-layouts');
const routes = require('./routes');

const app = express();
const PORT = process.env.PORT || 3000;

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'views'));
app.set('layout', 'layout');
app.use(expressLayouts);

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));

app.use(routes);

app.use((req, res) => {
  res.status(404).render('404', { title: 'Not Found' });
});

app.use((err, req, res, next) => {
  console.error(err);
  res.status(500).send('Server error');
});

app.listen(PORT, () => {
  console.log(`Horoscope 2026 running at http://localhost:${PORT}`);
});
