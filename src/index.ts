if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config();
};

import express, { Application, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import bcrypt from 'bcrypt';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import methodOverride from 'method-override';
import alea from 'alea';

const app: Application = express();
const prng: any = new (alea as any)();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(flash());
// @ts-ignore
app.use(session({ secret: process.env.SESSION_SECRET, resave: false, saveUninitialized: false }));
app.use(passport.initialize());
app.use(passport.session());
app.use(methodOverride('_method'));

const port: any = process.env.PORT || 5000;
const user_datas: any = JSON.parse(fs.readFileSync('./json/users.json', 'utf-8'));
const case_datas: any = JSON.parse(fs.readFileSync('./json/cases.json', 'utf-8'));
const list_of_name: any = {
    "male": ["Putra", "Wahyu", "Agus", "Agung", "Ahmad", "Kurniawan", "Budi", "Adi", "Eko", "Arief", "Ari", "Indra", "Rizki", "Yusuf", "Fajar", "Bayu", "Aditya", "Nugroho", "Abdul", "Setiawan", "Riski", "Bagus", "Hidayat", "Rian", "Hendra", "Raden", "Surya", "Angga", "Hadi", "Adam", "Rudi", "Andri", "Taufik", "Hanif"],
    "female": ["Nur", "Dewi", "Dian", "Sri", "Putri", "Sari", "Ayu", "Indah", "Siti", "Fitri", "Ratna", "Puspita", "Ratih", "Pratiwi", "Tika", "Wulandari", "Lestari", "Febri", "Anita", "Rahma", "Fitria", "Novi", "Ria", "Rahayu", "Yunita", "Rina", "Widya", "Intan", "Agustina", "Rini", "Yulia", "Maya", "Utami", "Amel", "Devi", "Citra", "Diana", "Wulan", "Yuni", "Sinta", "Cantika"]
};

const initializePassport = require('./passport-config');
initializePassport(
    passport,
    // @ts-ignore
    username => user_datas.find(user => user.username === username),
    // @ts-ignore
    id => user_datas.find(user => user.id === id)
);

//#region Functions
function check_authenticated(req: Request, res: Response, next: NextFunction){
    if(req.isAuthenticated()){
        return next();
    }

    res.redirect('/login');
};

function check_not_authenticated(req: Request, res: Response, next: NextFunction){
    if(req.isAuthenticated()){
        return res.redirect('/');
    }

    next();
};

function get_random_number(min: number, max: number){
    let value: number = Math.floor(prng() * (max - min + 1) + min);

    return value;
};

function get_random_case(){
    let random_case_theme: number = get_random_number(1, case_datas.length);

    return random_case_theme;
};

function check_random_case_id(crime_case_taken: any, random_case_theme: any){
    for(let i = 0; i < crime_case_taken.length; i++){
        if(random_case_theme == crime_case_taken[i]){
            random_case_theme = get_random_case();
            i = -1;
        };
    };
};

function get_random_case_identity(random_case_theme: any){
    let random_case_identity: any = [];
    let case_identity = case_datas[random_case_theme - 1].identity;

    for(let i = 0; i < case_identity.length; i++){
        for(let j = 0; j < case_identity[i][1]; j++){
            if(case_identity[i][0] == "Male"){
                let temp_random_number = get_random_number(0, list_of_name.male.length - 1);
                let temp_random_name = list_of_name.male[temp_random_number];
                let temp_random_age = get_random_number(case_identity[i][2][0], case_identity[i][2][1]);

                random_case_identity.push([temp_random_name, temp_random_age, "Pria"]);
            }

            else if(case_identity[i][0] == "Female"){
                let temp_random_number = get_random_number(0, list_of_name.female.length - 1);
                let temp_random_name = list_of_name.female[temp_random_number];
                let temp_random_age = get_random_number(case_identity[i][2][0], case_identity[i][2][1]);

                random_case_identity.push([temp_random_name, temp_random_age, "Wanita"]);
            }
        }
    }

    return random_case_identity;
};

//#endregion Functions

//#region Main Request
app.get('/', check_authenticated, (req: Request, res: Response) => {
    res.redirect('/home');
});

app.get('/home', check_authenticated, (req: Request, res: Response) => {
    res.render('home', { title: 'Utama', user_data: req.user, case_datas });
});

app.get('/stats', check_authenticated, (req: Request, res: Response) => {
    res.render('stats', { title: 'Informasi', user_data: req.user });
});

app.get('/upgrade', check_authenticated, (req: Request, res: Response) => {
    res.render('upgrade', { title: 'Peningkatan', user_data: req.user });
});

app.get('/history', check_authenticated, (req: Request, res: Response) => {
    res.render('history', { title: 'Berita', user_data: req.user });
});

app.get('/setting', check_authenticated, (req: Request, res: Response) => {
    res.render('setting', { title: 'Pengaturan', user_data: req.user });
});

app.post('/home', check_authenticated, (req: Request, res: Response) => {
    // @ts-ignore
    let crime_case_data: any = req.user.crime_case;
    let current_day_length: number = crime_case_data.length - 1;
    let case_data = crime_case_data[current_day_length].case;
    let current_case_length: number = case_data.length - 1;
    let current_case_data: any = case_data[current_case_length];

    if(req.body.response == 'guilty' && current_case_data.case_response == null){
        current_case_data.case_response = 'guilty';
    }

    else if(req.body.response == 'innocent' && current_case_data.case_response == null){
        current_case_data.case_response = 'innocent';
    }

    if(crime_case_data[current_day_length].case_current < crime_case_data[current_day_length].case_max){
        crime_case_data[current_day_length].case_current += 1;
        
        let random_case_theme: any = get_random_case();

        // @ts-ignore
        let crime_case_taken = req.user.crime_case_taken;

        check_random_case_id(crime_case_taken, random_case_theme);
        
        let random_case_identity: any = get_random_case_identity(random_case_theme);

        case_data.push({
            "case_id": random_case_theme,  
            "case_response": null,
            "case_identity" : random_case_identity
        });

        crime_case_taken.push(random_case_theme);
    }

    else if(crime_case_data[current_day_length].case_current >= crime_case_data[current_day_length].case_max){
        const random_case_max: number = get_random_number(1, 2);

        let random_case_theme: any = get_random_case();

        // @ts-ignore
        let crime_case_taken = req.user.crime_case_taken;

        check_random_case_id(crime_case_taken, random_case_theme);

        let random_case_identity: any = get_random_case_identity(random_case_theme);

        crime_case_data.push({
            "day": crime_case_data.length + 1,
            "case_current" : 1,
            "case_max" : random_case_max,
            "case": [
                {
                    "case_id": random_case_theme,  
                    "case_response": null,
                    "case_identity" : random_case_identity
                }
            ]
        });

        crime_case_taken.push(random_case_theme);
    }

    fs.writeFileSync('./json/users.json', JSON.stringify(user_datas, null, 4));
    res.redirect('/home');
});

//#endregion Main Request

//#region Authentication Request
app.get('/login', check_not_authenticated, (req: Request, res: Response) => {
    res.render('login', { title: 'Login' });
});

app.post('/login', check_not_authenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', check_not_authenticated, (req: Request, res: Response) => {
    res.render('register', { title: 'Register' });
});

