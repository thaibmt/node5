const express = require('express');
const bcrypt = require("bcryptjs");
const router = express.Router();
const User = require('../models/user')
const Bag = require('../models/bag')
const checkLogin = require('../middleware/checkLogin');
const checkRole = require('../middleware/checkRole');
// Home page
router.get('/', (req, res) => {
    res.render('home');
});
// Login - logout - register
router.get('/login', (req, res) => {
    let error = req.session.error;
    delete req.session.error;
    if (req.session.user) {
        return res.redirect("/dashboard");
    }
    res.render('login', { error, email: '' });
});
router.get('/register', (req, res) => {
    res.render('register', { error: '', email: '', username: '' });
});
router.get('/logout', (req, res) => {
    req.session.destroy((error) => {
        if (error) {
            throw error;
        }
        res.redirect("/");
    });
});
router.post('/login', async (req, res) => {
    const { email, password } = req.body;
    try {
        const user = await User.findOne({ email });
        if (!user) {
            req.session.error = "Thông tin đăng nhập không đúng.";
            return res.redirect("/login");
        }
        const hasUser = await bcrypt.compare(password, user.password);
        if (!hasUser) {
            req.session.error = "Thông tin đăng nhập không đúng.";
            return res.redirect("/login");
        }
        req.session.user = user;
        res.redirect("/dashboard");
    } catch (error) {
        console.error(error);
        res.redirect('/login', { error: 'Email hoặc mật khẩu không đúng', email });
    }
});
router.post('/register', async (req, res) => {
    const { username, email, password } = req.body;
    try {
        // Tìm người dùng xem tồn tại chưa
        let user = await User.findOne({ email, password });
        if (user) {
            return res.render('/register', { error: 'Nguời dùng đã tồn tại', email });
        }
        const salt = await bcrypt.genSalt(10);
        // mã hóa mật khẩu
        const hashedPassword = await bcrypt.hash(password, salt);
        user = new User({
            username,
            email,
            password: hashedPassword
        });
        await user.save();
        res.redirect("/login");
    } catch (error) {
        res.redirect('/register', { error: 'Có lỗi xảy ra khi đăng ký', email });
    }
});
// Dashboard
router.get('/dashboard', checkLogin, async (req, res) => {

    const username = req.session.user.name;
    const role = req.session.user.role;
    const error = req.session.error;
    const success = req.session.success;
    const bags = await Bag.find({});
    delete req.session.error;
    delete req.session.success;
    res.render("dashboard", { bags: bags, username: username, role: role, error: error, success: success });
});
// Detail
router.get('/bags/:id', checkLogin, async (req, res) => {
    const id = req.params.id;
    const bag = await Bag.findOne({ _id: id });
    res.render("detail", { bag: bag });
});
router.post('/bags/delete/:id', checkLogin, checkRole, async (req, res) => {
    const id = req.params.id;
    try {
        await Bag.deleteOne({ _id: id });
        req.session.success = true
    } catch (err) {
        req.session.error = true
    }
    res.redirect("/dashboard");
});
router.post('/bags', checkLogin, checkRole, async (req, res) => {
    const { title, price, description } = req.body;
    let bag = new Bag({
        title,
        price,
        description
    });
    try {
        await bag.save();
        req.session.success = true
    } catch (err) {
        console.log(err)
        req.session.error = true
    }
    res.redirect("/dashboard");
});
router.post('/bags/update/:id', checkLogin, checkRole, async (req, res) => {
    const { title, price, description } = req.body;
    const id = req.params.id;
    try {
        await Bag.updateOne({ _id: id }, { title, price, description });
        req.session.success = true
    } catch (err) {
        req.session.error = true
    }
    res.redirect("/dashboard");
});
module.exports = router;
