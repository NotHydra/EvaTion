"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.use(express_1.default.static('public'));
// app.use(express.urlencoded({ extended:false }));
const port = process.env.PORT || 5000;
const user_data = JSON.parse(fs_1.default.readFileSync('./json/users.json', 'utf-8'));
const case_data = JSON.parse(fs_1.default.readFileSync('./json/cases.json', 'utf-8'));
app.get('/', (req, res) => {
    res.redirect('/home');
});
app.get('/home', (req, res) => {
    res.render('home', { title: 'Utama', user_data });
});
app.get('/stats', (req, res) => {
    res.render('stats', { title: 'Informasi', user_data });
});
app.get('/upgrade', (req, res) => {
    res.render('upgrade', { title: 'Peningkatan', user_data });
});
app.get('/history', (req, res) => {
    res.render('history', { title: 'Berita', user_data });
});
app.get('/setting', (req, res) => {
    res.render('setting', { title: 'Pengaturan', user_data });
});
app.listen(port, () => { console.log(`Listening in http://localhost:${port}`); });
