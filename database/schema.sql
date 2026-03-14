-- Horoscope 2026: Zodiac predictions schema
-- Categories: Love, Money, Career, Family, Health
-- Months: 1-12 (month_id), year implied as 2026

CREATE TABLE IF NOT EXISTS zodiac_predictions_2026 (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  sign TEXT NOT NULL,
  month_id INTEGER NOT NULL CHECK (month_id >= 1 AND month_id <= 12),
  category TEXT NOT NULL,
  prediction TEXT NOT NULL,
  created_at TEXT DEFAULT (datetime('now'))
);

CREATE INDEX IF NOT EXISTS idx_zodiac_sign_month 
  ON zodiac_predictions_2026 (sign, month_id);
CREATE INDEX IF NOT EXISTS idx_zodiac_category 
  ON zodiac_predictions_2026 (category);
CREATE INDEX IF NOT EXISTS idx_zodiac_sign 
  ON zodiac_predictions_2026 (sign);

-- Optional: month names for display
CREATE TABLE IF NOT EXISTS months (
  month_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);
INSERT OR IGNORE INTO months (month_id, name) VALUES
  (1, 'January'), (2, 'February'), (3, 'March'), (4, 'April'),
  (5, 'May'), (6, 'June'), (7, 'July'), (8, 'August'),
  (9, 'September'), (10, 'October'), (11, 'November'), (12, 'December');
