const express = require('express');
const router = new express.Router();
const User = require("../models/user");
const {SECRET_KEY, DB_URI} = require("../config");
const expressError = require("../expressError");
const jwt = require('jsonwebtoken');
const ExpressError = require('../expressError');
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");



/** GET / - get list of users.
 *
 * => {users: [{username, first_name, last_name, phone}, ...]}
 *
 **/

router.get('/', ensureLoggedIn, async(request,response,next) =>{
   
try{
    let allUsers = await User.all()
    return response.json({allUsers});
}
    catch(e){
            return next(e)
    }
})



/** GET /:username - get detail of users.
 *
 * => {user: {username, first_name, last_name, phone, join_at, last_login_at}}
 *
 **/

router.get('/:username', ensureCorrectUser,async(request,response,next) => {
    let username = request.params.username;
    try{
       if(username){ 
       let user = await User.get(username)
       return response.json({user})
    }
    else{
        throw new ExpressError(`${username} does not exist`,400)
    }
}
    catch(e){
            return next(e);
    }
})


/** GET /:username/to - get messages to user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 from_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router.get('/:username/to', ensureCorrectUser,async(request,response,next) =>{
    let username = request.params.username;
    
    try{
        if(username){
        let messages = await User.messagesTo(username);
        return response.json({messages})}

        else{
            throw new expressError(`${username} does not exist`,400)
        }
    }

    catch(e){
        return next(e)
    }

})


/** GET /:username/from - get messages from user
 *
 * => {messages: [{id,
 *                 body,
 *                 sent_at,
 *                 read_at,
 *                 to_user: {username, first_name, last_name, phone}}, ...]}
 *
 **/

router('/:username/from', ensureCorrectUser,async(request,response,next) =>{
    let username = request.params.username;
    try{
        if(username){
            let messages = User.messagesFrom(username);
            return response.json({messages})
        }
        else{
           throw new expressError(`${username} does not exist`) 

        }
    }

    catch(e){
        return next(e)
    }
})

module.exports = router;