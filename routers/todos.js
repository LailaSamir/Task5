const express = require('express');
const Todo = require('../models/todo');
var jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');
const routerTodos = new express.Router();
//6 Create new todo 

routerTodos.post('/', async(req, res) => {
    try {
        const { body, title, tags } = req.body;
        const { authorization } = req.headers;
        const Data = jwt.verify(authorization, 'secret_sign');
        const todo = await Todo.create({ userid: Data.id, body, title, tags });
        res.statusCode = 201;
        res.json({ todo, Data });
    } catch (err) {
        res.statusCode = 422;
        res.send(err);

    }



})

//7 Return the todos of specific user 
routerTodos.get('/:userId', async(req, res) => {
    try {
        const { id_params } = req.params;
        const { authorization } = req.headers;
        const Data = jwt.verify(authorization, 'secret_sign');
        const todo = await Todo.find({ userid: id_params, userid: Data.id });
        res.statusCode = 201;
        res.send(todo);
    } catch (err) {
        res.statusCode = 422;
        res.send(err);

    }

});



//8
routerTodos.get('/', (req, res) => {
    let limit = req.query.limit;
    let skip = req.query.skip;
    Todo.find({}, 'title body tags', { skip: parseInt(skip), limit: parseInt(limit) }, function(err, todo) {
        if (err) throw err;
        res.send(todo);


    });


})

//9 Edit todo 

routerTodos.patch('/:id', (req, res) => {
    const { id } = req.params;
    const { userid, body, title, tags } = req.body;
    const { authorization } = req.headers;
    const Data = jwt.verify(authorization, 'secret_sign');
    Todo.findOneAndUpdate({ _id: id, userid: Data.id }, { userid: userid, body: body, title: title, tags: tags }, function(err, todo) {
        if (err) return handleError(err);

        res.send(todo);


    });


});

//10 delete todo
routerTodos.delete('/:id', (req, res) => {
    const { id } = req.params;
    const { authorization } = req.headers;
    const Data = jwt.verify(authorization, 'secret_sign');
    Todo.deleteOne({ _id: id, userid: Data.id }, function(err) {
        if (err) return handleError(err);
        else res.send({ success: true })
    });

})

module.exports = routerTodos;