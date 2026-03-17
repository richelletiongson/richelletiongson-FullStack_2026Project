-- Horoscope 2026 – PostgreSQL schema
-- Categories: Love, Money, Career, Family, Health
-- Months: 1–12 (month_id), year 2026

CREATE TABLE IF NOT EXISTS months (
  month_id INTEGER PRIMARY KEY,
  name TEXT NOT NULL
);

INSERT INTO months (month_id, name) VALUES
  (1, 'January'), (2, 'February'), (3, 'March'), (4, 'April'),
  (5, 'May'), (6, 'June'), (7, 'July'), (8, 'August'),
  (9, 'September'), (10, 'October'), (11, 'November'), (12, 'December')
ON CONFLICT (month_id) DO NOTHING;

CREATE TABLE IF NOT EXISTS zodiac_predictions_2026 (
  id SERIAL PRIMARY KEY,
  sign TEXT NOT NULL,
  month_id INTEGER NOT NULL CHECK (month_id >= 1 AND month_id <= 12),
  category TEXT NOT NULL,
  prediction TEXT NOT NULL,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_zodiac_sign_month
  ON zodiac_predictions_2026 (sign, month_id);
CREATE INDEX IF NOT EXISTS idx_zodiac_category
  ON zodiac_predictions_2026 (category);
CREATE INDEX IF NOT EXISTS idx_zodiac_sign
  ON zodiac_predictions_2026 (sign);
