const errorHandlerMiddleWare = async (err, req, res, next) => {
    console.log(err);
    return res.status(500).json({mgs: "Something went wrong."});
}

module.exports = errorHandlerMiddleWare