
module.exports= (req, res, next) =>{
    if(!req.session.isLoggedin){
        res.status(401).redirect('/login');
    }else{
        next();
    }
}