module.exports.renderLogin=(req,res)=>{
    res.render('login')
}

module.exports.login=(req,res)=>{
    console.log("entered")
    req.flash('success', 'welcome back!');
    const redirectUrl = req.session.returnTo || '/';
    delete req.session.returnTo;
    res.redirect(redirectUrl);
}

module.exports.logout = (req, res, next) => {
    req.logout(function(err) {
        if (err) { return next(err); }
        req.flash('success', 'You have been logged out.');
        res.redirect('/');
    });
};
