var mysql = require('mysql');
var express= require('express');
var app=express();
var bodyParser=require('body-parser');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

var session= require('express-session');
app.use(session({
  secret: 'kavyasingaravel',
 resave: true,
  rolling: true,
  saveUninitialized: true,
   cookie: { expires:900000}
   }));

var con = mysql.createConnection({
host: 'localhost',
  user: 'root',
  password: 'admin',
  database: 'mykldb'

});
con.connect(function(err) {
  if (err){
			console.log('Failure to connect to database');
			throw err;
		} 
  console.log("Connection to database is established!");
  });

app.post('/login', function (req, res) {
	console.log(req.body);
	var uname=req.body.username;
	var pwd= req.body.password;
    con.query('SELECT * FROM users where name=? and  pass=?', [uname,pwd], function (err, results, fields) {
		if (!err && (results.length<=0 || !uname || !pwd )) 
		res.json({'message':'There seems to be an issue with the username/password combination that you entered'});	
		else if (err)
				res.json({'message':'There seems to be an issue with the username/password combination that you entered'});	
		else
		{			
		req.session.uname  = results[0].fname;
		res.json({ 'message':'Welcome '+req.session.uname});
		
		}
// console.log(fields.length);
// console.log(results.length);
		});
});
app.post('/add',function (req, res) {
	var sessionname= req.session.uname; 
	if(sessionname==null || sessionname== 'undefined')
		res.json({'message':'You are not currently logged in'});
	else {
	var x= req.body.num1;
	var y=req.body.num2;
	if(!x || isNaN(x) || !y || isNaN(y) )
		res.json({'message':'The numbers you entered are not valid'})
	else
	res.json({'message':'The action was successful', 'result':+((1*x)+(1*y))})
	}
});
app.post('/divide',function (req, res) {
	var sessionname= req.session.uname; 
	if(sessionname==null || sessionname== 'undefined')
		res.json({'message':'You are not currently logged in'});
	else{
	var x= req.body.num1;
	var y=req.body.num2;
	if(!x || isNaN(x) || !y || isNaN(y) || (1*y)==0 )
		res.json({'message':'The numbers you entered are not valid'})
	else
	res.json({'message':'The action was successful', 'result':+((1*x)/(1*y))})
	}
});
app.post('/multiply',function (req, res) {
	var sessionname= req.session.uname; 
	if(sessionname==null || sessionname== 'undefined')
		res.json({'message':'You are not currently logged in'});
	else{
	var x= req.body.num1;
	var y=req.body.num2;
	if(!x || isNaN(x) || !y || isNaN(y) )
		res.json({'message':'The numbers you entered are not valid'})
	else
	res.json({'message':'The action was successful', 'result':+((1*x)*(1*y))})
	}
});
app.post('/logout', function(req, res) {
	var uname= req.session.uname;
	if(uname==null || uname== 'undefined')
		res.json({'message': 'You are not currently logged in'})
	else{
		req.session.destroy();
	res.json({'message': 'You have been successfully logged out'})
	
});

app.listen(5000, function () {
    console.log('EDISS project1 by kavya is running on port 5000');
});
	
