"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
if (process.env.NODE_ENV !== 'production') {
    require('dotenv').config();
}
const express_1 = __importDefault(require("express"));
const fs_1 = __importDefault(require("fs"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const passport_1 = __importDefault(require("passport"));
const express_flash_1 = __importDefault(require("express-flash"));
const express_session_1 = __importDefault(require("express-session"));
const method_override_1 = __importDefault(require("method-override"));
const app = (0, express_1.default)();
app.set('view engine', 'ejs');
app.use(express_1.default.static('public'));
app.use(express_1.default.urlencoded({ extended: false }));
app.use((0, express_flash_1.default)());
app.use((0, express_session_1.default)({
    // @ts-ignore
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}));
app.use(passport_1.default.initialize());
app.use(passport_1.default.session());
app.use((0, method_override_1.default)('_method'));
const port = process.env.PORT || 5000;
const user_data = JSON.parse(fs_1.default.readFileSync('./json/users.json', 'utf-8'));
const case_data = JSON.parse(fs_1.default.readFileSync('./json/cases.json', 'utf-8'));
const initializePassport = require('./passport-config');
initializePassport(passport_1.default, 
// @ts-ignore
username => user_data.find(user => user.username === username), 
// @ts-ignore
id => user_data.find(user => user.id === id));
function checkAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return next();
    }
    res.redirect('/login');
}
function checkNotAuthenticated(req, res, next) {
    if (req.isAuthenticated()) {
        return res.redirect('/');
    }
    next();
}
//#region Main Request
app.get('/', checkAuthenticated, (req, res) => {
    res.redirect('/home');
});
app.get('/home', checkAuthenticated, (req, res) => {
    res.render('home', { title: 'Utama', user_data: req.user });
});
app.get('/stats', checkAuthenticated, (req, res) => {
    res.render('stats', { title: 'Informasi', user_data });
});
app.get('/upgrade', checkAuthenticated, (req, res) => {
    res.render('upgrade', { title: 'Peningkatan', user_data });
});
app.get('/history', checkAuthenticated, (req, res) => {
    res.render('history', { title: 'Berita', user_data });
});
app.get('/setting', checkAuthenticated, (req, res) => {
    res.render('setting', { title: 'Pengaturan', user_data });
});
//#endregion Main Request
//#region Authentication Request
app.get('/login', checkNotAuthenticated, (req, res) => {
    res.render('login', { title: 'Login' });
});
app.post('/login', checkNotAuthenticated, passport_1.default.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));
app.get('/register', checkNotAuthenticated, (req, res) => {
    res.render('register', { title: 'Register' });
});
app.post('/register', checkNotAuthenticated, (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 12);
        let random_case_max = Math.ceil(Math.random() * 5);
        if (random_case_max == 1 || random_case_max == 2) {
            random_case_max = 3;
        }
        ;
        user_data.push({
            "id": 2,
            "username": req.body.username,
            "password": hashedPassword,
            "people_current": 50,
            "people_max": 100,
            "prosperity_current": 50,
            "prosperity_max": 100,
            "crime_rate_current": 50,
            "crime_rate_max": 100,
            "money_current": 50,
            "money_max": 100,
            "current_day": 1,
            "total_crime_case": 1,
            "crime_case": [
                {
                    "day": 1,
                    "case_current": 1,
                    "case_max": random_case_max,
                    "case": [
                        {
                            "case_id": 1,
                            "case_theme": [1, 2, 3],
                            "case_name": "name1",
                            "case_age": "age1",
                            "case_done": false
                        }
                    ]
                }
            ]
        });
        res.redirect('/login');
    }
    catch (_a) {
        res.redirect('/register');
    }
    console.log(user_data);
}));
app.get('/logout', checkAuthenticated, (req, res) => {
    res.render('logout', { title: 'Logout' });
});
app.delete('/logout', checkAuthenticated, (req, res) => {
    req.logOut();
    res.redirect('/login');
});
//#endregion Authentication Request
app.listen(port, () => { console.log(`Listening in http://localhost:${port}`); });
