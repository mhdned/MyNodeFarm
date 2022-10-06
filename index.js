const express = require('express');
const app = express();
const port = 8600;

// const http = require('http');
const fs = require('node:fs');
const url = require('url');
const slugify = require('slugify');
const replaceTemplate = require('./modules/replaceTemplate');

// SERVER
const tempOverview = fs.readFileSync(
  `${__dirname}/templates/template-overview.html`,
  'utf-8'
);
const tempCard = fs.readFileSync(
  `${__dirname}/templates/template-card.html`,
  'utf-8'
);
const tempProduct = fs.readFileSync(
  `${__dirname}/templates/template-product.html`,
  'utf-8'
);

const data = fs.readFileSync(`${__dirname}/dev-data/data.json`, 'utf-8');
const dataObj = JSON.parse(data);
const slugs = dataObj.map((el) => slugify(el.productName, { lower: true }));
// console.log(slugs);

app.get('/', (req, res) => {
  res.writeHead(200, {
    'Content-type': 'text/html',
  });
  const cardsHtml = dataObj.map((el) => replaceTemplate(tempCard, el)).join('');
  const output = tempOverview.replace('{%PRODUCT_CARDS%}', cardsHtml);
  res.end(output);
});
app.get('/product', (req, res) => {
  const { query } = url.parse(req.url, true);
  res.writeHead(200, {
    'Content-type': 'text/html',
  });
  const product = dataObj[query.id];
  const output = replaceTemplate(tempProduct, product);
  res.end(output);
});
app.get('/api', (req, res) => {
  res.writeHead(200, {
    'Content-type': 'application/json',
  });
  res.end(data);
});

app.use((req, res, next) => {
  res.write(fs.readFileSync(`${__dirname}/templates/404.html`, 'utf-8'));
  res.end();
});

app.listen(port, () => {
  console.log(`App is run on : http://localhost:${port}`);
});
