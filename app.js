var express = require('express');
var app = express();
var path = require('path');
var bodyparser = require('body-parser')
const fs = require('fs');
app.use(bodyparser.urlencoded({extended:false})) 
var AWS = require('aws-sdk');
AWS.config.loadFromPath('./config.json');

// viewed at http://localhost:8080
app.get('/', function(req, res) {


    res.sendFile(path.join(__dirname + '/ui.html'));
});
app.post('/createstack', function(req, res) {
    var stackname,dbname,DBPassword,DBRootPassword,DBuser,instance,SSHlocation;
    
    stackname=req.body.Stackname;
    Dbname=req.body.dbname;
    DBPassword=req.body.admin;
    DBRootPassword=req.body.DBRoot;
    DBuser=req.body.Dbuser;
    instance=req.body.Instancetype;
    Key_name=req.body.Keyname;
    SSHlocation=req.body.SSHLocation;
   /* console.log('Stack name is',stackname);
    console.log('Database name is:',Dbname);
    console.log('Database password is',DBPassword);
    console.log('Database root  is:',DBRootPassword);
    console.log('Database user name is:',DBuser);
    console.log('Instance name is',instance);
    console.log('Keyname is',Key_name);
    console.log('SSHlocation  is:',SSHlocation);*/
    let temp = fs.readFileSync('temp.json');
    console.log(temp);
    let data = JSON.parse(temp);
    data['Parameters']['DBName']['Default']= Dbname;
    data['Parameters']['DBPassword']['Default']= DBPassword;
    data['Parameters']['DBRootPassword']['Default']= DBRootPassword;
    data['Parameters']['DBUser']['Default']= DBuser;
    data['Parameters']['InstanceType']['Default']= instance;
    data['Parameters']['KeyName']['Default'] = Key_name;
    data['Parameters']['SSHLocation']['Default']=  SSHlocation;
   
      var cloudformation = new AWS.CloudFormation();
      var params = {
        StackName: stackname,
        TemplateBody: JSON.stringify(data) ,
        
      };
      
      cloudformation.createStack(params, function(err, data) {
        if (err) console.log(err, err.stack); // an error occurred
        else     console.log("Stack created");           // successful response//data
      });
    
    
    
    console.log(data);

   // console.log(req.body);
});


app.listen(8080);