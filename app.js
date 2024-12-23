const express = require('express')
const connectDB = require('./db/connect')
const router = require('./routes/products')

require('dotenv').config()
// Mongoose throws error for use, otherwise we will have to use try-catch block
require('express-async-errors')

const app = express();

// Middleware
const notFoundMiddleWare = require('./middleware/not_found')
const errorMiddleWare = require('./middleware/error-handler')

app.use(express.json());

// Route
app.get('/', (req, res) => {
    res.status(200).json({"name": "Hello"});
})

// API path with middleware
app.use('/api.v1/products', router);

// Products routes
// If none of the preceding routes or middleware match the request,
// it falls through to the notFoundMiddleWare, which sends a response
// indicating that the route does not exist.
app.use(notFoundMiddleWare);
app.use(errorMiddleWare);

const start = async () => {
    try {
        await connectDB(process.env.MONGO_URI);
        app.listen(3000, () => {
            console.log("Listening on port 3000");
        });
    }
    catch (err) {
        console.log(error);
    }
}

start();