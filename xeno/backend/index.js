import dotenv from 'dotenv';
dotenv.config();

import express from "express";
import { dbConnect } from './db/db.js';
import cors from 'cors';
import passport from './lib/passport.js'
import session from 'express-session';
import router from './routes/router.js';
import cookieParser from 'cookie-parser';


const app = express();
app.set("trust proxy", 1);
// Middlewares
app.use(cors({
  origin: `${process.env.FRONTEND_URL}`,
  credentials: true,
}));
app.use(express.json());
app.use(cookieParser())

app.use(session({
  secret: process.env.SESSION_SECRET,
  resave: false,
  saveUninitialized: false,
  cookie: {
    httpOnly: true,
    secure: true,
    maxAge: 24 * 60 * 60 * 1000,
    sameSite: 'none'
  }
}));

app.use(cookieParser())
app.use(passport.initialize());
app.use(passport.session());


app.post('/login', (req, res, next) => {
  passport.authenticate('local', (err, user, info) => {
    if (err) return next(err);
    if (!user) return res.status(401).json({ message: 'Invalid credentials' });

    req.logIn(user, (err) => {
      if (err) return next(err);

      // At this point, user is stored in session
      return res.status(200).json({ user });
    });
  })(req, res, next);
});

app.get('/api/auth/google', passport.authenticate('google', {
  scope: ['profile', 'email']
}));

app.get('/api/auth/callback/google', passport.authenticate('google', {
  failureRedirect: '/login',
  successRedirect: '/'
}));

app.get('/api/auth/github', passport.authenticate('github', {
  scope: ['user:email']
}));

app.get('/api/auth/callback/github', passport.authenticate('github', {
  failureRedirect: '/login',
  successRedirect: '/'
}));

app.get('/api/auth/status', (req, res) => {
  console.log('Session:', req.session);
  console.log('User:', req.user);
  if (req.isAuthenticated()) {
    res.json({
      authenticated: true,
      user: {
        id: req.user._id,
        emailId: req.user.emailId,
        firstName: req.user.firstName,
        lastName: req.user.lastName
      }
    });
  } else {
    res.json({ authenticated: false });
  }
});

app.get('/', (req, res) => {
  res.send('Server running...');
});

const Port = process.env.PORT || 3001;


app.use('/admin', router);





const server = () => {
  dbConnect();
  app.listen(Port, () => {
    console.log("Listening to port", Port);
  });
};

server();
