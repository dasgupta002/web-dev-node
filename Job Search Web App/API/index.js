const server = require('http').createServer;
const dotenv = require('dotenv');
dotenv.config();
const url = require('url');
const axios = require('axios');
const chalk = require('chalk');
const config = require('./config');

const headers = {
    'Content-Type': 'application/json',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET',
};

const decodeParams = searchParams => Array
      .from(searchParams.keys())
      .reduce((acc, key) => ({ ...acc, [key]: searchParams.get(key) }), {});

const devserver = server((req, res) => {
    const request = url.parse(req.url);
    const sanitizedParams = decodeParams(new URLSearchParams(request.search));
    const { search, location, country = "gb" } = sanitizedParams;
    const targetURL = `${config.BASE_URL}/${country.toLowerCase()}/${config.BASE_PARAMS}&app_id=${config.APP_ID}&app_key=${config.API_KEY}&what=${search}&where=${location}`;
    
    if(req.method === 'GET') {
        axios.get(targetURL)
             .then(response => {
                 res.writeHead(200, headers);
                 res.end(JSON.stringify(response.data));
             }).catch((error) => console.log(error.message)); 
    }
});       

devserver.listen(60);