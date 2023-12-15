// middleware/checkAuth.js

module.exports = (req, res, next) => {
    // kiểm tra session - có thì đã đăng nhập
    if (!req.session.user) {
        req.session.error = "Hãy đăng nhập trước!";
        return res.redirect('login');
    }
    return next();
};
