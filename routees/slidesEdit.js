var models = require("../models.js");
var login = require("./login.js");
var commons = require('../commons.js');

var slideShowLimit = 5;

var create = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.body.name}, function(err, users){
			if(!err) {
				if(users.length != 0){
					var user = users[0];
					return models.SlideShowModel.count({creator: user._id}, function(err, slideShowCnt) {
						if(!err){
							if(slideShowCnt < slideShowLimit){
								var slideShow = new models.SlideShowModel({
									title : request.body.title,
									description : request.body.description,
									category : request.body.category,
									creator : user._id,
									latitude : request.body.latitude,
									longitude : request.body.longitude
								});
								
								return slideShow.save(function( err ) {
									if( !err ) {
										return response.send(new commons.successMsg(slideShow._id));
									} else {
										return response.send(new commons.errorMsg(commons.ERROR));
									}
								});
							}
							else {
								return response.send(new commons.errorMsg("Maximum number of slide shows per user is 5"));
							}
						}
						else {
							return response.send(new commons.errorMsg(commons.ERROR));
						}
					});
				}
			}
			else {
				return response.send(new commons.errorMsg(commons.ERROR));
			}
		});
	});
}

var edit = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.body.name}, function(err, users){
			if((!err) && (users.length != 0)){
				var user = users[0];
				return models.SlideShowModel.find({_id : request.params.id}, function(err, slideShows) {
					if((err) || (slideShows.length == 0)){
						return response.send(new commons.errorMsg(commons.ERROR));
					}
					
					var slideShow = slideShows[0];
					if(slideShow.creator != user.id){
						return response.send(new commons.errorMsg(commons.DENIED));
					}
					//set new values
					if(request.body.title) slideShow.title = request.body.title;
					if(request.body.description) slideShow.description = request.body.description;
					if(request.body.category) slideShow.category = request.body.category;
					if(request.body.latitude) slideShow.latitude = request.body.latitude;
					if(request.body.longitude) slideShow.longitude = request.body.longitude;
					
					return slideShow.save(function( err ) {
						if( !err ) {
							return response.send(new commons.successMsg(slideShow));
						} else {
							return response.send(new commons.errorMsg(commons.ERROR));
						}
					});
				});
			}
			else {
				return response.send(new commons.errorMsg(commons.ERROR));
			}
		});
	});
}

var deleteSlide = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.body.name}, function(err, users){
			if((!err) && (users.length != 0)){
				var user = users[0];
				return models.SlideShowModel.find({_id : request.params.id}, function(err, slideShows) {
					if((err) || (slideShows.length == 0)){
						return response.send(new commons.errorMsg(commons.ERROR));
					}
					
					var slideShow = slideShows[0];
					if(slideShow.creator != user.id){
						return response.send(new commons.errorMsg(commons.DENIED));
					}
					
					return slideShow.remove(function( err ) {
						if( !err ) {
							return response.send(new commons.successMsg(commons.SUCCESS));
						} else {
							return response.send(new commons.errorMsg(commons.ERROR));
						}
					});
				});
			}
			else {
				return response.send(new commons.errorMsg(commons.ERROR));
			}
		});
	});
}

module.exports = {
	create : create,
	edit : edit,
	deleteSlide : deleteSlide
}