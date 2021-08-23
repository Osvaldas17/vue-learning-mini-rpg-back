
require('dotenv').config()

const express = require('express')
const cors = require('cors')

const corsOptions = {
    allowedHeaders: ['userauth', 'Content-Type'],
    exposedHeaders: ['userauth']
}

const mongoose = require('mongoose');

const router = require('./routes/routes')

mongoose.connect('mongodb://localhost/rpg-game-backEnd', {useNewUrlParser: true, useUnifiedTopology: true});

const db = mongoose.connection

db.on('error', console.error.bind(console, 'connection error'))
db.once('open', () => {
    console.log('logged into database')
})

const app = express();

app.use(cors(corsOptions))

app.use(express.json())

app.use('/',router)

app.listen(3000)