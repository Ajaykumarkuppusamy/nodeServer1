const express = require('express');
const mysql = require('mysql2');
const cors = require('cors');

const app = express();
const port = process.env.PORT || 3000;

app.use(cors());
app.use(express.json());


const db = mysql.createConnection({
  host: 'bc6oadc6aw2sqbbvxcr4-mysql.services.clever-cloud.com',
  user: 'uedtlzzs0joaxx8v',
  password: 'wVznv4HvzvWmayYKyDi9',
  database: 'bc6oadc6aw2sqbbvxcr4',
});

app.get("/",(req,res)=>{return res.status(200).json({success:'ok'})});
app.post('/signup', async (req, res) => {
    try {
      const { username, email, password, accountType } = req.body;
  
      const insertUserQuery = 'INSERT INTO userInfo (email, password, accountType) VALUES ( ?, ?, ?)';
      const [result] = await db.promise().execute(insertUserQuery, [email, password, accountType]);
  
      res.status(201).json({ message: 'User registered successfully' });
    } catch (error) {
      console.error(error);
      res.status(500).json({ error: 'Internal Server Error' });
    }
  });
  
  app.post('/login', (req, res) => {
    const { email, password, accountType } = req.body;
    if (!email || !password || !accountType) {
      return res.status(400).json({ message: 'Email, password, and accountType are required.' });
    }

    const query = 'SELECT * FROM userInfo WHERE email = ? AND password = ? AND accountType = ?';

    db.query(query, [email, password, accountType], (err, results) => {
      if (err) {
        console.error(err);
        return res.status(500).json({ message: 'Internal server error' });
      }
      if (results.length === 0) {
        return res.status(401).json({ message: 'Invalid email, password, or account type' });
      }
      const user = results[0];
      return res.status(200).json({ message: 'Login successful', user });
    });
  });

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
