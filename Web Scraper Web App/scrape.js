const request = require('request');
const cheerio = require('cheerio');
const fs = require('fs');
const stream = fs.createWriteStream('posts.csv');

stream.write(`Post, Summary, Read \n`);

request('https://dasgupta-test.000webhostapp.com', (error, response, html) => {
    if(!error && response.statusCode == 200) {
        const $ = cheerio.load(html);

        $('.card').each((index, element) => {
            const alias = $(element).find('.card-title').text();
            const gist = $(element).find('.card-text').text();
            const resource = $(element).find('a').attr('href');

            stream.write(`${alias}, ${gist}, ${resource} \n`);
        });
    }
});