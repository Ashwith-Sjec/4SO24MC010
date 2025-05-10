require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const { getPrice } = require('./src/controllers/getPriceContoller');
const PORT = process.env.PORT || 4001;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/stocks/:ticker', getPrice)

app.get('/', (req, res) => {
    res.send("hey ready to serve");
})

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
})
