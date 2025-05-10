import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import { dbConnect } from './db/db.js';
import cors from 'cors';
import passport from './lib/passport.js'
import session from 'express-session';


const app = express();

// Middlewares
app.use(cors());
app.use(express.json());

app.use(session({
    secret: process.env.SESSION_SECRET,
    resave: false,
    saveUninitialized: true,
}));

app.use(passport.initialize());
app.use(passport.session());

app.get('/auth/google',
    passport.authenticate('google', { scope: ['profile', 'email'] })
);

app.get('/auth/google/callback',
    passport.authenticate('google', {
        successRedirect: '/dashboard',
        failureRedirect: '/login',
    })
);

app.get('/', (req, res) => {
    res.send('Server running...');
});

const Port = process.env.PORT || 3001;

const server = () => {
    dbConnect();
    app.listen(Port, () => {
        console.log("Listening to port", Port);
    });
};

server();
