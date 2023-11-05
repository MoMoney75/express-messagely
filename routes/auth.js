const express = require('express')
const router = new express.Router()
const User = require("../models/user")
const {SECRET_KEY} = require("../config")
const expressError = require("../expressError")
const jwt = require('jsonwebtoken')


/** POST /login - login: {username, password} => {token}
 *
 * Make sure to update their last-login!
 *
 **/

router.post('/login', async(request,response,next)=>{
const {username,password} = request.body;
try{
 let user = await User.authenticate(username,password)
if(user){
    let token = jwt.sign({username}, SECRET_KEY);
    await User.updateLoginTimestamp(username)
    return response.json({token})
}

else{
    throw new expressError("Invalid username or password",400)
}
}
catch(e){
    return next(e)
}

})

/** POST /register - register user: registers, logs in, and returns token.
 *
 * {username, password, first_name, last_name, phone} => {token}.
 *
 *  Make sure to update their last-login!
 */

router.post('/register', async(request,response,next)=>{
const {username, password, first_name, last_name, phone} = request.body
try{
    const user = await User.register(username, password, first_name, last_name, phone)

        let token = jwt.sign({user}, SECRET_KEY);
        await User.updateLoginTimestamp(user);
        return response.json({token})
    
}

catch(e){
    return next(e)
}

})

module.exports = router;
