const express = require('express');
const mongodb = require('mongodb');
const app = express();
const bodyParser = require('body-parser');

app.use(bodyParser.json());
app.use(express.static(__dirname + '/Assignment3'));

var mongoClient = mongodb.MongoClient;
var url = "mongodb://prem:Dnfylwl,89@ec2-54-162-116-229.compute-1.amazonaws.com:27017/";



//Function for checking mongodb connection
mongoClient.connect(url, function(err,db){
	if(err)
		throw err;
	console.log('Mopongodb connected');
	db.close;
});

//Finction to retrieve whole books
app.get('/allbooksinfo', (req,res) => {
	mongoClient.connect(url, function(err,db) {
	if(err)
		throw err;
	var Dbo = db.db("assignment3");
	Dbo.collection("Books").find({}).toArray(function(err, result) {
		if (err) throw err;
		res.json(result);
		db.close();
		console.log(result);
	});
	});
});
// {$or: [{Title: /^word/}, {Author: /^word/}]}
// Function to search for single or multiple keywords key word
app.get('/search/:name', (req, res) => {
	mongoClient.connect(url, function(err, db){
	if(err)
		throw err;
	var Dbo = db.db("assignment3");
	Dbo.collection("Books").createIndex({Title: "text", Author: "text"});
	var Str = "\"".concat(req.params.name).concat("\"");
	var word = req.params.name;
	Dbo.collection("Books").find({$text : {$search : Str}}).toArray(function(err, result){
		if(err) throw err;
		res.json(result);
		module.exports.logfile(req.params.name);

        if(result.length > 0) {
            module.exports.catalog(req.params.name, result);
        }
		db.close();
		console.log(result);
	});
});
});

module.exports = {

    logfile: function(searchStr){
        
		var Array = [];
		var fs = require('fs');
        var obj = {};
        fs.readFile('./Jsonfiles/log.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {
            jsonObj = JSON.parse(data);
            var keyfound = false;
            for (var index in jsonObj) {
                if (jsonObj[index].keyword == searchStr) {
                    jsonObj[index].timestamp.push(Date.now());
                    jsonObj[index].count += 1;
                    keyfound = true;
                }
            } 
            if (keyfound == false){ 
                obj["keyword"] = searchStr;
                obj["count"] = 1;
                Array.push(Date.now());
                obj["timestamp"] = Array;
                jsonObj.push(obj);
            }
            jsonString = JSON.stringify(jsonObj);
            fs.writeFile('./Jsonfiles/log.json', jsonString, 'utf8', function (err) {
                if (err) throw err;
                console.log('Saved keyword in logfile!');
            });
        }});
    },

    catalog: function(searchStr, result){
        var fs = require('fs');
        fs.readFile('./Jsonfiles/catalog.json', 'utf8', function readFileCallback(err, data){
            if (err){
                console.log(err);
            } else {

            jsonObj = JSON.parse(data);

            jsonObj.push({keyword: searchStr, result: result});

            jsonString = JSON.stringify(jsonObj);
            fs.writeFile('./Jsonfiles/catalog.json', jsonString, 'utf8', function (err) {
                if (err) throw err;
                console.log('Saved the words in catalogfile!');
                console.log(jsonString)
            });
        }});
    }
}


//function to store notes to json file

app.post('/notes',(req,res) => {
	var file = require('fs');
	file.readFile('./Jsonfiles/notes.json', 'utf8', function readFileCallback(err, data){
		keynote = {};
		// console.log(req.body);
		if(err) throw err;

		// JSON.parse(data.notes);
		// // jsonObj = JSON.parse(data);
		// // jsonObj.notes.push(note)
		// note = {};
		// note['keyword'] = req.body['keyword']
		// note['note'] = req.body['note']
		// // data.notes.push(JSON.stringify(note));
		// console.log(data.notes);
		// data.notes.push(note);
		// jsonString = JSON.stringify(data);
		jsonObj = JSON.parse(data);
        keynote['keyword'] = req.body['keyword']
        keynote['note'] = req.body['note']
        jsonObj.notes.push(keynote)
        jsonString = JSON.stringify(jsonObj);
		file.writeFile('./Jsonfiles/notes.json', jsonString, 'utf8', function(err){
			if(err) throw err;
			console.log('saved');
		});
	});
});

//Function to retrieve notes
app.get('/retrievenotes/:name', (req,res) => {

	array = [];
	var fs = require('fs');
	obj = {};

    fs.readFile('./Jsonfiles/notes.json', 'utf8', function readFileCallback(err, data){
        if (err) console.log(err);
        jsonObj = JSON.parse(data);
        for (var keyw in jsonObj.notes) {
            if (jsonObj.notes.hasOwnProperty(keyw) && jsonObj.notes[keyw].keyword == req.params.name) {
                array.push(jsonObj.notes[keyw]);
            }
        }
        res.json(array);
    });
});


app.listen('80', () => {
    console.log('Server started on port 80');
});
