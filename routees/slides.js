var models = require("../models.js");
var login = require("./login.js");
var commons = require('../commons.js');

var slidesByUser = function(request, response) {
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.params.user}, function(err, users){
			if(!err) {
				if(users.length != 0){
					var user = users[0];
					return models.SlideShowModel.find({creator: user._id}, function(err, slideShows) {
						if(!err){
							return response.send(new commons.successMsg(slideShows));
						}
						else {
							return response.send(new commons.errorMsg(commons.ERROR));
						}
					});
				}
				else {
					return response.send(new commons.successMsg([]));
				}
			}
			else {
				return response.send(new commons.errorMsg(commons.ERROR));
			}
		});
	});
}

var slidesByUserCnt = function(request, response) {
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.params.user}, function(err, users){
			if(!err) {
				if(users.length != 0){
					var user = users[0];
					return models.SlideShowModel.count({creator: user._id}, function(err, slideShowCnt) {
						if(!err){
							return response.send(new commons.successMsg(slideShowCnt));
						}
						else {
							return response.send(new commons.errorMsg(commons.ERROR));
						}
					});
				}
				else {
					return response.send(new commons.successMsg(0));
				}
			}
			else {
				return response.send(new commons.errorMsg(commons.ERROR));
			}
		});
	});
}

var slidesById = function(request, response) {
	return login.checkLogin(request, response, function(request, response){
		return models.SlideShowModel.find({_id: request.params.id}, function(err, slideShows) {
			if(!err){
				return response.send(new commons.successMsg(slideShows));
			}
			else {
				return response.send(new commons.errorMsg(commons.ERROR));
			}
		});
	});
}

var slides = function(request, response) {
	return login.checkLogin(request, response, function(request, response){
		return models.SlideShowModel.find(function(err, slideShows) {
			if(!err){
				return response.send(new commons.successMsg(slideShows));
			}
			else {
				return response.send(new commons.errorMsg(commons.ERROR));
			}
		});
	});
}

var slidesByCategory = function(request, response) {
	return login.checkLogin(request, response, function(request, response){
		return models.SlideShowModel.find({category: request.params.category}, function(err, slideShows) {
			if(!err){
				return response.send(new commons.successMsg(slideShows));
			}
			else {
				return response.send(new commons.errorMsg(commons.ERROR));
			}
		});
	});
}

var slidesByName = function(request, response) {
return login.checkLogin(request, response, function(request, response){
		return models.SlideShowModel.find(function(err, slideShows) {
			if(!err){
				var name = request.params.name;
				var result = [];
				
				for(var i = 0; i < slideShows.length; i++){
					var slideShow = slideShows[i];
					if((slideShow.description.search(name) != -1) || (slideShow.title.search(name) != -1)) {
						result[result.length] = slideShow;
					}						
				}
				
				return response.send(new commons.successMsg(result));
			}
			else {
				return response.send(new commons.errorMsg(commons.ERROR));
			}
		});
	});
}

var slidesByLocation = function(request, response) {
	return login.checkLogin(request, response, function(request, response){
		return models.SlideShowModel.find(function(err, slideShows) {
			if(!err){
				var longitude = request.params.longitude;
				var latitude = request.params.latitude;
				var range = request.params.range;
				var result = [];
				
				for(var i = 0; i < slideShows.length; i++){
					if(Math.abs(slideShows[i].latitude - latitude) <= range){
						if(Math.abs(slideShows[i].longitude - longitude) <= range){
							result[result.length] = slideShows[i];
						}
					}
				}
				
				return response.send(new commons.successMsg(result));
			}
			else {
				return response.send(new commons.errorMsg(commons.ERROR));
			}
		});
	});
}

var slidesSearch = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		var query = request.params.text.replace('+', ' ');
		return models.SlideShowModel.find({ $text: { $search: query}}, function(err, slideShows) {
			if(!err) {
				var longitude = request.body.longitude;
				var latitude = request.body.latitude;
				var range = request.body.range;
				
				//find slide shows in the nearby
				if(longitude && latitude){
					var result = [];
					if(!range) range = 1.0;
					
					for(var i = 0; i < slideShows.length; i++){
						if(Math.abs(slideShows[i].latitude - latitude) <= range){
							if(Math.abs(slideShows[i].longitude - longitude) <= range){
								result[result.length] = slideShows[i];
							}
						}
					}
					return response.send(new commons.successMsg(result));
				}
				//else return all results
				else return response.send(new commons.successMsg(slideShows));
			}
			else return response.send(new commons.errorMsg(commons.ERROR));
		});
	});
}

module.exports = {
	slidesByUser : slidesByUser,
	slidesByUserCnt : slidesByUserCnt,
	slidesById : slidesById,
	slides : slides,
	slidesByCategory : slidesByCategory,
	slidesByName : slidesByName,
	slidesByLocation : slidesByLocation,
	slidesSearch : slidesSearch
}