const express = require('express');
const axios = require('axios');
const app = express();

app.set('view engine', 'pug');
app.use(express.static(__dirname + '/public'));
app.use(express.urlencoded({ extended: true }));
app.use(express.json());

const PRIVATE_APP_ACCESS = '';

app.get('/', async (req, res) => {
    const f1_drivers = 'https://api.hubspot.com/crm/v3/objects/2-144467238';
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    }
    const params = {
        properties: ['Name', 'Team', 'Wins'].join(',')
    }
    try {
        const resp = await axios.get(f1_drivers, { headers, params });
        const data = resp.data.results;
        res.render('homepage', { title: 'Custom Object Table', data });      
    } catch (error) {
        console.error(error);
    }
});

app.get('/update-cobj', (req, res) => {
    res.render('updates', { 
        title: 'Update Custom Object Form | Integrating With HubSpot I Practicum' 
    });
});

app.post('/update-cobj', async (req, res) => {
    const api_url = `https://api.hubapi.com/crm/v3/objects/2-144467238`;
    const headers = {
        Authorization: `Bearer ${PRIVATE_APP_ACCESS}`,
        'Content-Type': 'application/json'
    };

    const new_f1_driver_data = {
        properties: {
            name: req.body.name,
            team: req.body.team,
            wins: req.body.wins
        }
    };

    try {
        await axios.post(api_url, new_f1_driver_data, { headers });
        res.redirect('/');
    } catch (error) {
        console.error("Error creating F1 Driver:", error.response?.data || error.message);
        res.status(500).send("Error creating F1 Driver");
    }
});

app.listen(3000, () => console.log('Listening on http://localhost:3000'));