var express = require('express');
var router = express.Router();
var pool = require('./pool');
var multer = require('./multer');


  router.get('/fillForm', function(req, res, next) {
    res.render('db_form',{msg:''});
});

router.get('/studentview', function(req, res, next) {
   /*  if(!req.session.ses_admin)
    {
        res.render('adminlogin',{msg:''})
    }
    else */
  res.render('StudentInterface',{msg:' '});
});

/* router.post('/addnewrecord', multer.any(), function(req, res, next){
    console.log(req.files)
    pool.query('insert into fields(productname,productrate,productpicture,productad,adstatus)values(?,?,?,?,?)',[req.body.productname,req.body.productrate,req.files[0].originalname,req.files[1].originalname,req.body.adstatus],
    function(error,result){
        if(error)
        {
            console.log(error)
            res.render('productinterface',{msg:'fail to submit record...'})
        }
        else
        {
           res.render('productinterface',{msg:'record submitted...'})
        }
    })
}); */

router.post('/addnewrecord',multer.single('cpicture'),function(req, res, next){
   console.log(req.file)
   console.log(req.body)
    var cname=req.body.fname+' '+req.body.lname
    pool.query('insert into fields(id,name,dob,gender,address,state,city,email,mobile,password,picture)values(?,?,?,?,?,?,?,?,?,?,?)',[req.body.cid,cname,req.body.cdob,req.body.cgender,req.body.caddress,req.body.cstate,req.body.ccity,req.body.cemail,req.body.cmobile,req.body.cpwd,req.file.filename],function(error,result){

        if(error)
        {
            console.log(error)
            return res.render('StudentInterface',{msg: 'Record not submitted'})
        }
        else{
            return res.render('StudentInterface',{msg: 'Record submitted'})
        }
    })
});

router.get('/displayAll',function(req,res,next){
    pool.query('select C.*, (select S.statename from states S where S.stateid=C.state) as sname, (select CC.cityname from cities CC where CC.cityid=C.city) as cname from fields C',function(error,result){
        if(error)
        {
            return res.render('displayallstudent',{data:[]})
        }
        else
        {
            return res.render('displayallstudent',{data:result})
        }
    })


});

router.get('/addmarks',function(req,res,next){
    pool.query('select * from fields',function(error,result){
        if(error)
        {
            return res.render('marks',{data:[]})
        }
        else
        {
            return res.render('marks',{data:result})
        }
    })


});



router.get('/searchbyid', function(req, res, next){
    
    res.render('searchbyid')
})


router.get('/displayById',function(req,res,next){
    pool.query('select C.*, (select S.statename from states S where S.stateid=C.state) as sname, (select CC.cityname from cities CC where CC.cityid=C.city) as cname from fields C where C.id=?',[req.query.eid],function(error,result){
        if(error)
        {
            return res.render('displaystudentbyid',{data:[]})
        }
        else
        {
            return res.render('displaystudentbyid',{data:result[0]})
        }
    })
});

router.post('/updatedata', function(req, res, next) {
    if(req.body.btn=="Edit")
    {
     var ename=req.body.fname+" "+req.body.lname
   
      pool.query("update fields set name=?,dob=?,gender=?,address=?,state=?,city=?,email=?,mobile=? where id=?",[ename,req.body.cdob,req.body.cgender,req.body.caddress,req.body.cstate,req.body.ccity,req.body.cemail,req.body.cmobile,req.body.eid],function(error,result){
       if(error)
       {
        res.redirect('/student/displayAll')
   
       }
       else
       {  res.redirect('/student/displayAll')
     }
      })
     }
     else{
   
       pool.query("delete from fields  where id=?",[req.body.eid],function(error,result){
         if(error)
         {
          res.redirect('/student/displayAll')
     
         }
         else
         {  res.redirect('/student/displayAll')
       }
          })
     }
   });
   



router.post('/updateImg', multer.single('cpicture'),function(req,res,next){
    pool.query("update fields set picture=? where id=?",[req.file.originalname,req.body.eid], 
    function(error,result){
        if(error)
        {
            res.redirect('/student/displayAll')
        }
        else
        {
            res.redirect('/student/displayAll')
        }
    })
});
/*router.post('/updatepicture',multer.single('picture'),function(req, res, next) {
    pool.query("update products set productpicture=? where productid=?",[req.file.originalname,req.body.productid],
    function(err,result){
     if(err)
     { res.redirect('/samsung/displayall')}
     else
     { res.redirect('/samsung/displayall')}
    
    })
    
    });*/




module.exports = router;
