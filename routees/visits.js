var models = require("../models.js");
var login = require("./login.js");
var commons = require('../commons.js');

var visit = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.body.name}, function(err, users){
			if((!err) && (users.length != 0)) {
				var user = users[0];
				
				return models.VisitsModel.count({visitor : user._id, visited : request.params.slides}, function(err, cnt){
					if(!err){
						//add info about visit
						if(cnt == 0){
							var visit = new models.VisitsModel({
								visitor : user._id,
								visited : request.params.slides,
								time : new Date().getTime()
							});
							
							return visit.save(function(err){
								if(!err) return response.send(new commons.successMsg(commons.SUCCESS));
								else return response.send(new commons.errorMsg(commons.ERROR));
							});
						}
					}
					else {
						return response.send(new commons.errorMsg(commons.ERROR));
					}
				});
			}
			else {
				return response.send(new commons.errorMsg(commons.ERROR));
			}			
		});
	});
}


var visitedSlides = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.body.name}, function(err, users){
			if((!err) && (users.length != 0)) {
				var user = users[0];
				
				return models.VisitsModel.find({visitor : user._id}).populate("visited").exec(function(err, visited) {
					if(!err) {
						var result = [];
						for(var i = 0; i < visited.length; i++){
							var visitedSlide = {
								title : visited[i].visited.title,
								category : visited[i].visited.category,
								latitude : visited[i].visited.latitude,
								longitude : visited[i].visited.longitude,
								time : visited[i].time
							}

							result[i] = visitedSlide;
						}
						return response.send(new commons.successMsg(result));
					}
					else return response.send(new commons.errorMsg(commons.ERROR));
				});
			}
			else {
				return response.send(new commons.errorMsg(commons.ERROR));
			}
		});
	});
}


module.exports = {
	visit : visit,
	visitedSlides : visitedSlides
}