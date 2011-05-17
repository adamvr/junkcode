function isJson(req, res, next) {
    if(req.is('application/json')) {
	next();
    } else {
	next(new Error("Invalid request type"));
    }
}

module.exports.isJson = isJson
