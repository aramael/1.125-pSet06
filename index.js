var express = require("express");
var app = express();

/*Allow JSON Encoded POST Data*/
var bodyParser = require('body-parser');
app.use( bodyParser.json() );       // to support JSON-encoded bodies
app.use(bodyParser.urlencoded({     // to support URL-encoded bodies
  extended: true
})); 

/* Routing */
app.get('/', function(req, res){
    console.log('[INFO] Recieved request at ', req.url);
  	res.sendfile('index.html');
});

app.route('/add(/:value1)?(/:value2)?')
.all(function(req, res, next){
	var dict = (req.method == "GET")?req.params:req.body;
    
    error_res = "";
    if (!("value1" in dict) || (typeof dict.value1 == 'undefined')){
    	error_res += " <value1> needs to be present";
    }
    if (!("value2" in dict) || (typeof dict.value2 == 'undefined')){
    	error_res += " <value2> needs to be present";
    }

    var value1 = parseInt(dict.value1);
    var value2 = parseInt(dict.value2);

    if (isNaN(value1)){
    	error_res += " <value1> must be a number";
    }

    if (isNaN(value2)){
    	error_res += " <value2> must be a number";
    }

    res.locals.result = {"result": value1 + value2};
    res.locals.error_res = error_res;
	next();
})
.get(function(req, res, next){
    console.log('[INFO] Recieved request at ', req.url);

    if (res.locals.error_res.length > 0 ){
    	res.status(400).send({"status code": 400, "status string": "400 Bad Request","message": error_res});
    	return;
    }
  	res.send(res.locals.result);
})
.post(function(req, res, next){
    console.log('[INFO] Recieved request at ', req.url);

    if (res.locals.error_res.length > 0 ){
    	res.status(400).send({"status code": 400, "status string": "400 Bad Request","message": error_res});
    	return;
    }
  	res.send(res.locals.result);
});

app.post('/addArray/', function(req, res){
    console.log('[INFO] Recieved request at ', req.url);

	error_res = "";

    if (!("numbers" in req.body) || (typeof req.body.numbers == 'undefined')){
    	error_res += " <numbers> needs to be present";
    }

    if (!Array.isArray(req.body.numbers)){
    	error_res += " <numbers> needs to be a list";
    }

    if (req.body.numbers.length == 0){
    	error_res += " <numbers> needs to contain at least one integer";
    }

    var result = {"result": 0};
    req.body.numbers.forEach(function(element, index) {
	    var value = parseInt(element);

	    if (isNaN(value)){
	    	error_res += " <index: " + index + ", value: '" + element + "'> must be a number";
	    }else{
		    result.result += element;
		}	    
	});

    if (error_res.length > 0 ){
    	res.status(400).send({"status code": 400, "status string": "400 Bad Request","message": error_res});
    	return;
    }

  	res.send(result);
});

app.post('/numbersGreaterThan/', function(req, res){
    console.log('[INFO] Recieved request at ', req.url);

	error_res = "";

    /* Greater Than Error Correction */
    if (!("greaterThan" in req.body) || (typeof req.body.greaterThan == 'undefined')){
    	error_res += " <greaterThan> needs to be present";
    }

    var minValue = parseInt(req.body.greaterThan);

    if (isNaN(minValue)){
    	error_res += " <greaterThan> must be a number";
    }

    /* Number Error Correction */
    if (!("numbers" in req.body) || (typeof req.body.numbers == 'undefined')){
    	error_res += " <numbers> needs to be present";
    }

    if (!Array.isArray(req.body.numbers)){
    	error_res += " <numbers> needs to be a list";
    }

    if (req.body.numbers.length == 0){
    	error_res += " <numbers> needs to contain at least one integer";
    }

    var result = {"result": []};
    req.body.numbers.forEach(function(element, index) {
	    var value = parseInt(element);
	    if (isNaN(value)){
	    	error_res += " <index: " + index + ", value: '" + element + "'> must be a number";
	    }
	    if (value > minValue){
	    	result.result.push(value);
	    }
	});

    if (error_res.length > 0 ){
    	res.status(400).send({"status code": 400, "status string": "400 Bad Request","message": error_res});
    	return;
    }

  	res.send(result);
});

var port = 8080;
app.listen(port, function(){
    console.log('[INFO] Listening at: http://127.0.0.1:8080');
});