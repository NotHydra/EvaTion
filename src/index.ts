import express, { Application, Request, Response, NextFunction } from 'express';

const app: Application = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
// app.use(express.urlencoded({ extended:false }));

const port: any = process.env.PORT || 5000;

app.get('/', (req: Request, res: Response) => {
    res.redirect('/home');
});

app.get('/home', (req: Request, res: Response) => {
    res.render('home', { title: 'Home' });
});

app.get('/stats', (req: Request, res: Response) => {
    res.render('stats', { title: 'Stats' });
});

app.get('/upgrade', (req: Request, res: Response) => {
    res.render('upgrade', { title: 'Upgrade' });
});

app.get('/history', (req: Request, res: Response) => {
    res.render('history', { title: 'History' });
});

app.get('/setting', (req: Request, res: Response) => {
    res.render('setting', { title: 'Setting' });
});

app.listen(port, () => {console.log(`Listening in http://localhost:${port}`);});
