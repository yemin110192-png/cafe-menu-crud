var path = require("path");
require("dotenv").config({ path: path.join(__dirname, ".env") });

var express = require("express");
var bodyParser = require("body-parser");
var db = require("./db"); // 교수님이 주신 db.js 사용

var app = express();

app.set("view engine", "ejs");
app.use(bodyParser.urlencoded({ extended: true }));

// 1. 조회 (메뉴 목록)
app.get("/", async function(req, res) {
    try {
        var [results] = await db.query("SELECT * FROM menu");
        res.render("list", { list: results });
    } catch (err) {
        console.log(err);
        res.status(500).send("DB 에러 발생");
    }
});

// 2. 등록 - 화면 보여주기
app.get("/add", function(req, res) {
    res.render("add");
});

// 2. 등록 - DB 처리
app.post("/add", async function(req, res) {
    var name = req.body.name;
    var price = req.body.price;
    var category = req.body.category;

    try {
        var sql = "INSERT INTO menu (name, price, category) VALUES (?, ?, ?)";
        await db.query(sql, [name, price, category]);
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("DB 등록 에러");
    }
});

// 3. 수정 - 화면 보여주기
app.get("/edit/:id", async function(req, res) {
    var id = req.params.id;
    try {
        var [results] = await db.query("SELECT * FROM menu WHERE id = ?", [id]);
        res.render("edit", { item: results[0] });
    } catch (err) {
        console.log(err);
        res.status(500).send("DB 조회 에러");
    }
});

// 3. 수정 - DB 처리
app.post("/edit/:id", async function(req, res) {
    var id = req.params.id;
    var name = req.body.name;
    var price = req.body.price;
    var category = req.body.category;

    try {
        var sql = "UPDATE menu SET name = ?, price = ?, category = ? WHERE id = ?";
        await db.query(sql, [name, price, category, id]);
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("DB 수정 에러");
    }
});

// 4. 삭제 - 확인 화면 보여주기
app.get("/delete/:id", async function(req, res) {
    var id = req.params.id;
    try {
        var [results] = await db.query("SELECT * FROM menu WHERE id = ?", [id]);
        res.render("delete", { item: results[0] });
    } catch (err) {
        console.log(err);
        res.status(500).send("DB 조회 에러");
    }
});

// 4. 삭제 - DB 처리
app.post("/delete/:id", async function(req, res) {
    var id = req.params.id;
    try {
        var sql = "DELETE FROM menu WHERE id = ?";
        await db.query(sql, [id]);
        res.redirect("/");
    } catch (err) {
        console.log(err);
        res.status(500).send("DB 삭제 에러");
    }
});

app.listen(3000, function() {
    console.log("Server is running on port 3000");
});
