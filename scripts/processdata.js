
var fs = require('fs');
var readline = require('readline');
var _ = require('underscore');
var jf = require('jsonfile');
var util = require('util');

jf.spaces = 0;

//read the file
var fileName = 'student-por';
fs.readFile(fileName + '.csv', 'utf8', function (err,data) {
	if (err) {
		return console.log(err);
	}
	data = data.replace(/\"/g,"");
	var datas = data.split("\n");
	var column = datas[0].split(";");
	var result = [];

	for(var i = 1 ; i < datas.length - 1; i++) {
		var obj = {};
		var values = datas[i].split(";");

		for(var k = 0; k < column.length ; k++) {

			obj[column[k]] = isNaN(values[k]) ? values[k] : parseInt(values[k]);
			if(values[k] === "no")
				obj[column[k]] = false;
			if(values[k] === "yes")
				obj[column[k]] = true;

			
		}

		obj["averageScore"] = (obj["G3"] + obj["G2"] + obj["G1"])/3;
		obj["badAssScore"] = (obj["Walc"]*1.5 + obj["Dalc"] + obj["absences"] )/3.5;
		if(obj["guardian"] === "mother"){
			obj["familyScore"] = (obj["Medu"]*1.5 + obj["Fedu"] + obj["famrel"] )/3.5;
		}else if(obj["guardian"] === "father"){
			obj["familyScore"] = (obj["Medu"] + obj["Fedu"]*1.5 + obj["famrel"] )/3.5;
		} else {
			obj["familyScore"] = (obj["Medu"] + obj["Fedu"] + obj["famrel"] )/3;
		}
		
		result.push(obj);
	}
	
	console.log('processed :',result.length,'student datas');

	jf.writeFile(fileName + '.json', result, function(err) {
	 	
	});

	jf.writeFile(fileName +'-columns' + '.json', {columns : column}, function(err) {
	 	
	});
});
