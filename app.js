const express = require('express');
const bodyParser = require('body-parser');
const connectDB = require('./db/connectDB');
const authRoutes = require('./routes/authRoutes');

const app = express();
const port = 3000;

app.use(bodyParser.urlencoded({ extended: true }));
app.set('view engine', 'ejs');
app.use(express.static('public'));

app.use('/', authRoutes);

const start = async () => {
    try {
      await connectDB();
      app.listen(port, () =>
        console.log(`Server running at http://127.0.0.1:${port}/`)
      );
    } catch (error) {
      console.log(error);
    }
  };
  
start();