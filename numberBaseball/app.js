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
    res.render("index.html");
});

app.get("/start", (req, res, next) => {
    const { nickname } = req.query;

    req.session.nickname = nickname;
    let randomNumber = "";
    for (let i = 0; i < 4; i++) {
        temp = parseInt(Math.random() * 9);
        if (randomNumber.indexOf(temp) != -1) {
            i--;
            console.log("겹침");
        } else {
            randomNumber += String(temp);
        }
    }
    req.session.randomNumber = randomNumber;

    res.render("baseball.html", {
        nickname: nickname,
        randomNumber: "4자리 숫자를 입력해주세요!",
        answer: false,
    });
});

app.get("/answer", (req, res, next) => {
    const { submitAnswer } = req.query;
    const { randomNumber } = req.session;
    try {
        for (let str of submitAnswer) {
            if (isNaN(parseInt(str))) {
                return res.render("baseball.html", {
                    nickname: req.session.nickname,
                    randomNumber: "정확한 값을 입력하세요.",
                    answer: false,
                });
            }
        }
        let strike = 0,
            ball = 0;
        for (let i = 0; i < submitAnswer.length; i++) {
            const includedNum = randomNumber.indexOf(submitAnswer[i]);
            if (includedNum != -1) {
                if (includedNum == i) {
                    strike++;
                } else {
                    ball++;
                }
            }
        }
        if (strike == 4) {
            return res.render("baseball.html", {
                nickname: req.session.nickname,
                randomNumber: ``,
                answer: true,
            });
        }
        return res.render("baseball.html", {
            nickname: req.session.nickname,
            randomNumber: `strike : ${strike}, ball : ${ball}`,
            answer: false,
        });
    } catch (err) {
        console.log(err);
        return res.render("baseball.html", {
            nickname: req.session.nickname,
            randomNumber: "정확한 값을 입력하세요.",
            answer: false,
        });
    }
});

app.listen(port, () => {
    console.log("서버가 열렸습니다");
});
