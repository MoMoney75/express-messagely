const express = require('express');
const router = new express.Router();
const Message = require("../models/message");
const {SECRET_KEY, DB_URI} = require("../config");
const expressError = require("../expressError");
const jwt = require('jsonwebtoken');
const ExpressError = require('../expressError');
const {ensureLoggedIn, ensureCorrectUser} = require("../middleware/auth");


/** GET /:id - get detail of message.
 *
 * => {message: {id,
 *               body,
 *               sent_at,
 *               read_at,
 *               from_user: {username, first_name, last_name, phone},
 *               to_user: {username, first_name, last_name, phone}}
 *
 * Make sure that the currently-logged-in users is either the to or from user.
 *
 **/

router.get('/:id', ensureLoggedIn, async(request,response,next) =>{
    let {id} = request.params;
    try{
        if(id){
            let message = await Message.get(id)
            return response.json({message})
        }
        else{
            throw new expressError(`message with id of ${id} does not exist`,400)
        }

    }
    catch(e){
        return next(e)
    }
})

/** POST / - post message.
 *
 * {to_username, body} =>
 *   {message: {id, from_username, to_username, body, sent_at}}
 *
 **/


router.post('/', ensureCorrectUser, async(request,response,next) =>{
    let {from_username,to_username, body} = request.body;
    try{
        let newMessage = await Message.create(from_username,to_username,body)
        return response.json({newMessage})
    }

    catch(e){
        return next(e)
    }
})
/** POST/:id/read - mark message as read:
 *
 *  => {message: {id, read_at}}
 *
 * Make sure that the only the intended recipient can mark as read.
 *
 **/


router.post('/:id/read', ensureCorrectUser, async(request,response,next)=>{
    let {id} = request.params
    try{
        Message.markRead(id)

    }

    catch(e){
        return next(e)
    }
})