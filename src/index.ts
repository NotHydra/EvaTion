if (process.env.NODE_ENV !== 'production'){
    require('dotenv').config()
}

import express, { Application, Request, Response, NextFunction } from 'express';
import fs from 'fs';
import bcrypt from 'bcrypt';
import passport from 'passport';
import flash from 'express-flash';
import session from 'express-session';
import methodOverride from 'method-override';

const app: Application = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
app.use(express.urlencoded({ extended: false }));
app.use(flash())
app.use(session({
    // @ts-ignore
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: false
}))
app.use(passport.initialize())
app.use(passport.session())
app.use(methodOverride('_method'))

const port: any = process.env.PORT || 5000;
const list_of_names: Array<string> = ["Dwi", "Nur", "Dewi", "Tri", "Dian", "Sri", "Putri", "Eka", "Sari", "Ayu", "Wahyu", "Indah", "Siti", "Ika", "Agus", "Fitri", "Ratna", "Andi", "Agung", "Ahmad", "Kurniawan", "Budi", "Adi", "Eko", "Nurul", "Putra", "Arif", "Puspita", "Ari", "Indra", "Dyah", "Rizki", "Maria", "Ratih", "Pratiwi", "Kartika", "Wulandari", "Fajar", "Bayu", "Lestari", "Anita", "Muhamad", "Kusuma", "Rahmawati", "Fitria", "Retno", "Kurnia", "Novita", "Aditya", "Ria", "Nugroho", "Putu", "Handayani", "Rahayu", "Yunita", "Rina", "Ade", "Widya", "Intan", "Diah", "Agustina", "Made", "Abdul", "Setiawan", "Rizky", "Rini", "Wahyuni", "Yulia", "Maya", "Puji", "Utami", "Amalia", "Dina", "Devi", "Citra", "Arief", "Bagus", "Hidayat", "Hendra", "Eva", "Endah", "Raden", "Novi", "Astuti", "Irma", "Achmad", "Aulia", "Surya", "Amelia", "Prima", "Angga", "Hadi", "Diana", "Anggraini", "Wulan", "Saputra", "Yuni", "Prasetyo", "Reza", "Suci"]
const user_data: any = JSON.parse(fs.readFileSync('./json/users.json', 'utf-8'));
const case_data: any = JSON.parse(fs.readFileSync('./json/cases.json', 'utf-8'));

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    // @ts-ignore
    username => user_data.find(user => user.username === username),
    // @ts-ignore
    id => user_data.find(user => user.id === id)
)

//#region Functions
function checkAuthenticated(req: Request, res: Response, next: NextFunction){
    if(req.isAuthenticated()){
        return next()
    }

    res.redirect('/login')
}

function checkNotAuthenticated(req: Request, res: Response, next: NextFunction){
    if(req.isAuthenticated()){
        return res.redirect('/')
    }

    next()
}

function getRandomNumber(min: number, max: number){
    max += 1

    let value = Math.floor(Math.random() * (max - min) + min);

    if(value == max){
        value -= 1
    }

    return value
}

function getRandomCaseTheme(random_case_theme: any, case_rank: any){
    let random_case_number = getRandomNumber(0, case_data.length - 1)

    return random_case_number;
}

//#endregion Functions

//#region Main Request
app.get('/', checkAuthenticated, (req: Request, res: Response) => {
    res.redirect('/home');
});

app.get('/home', checkAuthenticated, (req: Request, res: Response) => {
    res.render('home', { title: 'Utama', user_data: req.user });
});

app.get('/stats', checkAuthenticated, (req: Request, res: Response) => {
    res.render('stats', { title: 'Informasi', user_data: req.user });
});

app.get('/upgrade', checkAuthenticated, (req: Request, res: Response) => {
    res.render('upgrade', { title: 'Peningkatan', user_data: req.user });
});

app.get('/history', checkAuthenticated, (req: Request, res: Response) => {
    res.render('history', { title: 'Berita', user_data: req.user });
});

app.get('/setting', checkAuthenticated, (req: Request, res: Response) => {
    res.render('setting', { title: 'Pengaturan', user_data: req.user });
});

//#endregion Main Request

//#region Authentication Request
app.get('/login', checkNotAuthenticated, (req: Request, res: Response) => {
    res.render('login', { title: 'Login' })
});

app.post('/login', checkNotAuthenticated, passport.authenticate('local', {
    successRedirect: '/',
    failureRedirect: '/login',
    failureFlash: true
}));

app.get('/register', checkNotAuthenticated, (req: Request, res: Response) => {
    res.render('register', { title: 'Register' })
});

app.post('/register', checkNotAuthenticated, async (req: Request, res: Response) => {
    let username_is_valid = true
    for(let i = 0; i < user_data.length; i++){
        if(String(req.body.username) == user_data[i].username){
            username_is_valid = false;
            break;
        }
    };

    if(username_is_valid){
        const temp_case_status: number = getRandomNumber(0, 3);

        const hashedPassword: any = await bcrypt.hash(req.body.password, 12);
        const random_case_max: number = getRandomNumber(3, 5);
        const random_case_name: string = list_of_names[getRandomNumber(0, 99)];
        const random_case_age: number = getRandomNumber(19, 78);

        let case_is_guilty;
        if(temp_case_status == 0){
            case_is_guilty = false;
        }
        
        else if(temp_case_status == 1 || temp_case_status == 2 || temp_case_status == 3){
            case_is_guilty = true;
        }

        let random_case_theme: any = [];
        let case_rank: any = [];
        if(!case_is_guilty){
            let random_case_number = getRandomCaseTheme(random_case_theme, case_rank)

            random_case_theme.push(case_data[random_case_number])
            case_rank.push(case_data[random_case_number].rank)
        }

        else if(case_is_guilty){
            let random_case_number = [];

            for(let i = 0; i < 4; i++){
                let temp_random_case_number = getRandomCaseTheme(random_case_theme, case_rank)

                let random_case_number_is_valid = true
                for(let j = 0; j < random_case_number.length; j++){
                    if(temp_random_case_number == random_case_number[j]){
                        random_case_number_is_valid = false
                    }
                }

                if(random_case_number_is_valid){
                    random_case_number.push(temp_random_case_number)
                }

                else if (!random_case_number_is_valid){
                    i -= 1;
                }
            }

            let random_case_theme_value_range = getRandomNumber(1, 100)
            let case_theme_range = [0, 25, 50, 75]

            for(let i = 0; i < random_case_number.length; i++){
                if(random_case_theme_value_range > case_theme_range[i]){
                    random_case_theme.push(case_data[random_case_number[i]])
                    case_rank.push(case_data[random_case_number[i]].rank)
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
                    "case_current" : 1,
                    "case_max" : random_case_max,
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

        fs.writeFileSync('./json/users.json', JSON.stringify(user_data, null, 4))

        res.redirect('/login');
    }

    else if(!username_is_valid){
        req.flash('info', 'Username already taken')
        res.redirect('/register')
    }
});

app.get('/logout', checkAuthenticated, (req: Request, res: Response) => {
    res.render('logout', { title: 'Logout' })
});

app.delete('/logout', checkAuthenticated, (req: Request, res: Response) => {
    req.logOut();
    res.redirect('/login')
});

//#endregion Authentication Request

app.listen(port, () => {console.log(`Listening in http://localhost:${port}`);});