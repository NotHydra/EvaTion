import express, { Application, Request, Response, NextFunction } from 'express';

const app: Application = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
// app.use(express.urlencoded({ extended:false }));

const port: any = process.env.PORT || 5000;

const list_of_page_attribute: Array<Array<string>> = [
    ['home', 'fa-home'],
    ['stats', 'fa-bars-progress'],
    ['upgrade', 'fa-angles-up'],
    ['history', 'fa-list-ul'],
    ['setting', 'fa-gear']
];

app.get('/', (req: Request, res: Response) => {
    res.redirect('/home');
});

app.get('/home', (req: Request, res: Response) => {
    res.render('home', { title: 'Home', list_of_page_attribute });
});

app.get('/stats', (req: Request, res: Response) => {
    res.render('stats', { title: 'Stats', list_of_page_attribute });
});

app.get('/upgrade', (req: Request, res: Response) => {
    res.render('upgrade', { title: 'Upgrade', list_of_page_attribute });
});

app.get('/history', (req: Request, res: Response) => {
    res.render('history', { title: 'History', list_of_page_attribute });
});

app.get('/setting', (req: Request, res: Response) => {
    res.render('setting', { title: 'Setting', list_of_page_attribute });
});

app.listen(port, () => {console.log(`Listening in http://localhost:${port}`);});
