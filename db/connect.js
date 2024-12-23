const mongoose = require('mongoose')

const connectDB = (url) => {
    // Return a promise
    return mongoose
        .connect(url)
        .then(() => console.log("Connected to Database"))
        .catch((err) => console.log(err));
}

module.exports = connectDB;