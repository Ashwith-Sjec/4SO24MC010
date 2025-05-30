require('dotenv').config();
const express = require('express');
const app = express();
const cors = require('cors');
const PORT = process.env.PORT || 4000;

app.use(cors());
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

app.get('/stockcorrelation', require('./src/routes/productRoute'))

 http://hostname/stockcorrelation?minutes=m&ticker={NVDA}&ticker={PYPL}

app.get('/', (req, res) => {
    res.send("hey ready to serve");
})

app.listen(PORT, () => {
    console.log(`Server is listening at port ${PORT}`);
})
