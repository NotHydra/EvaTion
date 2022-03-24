"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.use(express_1.default.static('public'));
// app.use(express.urlencoded({ extended:false }));
const port = process.env.PORT || 5000;
const list_of_page_attribute = [
    ['home', 'fa-home'],
    ['stats', 'fa-bars-progress'],
    ['upgrade', 'fa-angles-up'],
    ['history', 'fa-list-ul'],
    ['setting', 'fa-gear']
];
const list_of_stat_attribute = [
    ['People', 'fa-user-group', 'info'],
    ['Prosperity', 'fa-face-smile', 'success'],
    ['Crime Rate', 'fa-radiation', 'danger'],
    ['Money', 'fa-coins', 'warning']
];
app.get('/', (req, res) => {
    res.redirect('/home');
});
app.get('/home', (req, res) => {
    res.render('home', { title: 'Home', list_of_page_attribute, list_of_stat_attribute });
});
app.get('/stats', (req, res) => {
    res.render('stats', { title: 'Stats', list_of_page_attribute });
});
app.get('/upgrade', (req, res) => {
    res.render('upgrade', { title: 'Upgrade', list_of_page_attribute });
});
app.get('/history', (req, res) => {
    res.render('history', { title: 'History', list_of_page_attribute });
});
app.get('/setting', (req, res) => {
    res.render('setting', { title: 'Setting', list_of_page_attribute });
});
app.listen(port, () => { console.log(`Listening in http://localhost:${port}`); });
