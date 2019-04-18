
module.exports= (req, res, next) =>{
    if(!req.session.isLoggedin){
        res.redirect('/login');
    }else{
        next();
    }
}