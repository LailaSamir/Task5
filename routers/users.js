const express = require('express');
const User = require('../models/user');
const routerUser = new express.Router();
const Todo = require('../models/todo');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const user = require('../models/user');
//1 Register a user
routerUser.post('/register', async(req, res) => {
    // console.log(req.body);
    try {
        const { usrename, password, firstName, age } = req.body;
        const hash = await bcrypt.hash(password, 7);
        const user = await User.create({ usrename, password: hash, firstName, age });
        res.statusCode = 201;
        res.send(user);
    } catch (err) {
        res.statusCode = 422;
        res.send(err);

    }
});




//2 
routerUser.post('/login', async(req, res) => {
    try {
        const { usrename, password } = req.body;
        const userlogin = await User.findOne({ usrename: usrename })
        if (!userlogin) throw " wrong username or passowrd";
        const isMatch = await bcrypt.compare(password, userlogin.password);
        if (!isMatch) throw " wrong username or passowrd";
        const token = jwt.sign({ id: userlogin._id }, 'secret_sign');
        // res.json({ token })
        Todo.find({ userid: userlogin._id }, ' userid title body tags', function(err, todo) {
            if (err) throw err

            res.send(`logged in successfully  ${token} : ${userlogin.firstName ,userlogin.age} :
                ${todo}`);

        })



    } catch (error) {
        console.log(error);
        res.statusCode = 401;
        res.json(error);

    }

});


//3 Return the first name of registered users
routerUser.get('/', async(req, res) => {
    try {
        const { authorization } = req.headers;
        const Data = jwt.verify(authorization, 'secret_sign');
        const user = await User.findOne({ _id: Data.id }, 'firstName ');
        //res.send(user);
        res.send(user)
    } catch (err) {
        res.statusCode = 401;
        res.json({ success: false });

    }

});



//4 Delete the user with selected id 
routerUser.delete('/:id', async(req, res) => {
    try {
        userid = req.param.id;
        const { authorization } = req.headers;
        const Data = jwt.verify(authorization, 'secret_sign');
        await User.deleteOne({
            _id: req.body.id,
            _id: Data.id
        })
        res.json({ success: true })
    } catch (e) {
        console.log(e)
    }

});



//5 Edit the user with the selected id 
routerUser.patch('/:id', async(req, res) => {

    try {
        const { id } = req.params;
        const usrename = req.body.usrename;
        const password = req.body.password;
        const firstName = req.body.firstName;
        const age = req.body.age;

        const { authorization } = req.headers;
        const Data = jwt.verify(authorization, 'secret_sign');
        const user = await User.findOneAndUpdate({
            _id: Data.id,
            _id: id
        }, { usrename: usrename, password: password, firstName: firstName, age: age }, function(err, user) {
            if (err) return handleError(err);

            res.send(`${user} user was edited successfully`);
        })
        res.send(user);
    } catch (err) {
        res.statusCode = 401;
        res.json({ success: false })

    }


})

//////////
// routerUser.get('/profile', async(req, res) => {
//     try {

//         const { authorization } = req.headers;
//         const Data = jwt.verify(authorization, 'secret_sign');
//         const user = await User.findOne({ _id: Data._id }, { password: 0 });
//         //res.send(user);
//         res.json({ user })
//     } catch (err) {
//         res.statusCode = 401;
//         res.json({ success: false })

//     }

// })

module.exports = routerUser;