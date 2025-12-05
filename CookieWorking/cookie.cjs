const express = require('express');
const app = express();
const cookieParser = require('cookie-parser');


app.use(cookieParser("secretcode")); // use a secret code to sign the cookies

app.get("/getsignedCookie", (req, res) => {
    // Set a signed cookie
   // res.cookie('secretCookie', 'This is a secret cookie', { signed: true, httpOnly: true });
    //res.send('Signed cookie has been set');
    console.log(req.signedCookies);
    console.log(req.cookies);
});

app.get("/verifycookie", (req, res) => {
    const signedCookie = req.signedCookies['secretCookie'];
    if (signedCookie) {
        res.send('Signed cookie is valid: ' + signedCookie);        
    } else {
        res.send('Signed cookie is not valid');
    }
});

app.get('/', (req, res) => {
    //  res.cookie('username', 'JohnDoe');
    console.log(req.cookies);
    res.send('Hello World');
});

app.get('/user', (req, res) => {
     res.send('Hello user! Your cookies: ' + JSON.stringify(req.cookies));
});

app.listen(3000, () => {
    console.log("Server running on port 3000");
});