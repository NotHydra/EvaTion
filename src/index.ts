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
const user_data = JSON.parse(fs.readFileSync('./json/users.json', 'utf-8'));
const case_data = JSON.parse(fs.readFileSync('./json/cases.json', 'utf-8'));

const initializePassport = require('./passport-config')
initializePassport(
    passport,
    // @ts-ignore
    username => user_data.find(user => user.username === username),
    // @ts-ignore
    id => user_data.find(user => user.id === id)
)

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

//#region Main Request
app.get('/', checkAuthenticated, (req: Request, res: Response) => {
    res.redirect('/home');
});

app.get('/home', checkAuthenticated, (req: Request, res: Response) => {
    res.render('home', { title: 'Utama', user_data: req.user });
});

app.get('/stats', checkAuthenticated, (req: Request, res: Response) => {
    res.render('stats', { title: 'Informasi', user_data });
});

app.get('/upgrade', checkAuthenticated, (req: Request, res: Response) => {
    res.render('upgrade', { title: 'Peningkatan', user_data });
});

app.get('/history', checkAuthenticated, (req: Request, res: Response) => {
    res.render('history', { title: 'Berita', user_data });
});

app.get('/setting', checkAuthenticated, (req: Request, res: Response) => {
    res.render('setting', { title: 'Pengaturan', user_data });
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
    try {
        const hashedPassword = await bcrypt.hash(req.body.password, 12);

        let random_case_max =  Math.ceil(Math.random() * 5);
        if(random_case_max == 1 || random_case_max == 2){
            random_case_max = 3;
        };

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
            "total_crime_case" : 1,
            "crime_case": [
                {
                    "day": 1,
                    "case_current" : 1,
                    "case_max" : random_case_max,
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

    catch {
        res.redirect('/register');
    }

    console.log(user_data)
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