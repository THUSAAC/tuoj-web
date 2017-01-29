module.exports.isLogin = function(req,res,next){
    if (!req.session.user) {
        return res.redirect("/login");
    } else {
        next();
    }
};

module.exports.isAdmin = function(req,res,next) {
    if (!req.session.is_admin) {
        return res.status(400).send('Access deined');
    }
    next();
};

