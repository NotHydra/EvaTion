import express, { Application, Request, Response, NextFunction } from 'express';
import fs from 'fs';

const app: Application = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
// app.use(express.urlencoded({ extended:false }));

const port: any = process.env.PORT || 5000;
const user_data = JSON.parse(fs.readFileSync('./json/users.json', 'utf-8'));

app.get('/', (req: Request, res: Response) => {
    res.redirect('/home');
});

app.get('/home', (req: Request, res: Response) => {
    res.render('home', { title: 'Utama', user_data });
});

app.get('/stats', (req: Request, res: Response) => {
    res.render('stats', { title: 'Informasi', user_data });
});

app.get('/upgrade', (req: Request, res: Response) => {
    res.render('upgrade', { title: 'Peningkatan', user_data });
});

app.get('/history', (req: Request, res: Response) => {
    res.render('history', { title: 'Berita', user_data });
});

app.get('/setting', (req: Request, res: Response) => {
    res.render('setting', { title: 'Pengaturan', user_data });
});

app.listen(port, () => {console.log(`Listening in http://localhost:${port}`);});
