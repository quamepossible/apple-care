const express = require('express');
const path = require('path');
const methodOverride = require('method-override');
let data = require('./data.js');
const app = express();

app.set('view engine', 'ejs')
app.set('views', path.join(__dirname, 'views/'))

// middlewares
app.use(express.static('static'));
app.use(methodOverride('_method'))
app.use(express.urlencoded({extended: true}))

app.get('/', (req, res) => {
    res.render('home', {data})
})

app.get('/add', (req, res) => {
    res.render('add')
})

app.post('/add', (req, res) => {
    const {fname:FULL_NAME, uname:USERNAME, region:REGION, city:CITY, company:COMPANY_NAME, insta:INSTAGRAM, whatsapp:WHATSAPP, phone:PHONE, website:WEBSITE} = req.body;
    const newUser = {FULL_NAME, USERNAME, REGION, CITY, COMPANY_NAME, INSTAGRAM, WHATSAPP, PHONE, WEBSITE, WORKING_DAYS: 'Mon - Sun'}
    data.push(newUser);
    res.redirect('/')
})

app.get('/user/:user', (req, res) => {
    const {user} = req.params;
    const clickedUser = data.find(u => u.USERNAME === user);
    if(!clickedUser) res.redirect('/');
    res.render('user', clickedUser);
})

app.delete('/user/:user', (req, res) => {
    const {user} = req.params;
    data = data.filter(u => u.USERNAME !== user);
    res.redirect('/')
})

app.get('*', (req, res) => {
    res.send("The url requested is not found ❌")
})

app.listen(3000, () => {
    console.log('Server started on port 3000');
})
