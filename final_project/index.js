const express = require('express');
const jwt = require('jsonwebtoken');
const session = require('express-session')
const customer_routes = require('./router/auth_users.js').authenticated;
const genl_routes = require('./router/general.js').general;

const app = express();

app.use(express.json());

app.use("/customer",session({secret:"fingerprint_customer",resave: true, saveUninitialized: true}))

app.use("/customer/auth/*", function auth(req,res,next){
    if(req.session.authorization){
        const token = req.session.authorization["accessToken"];
        jwt.verify(token, "access", (err, payload) => {
            if(!err){
                req.user = payload.user;
                console.log("user", payload.user);
                next();
            } else {
                return res.status(403).json({message: "You don't have permissions to access this information!"});
            }
        });
    } else {
        return res.status(404).json({message:"You need to login to access this information."});
    }

});
 
const PORT =3000;

app.use("/customer", customer_routes);
app.use("/", genl_routes);

app.listen(PORT,()=>console.log(`Server is running on port: ${PORT}`));
