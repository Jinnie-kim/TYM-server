const express = require('express');
const cors = require('cors');
const SpotifyWebApi = require('spotify-web-api-node');
const bodyParser = require('body-parser');
const port = process.env.PORT || 5174;
require('dotenv').config();

const app = express();

app.use(
  cors({
    origin: ['http://127.0.0.1:5173', 'https://track-your-music.vercel.app'],
  })
);

app.use(bodyParser.json());

app.get('/', (req, res) => {
  res.send('serving listening server...💫');
});

app.post('/gettoken', function (req, res) {
  const code = req.body.code;

  const spotifyApi = new SpotifyWebApi({
    redirectUri: process.env.REDIRECT_URI,
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET,
  });

  spotifyApi
    .authorizationCodeGrant(code)
    .then((data) => {
      res.json({
        status: data.statusCode,
        accessToken: data.body.access_token,
        refreshToken: data.body.refresh_token,
        expiresIn: data.body.expires_in,
      });
    })
    .catch((error) => {
      console.log(error);
      res.sendStatus(400);
    });
});

app.listen(port);
