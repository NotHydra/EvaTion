import express, { Application, Request, Response, NextFunction } from 'express';

const app: Application = express();
app.set('view engine', 'ejs');
app.use(express.static('public'));
// app.use(express.urlencoded({ extended:false }));

const port: number = 5000;

app.get('/', (req: Request, res: Response) => {
    res.redirect('/home');
});

app.get('/home', (req: Request, res: Response) => {
    res.render('home', { title: 'Home' });
});

app.listen(port, () => {console.log(`Listening in http://localhost:${port}`);});
