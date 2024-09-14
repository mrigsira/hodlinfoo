const express = require('express');
const axios = require('axios');
const { Pool } = require('pg');

const app = express();
const port = 3000;

// Database connection
const pool = new Pool({
  user: 'postgres',  // Replace with your PostgreSQL username
  host: 'localhost',
  database: 'mriga',
  // Replace with your PostgreSQL password
  port: 5432,
});

// Fetch data from WazirX API and store in PostgreSQL
const fetchAndStoreData = async () => {
  try {
    const response = await axios.get('https://api.wazirx.com/api/v2/tickers');
    const data = response.data;
    const top10 = Object.values(data).slice(0, 10);  // Get the top 10

    await pool.query('TRUNCATE TABLE cryptos');  // Clear previous data

    top10.forEach(async (crypto) => {
      const { name, last, buy, sell, volume, base_unit } = crypto;
      await pool.query(
        'INSERT INTO cryptos (name, last, buy, sell, volume, base_unit) VALUES ($1, $2, $3, $4, $5, $6)',
        [name, last, buy, sell, volume, base_unit]
      );
    });
    console.log('Top 10 cryptos data stored.');
  } catch (error) {
    console.error('Error fetching and storing data:', error);
  }
};

// Fetch data every 5 minutes
setInterval(fetchAndStoreData, 5 * 60 * 1000);

// Endpoint to get the data from the database
app.get('/cryptos', async (req, res) => {
  try {
    const result = await pool.query('SELECT * FROM cryptos');
    res.json(result.rows);
  } catch (err) {
    res.status(500).send('Error fetching data from database');
  }
});

// Serve the frontend
app.use(express.static('public'));

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
  fetchAndStoreData();  // Fetch data when the server starts
});
