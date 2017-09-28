var express = require("express");
var app = express();

app.get('/add(/:value1)?(/:value2)?', function(req, res){
    console.log('[INFO] Recieved request at ', req.url);
    error_res = "";
    if (!("value1" in req.params) || (typeof req.params.value1 == 'undefined')){
    	error_res += " <value1> needs to be present";
    }
    if (!("value2" in req.params) || (typeof req.params.value2 == 'undefined')){
    	error_res += " <value2> needs to be present";
    }

    var value1 = parseInt(req.params.value1);
    var value2 = parseInt(req.params.value2);

    if (isNaN(value1)){
    	error_res += " <value1> must be a number";
    }

    if (isNaN(value2)){
    	error_res += " <value2> must be a number";
    }

    if (error_res.length > 0 ){
    	res.status(400).send({"status code": 400, "status string": "400 Bad Request","message": error_res});
    	return;
    }
    result = {"result": value1 + value2};
  	res.send(result);
});

var port = 8080;
app.listen(port, function(){
    console.log('[INFO] Listening at: http://127.0.0.1:8080');
});