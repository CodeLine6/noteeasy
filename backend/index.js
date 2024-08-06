const connectToMongo = require('./db');
const expressWebsockets = require("express-ws");
const express = require('express');
const cors = require('cors');
const server = require('./hocuspocus.js');
const passport = require('passport');

const GoogleStrategy = require('passport-google-oauth20').Strategy;
const googleStrategyController = require('./controllers/passport/google.js')

const { app } = expressWebsockets(express());

app.use(express.json());
app.use(cors());

// Initialize Passport.js
app.use(passport.initialize());

// Configure Google OAuth Strategy
passport.use(new GoogleStrategy({
    clientID: process.env.GOOGLE_CLIENT_ID,
    clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    callbackURL: process.env.SERVER_HOST+"/api/auth/google/callback"
}, googleStrategyController));

app.use('/api/auth', require('./routes/auth'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/editor', require('./routes/editor'));
app.get("/health", (req, res) => {
    res.status(200).send("Ok");
})
app.ws("/", (websocket, request) => server.handleConnection(websocket, request));
connectToMongo();

app.listen(process.env.SERVER_PORT_NUMBER, () => {
    console.log('Noteseasy backend listening on port http://localhost:', process.env.SERVER_PORT_NUMBER)
});