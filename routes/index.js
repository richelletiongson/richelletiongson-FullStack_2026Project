/**
 * Express routes: home, forecast, sign detail.
 */
const express = require('express');
const db = require('../lib/db');

const router = express.Router();
const SIGNS = [
  'Aries', 'Taurus', 'Gemini', 'Cancer', 'Leo', 'Virgo',
  'Libra', 'Scorpio', 'Sagittarius', 'Capricorn', 'Aquarius', 'Pisces',
];
const CATEGORIES = [
  { value: 'Love', label: 'love' },
  { value: 'Money', label: 'money' },
  { value: 'Career', label: 'career' },
  { value: 'Family', label: 'family' },
  { value: 'Health', label: 'health' },
];

router.get('/', async (req, res, next) => {
  try {
    const months = await db.getMonths();
    res.render('index', {
      title: 'Horoscope 2026',
      months: months.filter((m) => m.month_id >= 3),
      signs: SIGNS,
      categories: CATEGORIES,
    });
  } catch (e) {
    next(e);
  }
});

router.get('/forecast', async (req, res, next) => {
  try {
    const sign = req.query.sign || '';
    const category = req.query.category || '';
    const monthId = req.query.month_id ? parseInt(req.query.month_id, 10) : NaN;

    const months = await db.getMonths();
    const monthMap = new Map(months.map((m) => [m.month_id, m.name]));
    const monthName = monthMap.get(monthId) || '';

    let prediction = null;
    if (sign && category && !Number.isNaN(monthId)) {
      prediction = await db.getPrediction(sign, monthId, category);
    }

    res.render('forecast', {
      title: 'Your forecast',
      sign,
      category,
      monthId,
      monthName,
      prediction,
    });
  } catch (e) {
    next(e);
  }
});

router.get('/sign/:sign', async (req, res, next) => {
  try {
    const sign = decodeURIComponent(req.params.sign);
    const [months, allPredictions] = await Promise.all([
      db.getMonths(),
      db.getPredictionsForSignMonth(sign, null),
    ]);

    if (allPredictions.length === 0) {
      return res.status(404).render('404', { title: 'Not Found', message: 'Sign not found' });
    }

    const monthIds = [...new Set(allPredictions.map((p) => p.month_id))].sort((a, b) => a - b);
    const monthMap = new Map(months.map((m) => [m.month_id, m.name]));

    const byMonth = monthIds.map((monthId) => {
      const monthName = monthMap.get(monthId) || `Month ${monthId}`;
      const predictions = allPredictions.filter((p) => p.month_id === monthId);
      const byCategory = {};
      predictions.forEach((p) => {
        byCategory[p.category] = p.prediction;
      });
      return { monthId, monthName, byCategory };
    });

    res.render('sign', {
      title: `${sign} 2026`,
      sign,
      byMonth,
      categories: ['Love', 'Money', 'Career', 'Family', 'Health'],
    });
  } catch (e) {
    next(e);
  }
});

module.exports = router;
