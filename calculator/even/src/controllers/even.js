const { axios } = require("axios");
const jwt = require('jsonwebtoken');
const GetNumsApi = process.env.GetNumsApi || "http://20.244.56.144/evaluation-service/fibo";
const currentSet = new Set();
const maxSize = 10;
let token;
let avg = 0;

const addSetItem = (value) => {
    if (!currentSet.has(value) && (value % 2 === 0)) {
        if (currentSet.size >= maxSize) {
            currentSet.delete(currentSet.values().next().value);
        }
        currentSet.add(value);
        avg += value;
    }
}

const EvenSet = async (req, res) => {
    try {

        let response = await axios.get(`${GetNumsApi}`, { timeout: 500 }, {
            headers: {
                'Authorization': `Bearer ${token}`,
            }
        });

        if (!response) {
            return res.status(400).json({ message: "Could not get the numbers from external API" });
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

            response = axios.get(`${GetNumsApi}`, {
                headers: {
                    'Authorization': `Bearer ${token}`,
                }
            });

        }

        const newNums = response.body.numbers;

        const currentoldSet = [...currentSet];

        newNums.forEach(element => {
            addSetItem(element);
        });

        return res.status(200).json({ windowPrevState: currentoldSet, windowCurrState: newNums, numbers: [...currentSet], avg: avg / currentSet.size });

    } catch (error) {
        console.error("Error while functionName:", error);
        return res.status(500).json({ message: 'Internal server error' });
    }
}

module.exports = { EvenSet }