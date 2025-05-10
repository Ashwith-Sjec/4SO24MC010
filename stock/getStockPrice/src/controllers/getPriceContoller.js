const { default: axios } = require("axios");

const token = "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJNYXBDbGFpbXMiOnsiZXhwIjoxNzQ2ODcyNDE4LCJpYXQiOjE3NDY4NzIxMTgsImlzcyI6IkFmZm9yZG1lZCIsImp0aSI6IjM4OTg2MGVmLTM3MjAtNGJiNC1hMTg5LWVjMzFiYjE4MWNhZSIsInN1YiI6IjI0Y2EwMDEwLmFzaHdpdGhAc2plYy5hYy5pbiJ9LCJlbWFpbCI6IjI0Y2EwMDEwLmFzaHdpdGhAc2plYy5hYy5pbiIsIm5hbWUiOiJhc2h3aXRoIGEgc2FsaWFuIiwicm9sbE5vIjoiNHNvMjRtYzAxMCIsImFjY2Vzc0NvZGUiOiJLakpBeFAiLCJjbGllbnRJRCI6IjM4OTg2MGVmLTM3MjAtNGJiNC1hMTg5LWVjMzFiYjE4MWNhZSIsImNsaWVudFNlY3JldCI6ImhYVlF6WVphaGJxVXZqWVYifQ.E4Xb_WeKiMcwD0c6Us6Yh5JdFf0KhTX0PyM2ryqmpGg"

const getPrice = async (req, res) => {
    try {
        const { ticker } = req.params
        const { minutes, aggregation } = req.query;

        if (!ticker) {
            return res.status(400).json({ message: "There is ticker" });
        }

        if (!minutes || !aggregation) {
            return res.status(400).json({ message: "There is minutes or aggration" });
        }

        let response = axios.get(`http://20.244.56.144/evaluation-service/stocks/${ticker}?minutes=${minutes}`, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response) {
            return res.status(400).json({ message: "Cannoot find for this" });
        }

        if (response.status == 401 && response.data.message === 'Invalid authorization token') {
            const getToken = axios.post(`http://20.244.56.144/evaluation-service/auth`, {
                "email": "24ca0010.ashwith@sjec.ac.in",
                "name": "ashwith a salian",
                "rollNo": "4so24mc010",
                "accessCode": "KjJAxP",
                "clientID": "389860ef-3720-4bb4-a189-ec31bb181cae",
                "clientSecret": "hXVQzYZahbqUvjYV"
            });

            token = getToken.data.access_token;

            response = axios.get(`http://20.244.56.144/evaluation-service/stocks/${ticker}?minutes=${minutes}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

        }

        const stock = response.data;

        let averageprice = 0;
        let count = 0;

        stock.array.forEach(element => {
            averageprice += element.price;
            count++;
        });

        averageprice = averageprice / count;

        return res.status(200).json({ averageprice, stock });

    } catch (error) {
        console.error("Error while getPrice:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { getPrice }