const express = require('express');
const app = express();
app.use(express.static("public"));
var bodyParser = require('body-parser');
require("./DB-connection");
app.use(bodyParser.json())
app.use(express.static('public'));

const routerTodos = require('./routers/todos');
const routerUser = require('./routers/users');

app.use('/todos', routerTodos);
app.use('/users', routerUser);

/***************************************************************************/
//2 Create a middleware that logs the request url, method, and current time 
let middl_logs = (req, res, next) => {
    let current_datetime = new Date();
    let formatted_date =
        current_datetime.getFullYear() +
        "-" +
        (current_datetime.getMonth() + 1) +
        "-" +
        current_datetime.getDate() +
        " " +
        current_datetime.getHours() +
        ":" +
        current_datetime.getMinutes() +
        ":" +
        current_datetime.getSeconds();
    let method = req.method;
    let url = req.url;
    let status = res.statusCode;
    let log = `[${formatted_date}]  ${method}:${url} ${status}`;
    console.log(log);
    next();
};
app.use(middl_logs);

/***************************************************************************/
//-	3 - Create a global error handler that logs the error and return {“error”:”internal server error”} with status code 500 
app.use(function(err, req, res, next) {
        if (!err) {
            return next();
        }
        res.status(500);
        res.send('500: Internal server error');
    }

)




app.listen(3000, () => {
    console.log("server listening on port 3000");
});