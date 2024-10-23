const express = require('express');

const app = express();

app.listen(3000);
app.set('view engine', 'ejs');
app.use(express.static(__dirname));

const masyvas = [
    {title: "Sutvarkyti kambarius", id: 1, author: "Tautvydas", status: "done"},
    {title: "Kitas darbas", author: "Tautvydas", id: 2,  status: "in progress"},
    {author: "Tautvydas", title: "Trecias darbas", id: 3, status: "todo"},
];

app.get('/', (req, res) => { res.render('index',{duomenys: masyvas, title: "Home"} )});
app.get('/about', (req, res) => {  res.render('about', {title: "About us"})});
app.get('/apie-mane', (req, res) => {  res.redirect('about')});
app.get('/slapta-info', (req, res) => {  res.redirect('about')});
app.use((req, res) => { res.status(404).render('404', {title: "404"})});
