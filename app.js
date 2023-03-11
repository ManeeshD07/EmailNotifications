const express=require("express");
const bodyParser=require("body-parser");
const nodemailer = require("nodemailer");


const mongoose = require('mongoose');
mongoose.connect('mongodb://localhost:27017/mydb');
var db=mongoose.connection;
db.on('error', console.log.bind(console, "connection error"));
db.once('open', function(callback){
   console.log("connection succeeded");
})
var app=express()

app.use(bodyParser.json());
app.use(express.static('public'));
app.use(bodyParser.urlencoded({
   extended: true
}));

app.post('/sign_up', async (req,res) => {
   var name = req.body.name;
   var email =req.body.email;
   var pass = req.body.password;
   var phone =req.body.phone;

   var data = {
      "name": name,
      "email":email,
      "password":pass,
      "phone":phone
   }
   db.collection('details').insertOne(data,function(err, collection){
   if (err) throw err;
      console.log("Record inserted Successfully");
   });
    let transporter = nodemailer.createTransport({
        host: "smtp.ethereal.email",
        port: 587,
        secure: false, // true for 465, false for other ports
        auth: {
            user: 'hadley21@ethereal.email', // ethereal user
            pass: 'rsc5nfractkQcwbMT2', // ethereal password
        },
    });

    const msg = {
        from: '"Ecoshop" <ecoshop@example.com>', // sender address
        to: `${email}`, // list of receivers
        subject: "Sup", // Subject line
        text: "Long time no see", // plain text body
    }
        // send mail with defined transport object
        const info = await transporter.sendMail(msg);

        console.log("Message sent: %s", info.messageId);
        // Message sent: <b658f8ca-6296-ccf4-8306-87d57a0b4321@example.com>

        // Preview only available when sending through an Ethereal account
        console.log("Preview URL: %s", nodemailer.getTestMessageUrl(info));
        // Preview URL: https://ethereal.email/message/WaQKMgKddxQDoou...

   return res.redirect('success.html');
})

app.get('/',function(req,res){
   res.set({
      'Access-control-Allow-Origin': '*'
   });
   return res.redirect('index.html');
}).listen(3000)

console.log("server listening at port 3000");
