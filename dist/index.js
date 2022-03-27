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
const list_of_names = ["Dwi", "Nur", "Dewi", "Tri", "Dian", "Sri", "Putri", "Eka", "Sari", "Ayu", "Wahyu", "Indah", "Siti", "Ika", "Agus", "Fitri", "Ratna", "Andi", "Agung", "Ahmad", "Kurniawan", "Budi", "Adi", "Eko", "Nurul", "Putra", "Arif", "Puspita", "Ari", "Indra", "Dyah", "Rizki", "Maria", "Ratih", "Pratiwi", "Kartika", "Wulandari", "Fajar", "Bayu", "Lestari", "Anita", "Muhamad", "Kusuma", "Rahmawati", "Fitria", "Retno", "Kurnia", "Novita", "Aditya", "Ria", "Nugroho", "Putu", "Handayani", "Rahayu", "Yunita", "Rina", "Ade", "Widya", "Intan", "Diah", "Agustina", "Made", "Abdul", "Setiawan", "Rizky", "Rini", "Wahyuni", "Yulia", "Maya", "Puji", "Utami", "Amalia", "Dina", "Devi", "Citra", "Arief", "Bagus", "Hidayat", "Hendra", "Eva", "Endah", "Raden", "Novi", "Astuti", "Irma", "Achmad", "Aulia", "Surya", "Amelia", "Prima", "Angga", "Hadi", "Diana", "Anggraini", "Wulan", "Saputra", "Yuni", "Prasetyo", "Reza", "Suci"];
const user_data = JSON.parse(fs_1.default.readFileSync('./json/users.json', 'utf-8'));
const case_data = JSON.parse(fs_1.default.readFileSync('./json/cases.json', 'utf-8'));
const initializePassport = require('./passport-config');
initializePassport(passport_1.default, 
// @ts-ignore
username => user_data.find(user => user.username === username), 
// @ts-ignore
id => user_data.find(user => user.id === id));
//#region Functions
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
function getRandomNumber(min, max) {
    max += 1;
    let value = Math.floor(Math.random() * (max - min) + min);
    if (value == max) {
        value -= 1;
    }
    return value;
}
function getRandomCaseTheme(random_case_theme, case_rank) {
    let random_case_number = getRandomNumber(0, case_data.length - 1);
    return random_case_number;
}
//#endregion Functions
//#region Main Request
app.get('/', checkAuthenticated, (req, res) => {
    res.redirect('/home');
});
app.get('/home', checkAuthenticated, (req, res) => {
    res.render('home', { title: 'Utama', user_data: req.user });
});
app.get('/stats', checkAuthenticated, (req, res) => {
    res.render('stats', { title: 'Informasi', user_data: req.user });
});
app.get('/upgrade', checkAuthenticated, (req, res) => {
    res.render('upgrade', { title: 'Peningkatan', user_data: req.user });
});
app.get('/history', checkAuthenticated, (req, res) => {
    res.render('history', { title: 'Berita', user_data: req.user });
});
app.get('/setting', checkAuthenticated, (req, res) => {
    res.render('setting', { title: 'Pengaturan', user_data: req.user });
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
    let username_is_valid = true;
    for (let i = 0; i < user_data.length; i++) {
        if (String(req.body.username) == user_data[i].username) {
            username_is_valid = false;
            break;
        }
    }
    ;
    if (username_is_valid) {
        const temp_case_status = getRandomNumber(0, 3);
        const hashedPassword = yield bcrypt_1.default.hash(req.body.password, 12);
        const random_case_max = getRandomNumber(3, 5);
        const random_case_name = list_of_names[getRandomNumber(0, 99)];
        const random_case_age = getRandomNumber(19, 78);
        let case_is_guilty;
        if (temp_case_status == 0) {
            case_is_guilty = false;
        }
        else if (temp_case_status == 1 || temp_case_status == 2 || temp_case_status == 3) {
            case_is_guilty = true;
        }
        let random_case_theme = [];
        let case_rank = [];
        if (!case_is_guilty) {
            let random_case_number = getRandomCaseTheme(random_case_theme, case_rank);
            random_case_theme.push(case_data[random_case_number]);
            case_rank.push(case_data[random_case_number].rank);
        }
        else if (case_is_guilty) {
            let random_case_number = [];
            for (let i = 0; i < 4; i++) {
                let temp_random_case_number = getRandomCaseTheme(random_case_theme, case_rank);
                let random_case_number_is_valid = true;
                for (let j = 0; j < random_case_number.length; j++) {
                    if (temp_random_case_number == random_case_number[j]) {
                        random_case_number_is_valid = false;
                    }
                }
                if (random_case_number_is_valid) {
                    random_case_number.push(temp_random_case_number);
                }
                else if (!random_case_number_is_valid) {
                    i -= 1;
                }
            }
            let random_case_theme_value_range = getRandomNumber(1, 100);
            let case_theme_range = [0, 25, 50, 75];
            for (let i = 0; i < random_case_number.length; i++) {
                if (random_case_theme_value_range > case_theme_range[i]) {
                    random_case_theme.push(case_data[random_case_number[i]]);
                    case_rank.push(case_data[random_case_number[i]].rank);
                }
            }
        }
        user_data.push({
            "id": user_data.length + 1,
            "username": String(req.body.username),
            "password": hashedPassword,
            "people_current": 50,
            "people_max": 100,
            "prosperity_current": 50,
            "prosperity_max": 100,
            "crime_rate_current": 50,
            "crime_rate_max": 100,
            "money_current": 50,
            "money_max": 100,
            "crime_case": [
                {
                    "day": 1,
                    "case_current": 1,
                    "case_max": random_case_max,
                    "case": [
                        {
                            "case_id": 1,
                            "case_theme": random_case_theme,
                            "case_name": random_case_name,
                            "case_age": random_case_age,
                            "case_is_guilty": case_is_guilty,
                            "crime_rank": Math.max.apply(null, case_rank),
                            "case_done": false
                        }
                    ]
                }
            ]
        });
        fs_1.default.writeFileSync('./json/users.json', JSON.stringify(user_data, null, 4));
        res.redirect('/login');
    }
    else if (!username_is_valid) {
        req.flash('info', 'Username already taken');
        res.redirect('/register');
    }
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
