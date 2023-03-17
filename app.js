require('dotenv').config();
require('./database/mongooseConnection');
const User = require('./models/user');

const cors = require('cors');
const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(cors())
app.use(express.json());


//De gebruiker ontvangt hier een register json object omdat de user nog niet bekend is 
//in het systeem 
app.get('/register', (req, res) => {
    res.json({
        username: "geef hier uw email adres",
        password: "voer hier uw wachtwoord in",
        isOwner: "vul hier true in als u eigenaar bent van dit type bericht, anders false"
    })
})

app.post('/register', async (req, res) => {
    console.log('Lets register');
    if (!req.body.username || !req.body.password) {
        res.json({ success: false, msg: 'Please pass username and password.' });
    } else {
        var newUser = new User({
            username: req.body.username,
            password: req.body.password,
            isOwner: req.body.isOwner
        });

        await newUser.save().then(() => {
            res.status(200).json({ success: true, msg: 'Successful created new user.' });
        }).catch((err) => {
            console.log(err);
            res.status(406).json({ success: false, msg: 'Username already exists.' });
        });
    }
})

//de login doet praktisch hetzelfde als de 'register' route met dat verschil dat het alleen maar 
// een nieuwe JWT geeft wanneer de user al bestaat
app.post('/login', (req, res) => {

    User.findOne({
        username: req.body.username
    }).then((user) => {
        if (!user) {
            res.status(401).send({ success: false, msg: 'Authentication failed. User not found.' });
        } else {
            // check if password matches
            res.status(200).send({success: true, token: 'This should contain your JWT token!'});
        }
    }).catch((err) => { throw err} );
})

app.listen(port, () => {
    console.log('Server is up on port ' + port);
})