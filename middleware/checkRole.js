
module.exports = (req, res, next) => {
    if (req.session.user.role != 'admin') {
        req.session.error = "Bạn không có quyền hạn để thực hiện yêu cầu này!";
        return res.redirect("/dashboard");
    }
    return next();
};