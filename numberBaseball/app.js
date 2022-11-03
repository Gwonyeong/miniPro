const express = require("express");
const app = express();
const session = require("express-session");
const ejs = require("ejs");
const fs = require("fs");
app.use(
    session({
        secret: "base",
        resave: false,
        saveUninitialized: true,
        cookie: { secure: false },
    })
);
app.set("views", __dirname + "/views");
app.set("view engine", ejs);
app.engine("html", require("ejs").renderFile);

const port = 5000;

app.get("/", (req, res, next) => {
    console.log(req.query);

    res.render("index.html");
});
app.get("/num", (req, res, next) => {
    console.log(req.session);
    const num = req.session.num;
    return res.send(req.session);
});

app.listen(port, () => {
    console.log("서버가 열렸습니다");
});
