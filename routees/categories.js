var models = require("../models.js");
var commons = require('../commons.js');

var getCategories = function(request, response){
	return models.CategoryModel.find(function(err, categories){
		if(!err){
			return response.send(new commons.successMsg(categories));
		}
		else {
			return response.send(new commons.errorMsg(commons.ERROR));
		}
	});
}

module.exports = {
	getCategories : getCategories
}