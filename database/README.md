# Horoscope 2026 – SQL Database

SQLite database for the horoscope prediction website. Data is organized by **sign**, **month** (March–December 2026), and **category**.

## Tables

### `zodiac_predictions_2026`
| Column     | Type    | Description                          |
|-----------|---------|--------------------------------------|
| id        | INTEGER | Primary key (auto)                   |
| sign      | TEXT    | Zodiac sign (e.g. Aries, Leo)       |
| month_id  | INTEGER | 1–12 (3 = March … 12 = December)    |
| category  | TEXT    | Love, Money, Career, Family, Health  |
| prediction| TEXT    | Prediction content                   |

### `months`
Lookup table for month names (January … December).

## Categories
- **Love** – Romance, relationships  
- **Money** – Finances, income, investments  
- **Career** – Work, professional life  
- **Family** – Home, relatives, household  
- **Health** – Well-being, fitness, habits  

## Setup

### Option 1: SQLite CLI (if installed)
```bash
cd database
sqlite3 horoscope.db < schema.sql
sqlite3 horoscope.db < seed_fire_signs.sql
sqlite3 horoscope.db < seed_earth_signs.sql
sqlite3 horoscope.db < seed_air_signs.sql
sqlite3 horoscope.db < seed_water_signs.sql
```

### Option 2: Node script (recommended)
From project root:
```bash
npm install
npm run db:init
```
This creates `database/horoscope.db` and loads schema + all four element seed files (fire, earth, air, water).

### Option 3: PostgreSQL / MySQL
Use `schema.sql` and `seed_fire_signs.sql` as a reference. You may need to:
- Replace `AUTOINCREMENT` with `SERIAL` (PostgreSQL) or `AUTO_INCREMENT` (MySQL).
- Replace `datetime('now')` with `CURRENT_TIMESTAMP` or equivalent.
- Run the seed file with your client.

## Query examples

```sql
-- All predictions for Aries in March
SELECT category, prediction FROM zodiac_predictions_2026
WHERE sign = 'Aries' AND month_id = 3;

-- Love predictions for Leo, all months
SELECT m.name AS month, prediction FROM zodiac_predictions_2026 z
JOIN months m ON z.month_id = m.month_id
WHERE z.sign = 'Leo' AND z.category = 'Love'
ORDER BY z.month_id;

-- Single prediction by sign, month, category
SELECT prediction FROM zodiac_predictions_2026
WHERE sign = 'Sagittarius' AND month_id = 7 AND category = 'Career';
```

## Current data
- **Fire signs:** Aries, Leo, Sagittarius (March–December 2026, all 5 categories).  
- **Earth signs:** Taurus, Virgo, Capricorn (March–December 2026, all 5 categories).  
- **Air signs:** Gemini, Libra, Aquarius (March–December 2026, all 5 categories).  
- **Water signs:** Cancer, Scorpio, Pisces (March–December 2026, all 5 categories).  

All 12 zodiac signs are now included.