app.post('/register', check_not_authenticated, async (req: Request, res: Response) => {
    let username_is_valid = true;
    for(let i = 0; i < user_datas.length; i++){
        if(String(req.body.username) == user_datas[i].username){
            username_is_valid = false;
            break;
        }
    };

    if(username_is_valid){
        const hashedPassword: any = await bcrypt.hash(req.body.password, 12);
        const random_case_max: number = get_random_number(1, 2);

        let random_case_theme: any = get_random_case();

        let random_case_identity: any = get_random_case_identity(random_case_theme)

        user_datas.push({
            "id": user_datas.length + 1,
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
            "crime_case_taken" : [random_case_theme],
            "crime_case": [
                {
                    "day": 1,
                    "case_current" : 1,
                    "case_max" : random_case_max,
                    "case": [
                        {
                            "case_id": random_case_theme,  
                            "case_response": null,
                            "case_identity" : random_case_identity
                        }
                    ]
                }
            ]
        });

        fs.writeFileSync('./json/users.json', JSON.stringify(user_datas, null, 4));
        res.redirect('/login');
    }

    else if(!username_is_valid){
        req.flash('info', 'Username already taken');
        res.redirect('/register');
    }
});

app.get('/logout', check_authenticated, (req: Request, res: Response) => {
    res.render('logout', { title: 'Logout' });
});

app.delete('/logout', check_authenticated, (req: Request, res: Response) => {
    req.logOut();
    res.redirect('/login');
});

//#endregion Authentication Request

app.listen(port, () => {console.log(`Listening in http://localhost:${port}`);});
