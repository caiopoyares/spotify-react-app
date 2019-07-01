let express = require("express");
let request = require("request");
let querystring = require("querystring");
let cors = require("cors");

let app = express();

// Fill out the variables below with your client id and client secret provided by Spotify
const SPOTIFY_CLIENT_ID = "YOUR_SPOTIFY_CLIENT_ID";
const SPOTIFY_CLIENT_SECRET = "YOUR_SPOTIFY_CLIENT_SECRET";
// --------------------------------------------------------------------------------------

let redirect_uri = process.env.REDIRECT_URI || "http://localhost:4000/callback";

app.use(cors());

app.get("/login", function(req, res) {
  res.redirect(
    "https://accounts.spotify.com/authorize?" +
      querystring.stringify({
        response_type: "code",
        client_id: SPOTIFY_CLIENT_ID,
        scope: "user-read-private user-read-email",
        redirect_uri
      })
  );
});

app.get("/callback", function(req, res) {
  let code = req.query.code || null;
  let authOptions = {
    url: "https://accounts.spotify.com/api/token",
    form: {
      code: code,
      redirect_uri,
      grant_type: "authorization_code"
    },
    headers: {
      Authorization:
        "Basic " +
        new Buffer(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString(
          "base64"
        )
    },
    json: true
  };
  request.post(authOptions, function(error, response, body) {
    let access_token = body.access_token;
    let refresh_token = body.refresh_token;
    let uri = "http://localhost:3000/";
    res.redirect(
      uri + "?access_token=" + access_token + "&refresh_token=" + refresh_token
    );
  });
});

app.get("/refresh_token/:token", function(req, res) {
  let refresh_token = req.params.token;
  let authOptions = {
    url: "https://accounts.spotify.com/api/token",
    headers: {
      Authorization:
        "Basic " +
        new Buffer(SPOTIFY_CLIENT_ID + ":" + SPOTIFY_CLIENT_SECRET).toString(
          "base64"
        )
    },
    form: {
      grant_type: "refresh_token",
      refresh_token: refresh_token
    },
    json: true
  };

  request.post(authOptions, function(error, response, body) {
    if (!error && response.statusCode === 200) {
      var access_token = body.access_token;
      res.send({
        access_token: access_token
      });
    }
  });
});

if (process.env.NODE_ENV === "production") {
  app.use(express.static("client/dist"));
  app.get("*", (req, res) => {
    res.sendFile(path.resolve(__dirname, "client", "dist", "index.html"));
  });
}

let PORT = process.env.PORT || 4000;
console.log(`Listening on port ${PORT}.`);
app.listen(PORT);
