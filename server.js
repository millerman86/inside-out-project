const express = require('express')
const app = express() 
const morgan = require('morgan')
const mongoose = require('mongoose')
/* Error handling for jwt
The default behavior is to throw an error when the token is
invalid, so you can add your custom logic to manage unauthorized access as follows: */
const expressjwt = require('express-jwt')
const cors = require('cors')
const path = require("path")
require("dotenv").config()

const port = process.env.PORT || 5000;
const mongouri = process.env.MONGODB_URI || 'mongodb://localhost:27017/inside-out-project'

// ... other app.use middleware 
app.use(express.static(path.join(__dirname, "client", "build")))

app.use(cors())
app.use(express.json())
app.use(morgan('dev'))

mongoose.connect(
    mongouri, // all collections will go into one database entry
    {
        useNewUrlParser: true, 
        useUnifiedTopology: true, 
        useCreateIndex: true,
        useFindAndModify: false
    }, 
    () => console.log('Connected to the DB')
)

app.use('/employees', require('./routes/employeeRouter'))

app.use((err, req, res, next) => {
    console.log(err)
    if (err.name === 'UnauthorizedError') {
        res.status(err.status)
    }
    return res.send({errMsg: err.message})
})



// ...
// Right before your app.listen(), add this:
app.get("*", (req, res) => {
    res.sendFile(path.join(__dirname, "client", "build", "index.html"));
});


app.listen(port, () => {
    console.log('Server is running on local port 9000')
})
