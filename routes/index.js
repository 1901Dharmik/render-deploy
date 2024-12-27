
const router = require('express').Router()
//importing middleware
const { ensureAuth, ensureGuest } = require('../middlewares/auth')

router.get('/', ensureGuest ,(req, res) => {
    res.render('login')
  })

router.get("/",ensureAuth, async(req,res)=>{
    res.render('index',{userinfo:req.user})
})
module.exports=router;