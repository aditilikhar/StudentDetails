var express = require('express');
var router = express.Router();
var pool=require('./pool')

router.get('/fetchStates', function(req,res,next){
    pool.query('select *from states',function(error,result){
        if(error)
        {
            return res.status(500).json([])
        }
        else
        {
            return res.status(200).json(result)
        }
    })
})

router.get('/fetchCities',function(req,res,next){
    pool.query('select *from cities where stateid=?',[req.query.sid],function(error,result){
        if(error)
        {
            return res.status(500).json([])
        }
        else
        {
            return res.status(200).json(result)
        }
    })
})


module.exports = router;
