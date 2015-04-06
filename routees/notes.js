var models = require("../models.js");
var login = require("./login.js");
var commons = require('../commons.js');

var rate = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.body.name}, function(err, users){
			if((!err) && (users.length != 0)) {
				var user = users[0];
				
				return models.NotesModel.count({user : user._id, slideShow : request.params.slides}, function(err, cnt){
					if(!err){
						//create rate
						if(cnt == 0){
							var rate = new models.NotesModel({
								slideShow : request.params.slides,
								user : user._id,
								note : request.body.note
							});
							return rate.save(function(err){
								if(!err) return response.send(new commons.successMsg(commons.SUCCESS));
								else return response.send(new commons.errorMsg(commons.ERROR));
							});
						}
						//send info about exceeded number of notes
						else {
							return response.send(new commons.errorMsg("You have already rated this slide show"));
						}
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

var notesByUser = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.params.user}, function(err, users){
			if((!err) && (users.length != 0)) {
				var user = users[0];
				
				return models.NotesModel.find({user : user._id}, function(err, notes){
					if(!err) return response.send(new commons.successMsg(notes));
					else return response.send(new commons.errorMsg(commons.ERROR));
				});
			}
			else {
				return response.send(new commons.errorMsg(commons.ERROR));
			}
		});
	});
}

var avgSlidesRate = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.NotesModel.find({slideShow : request.params.slides}, function(err, notes){
			if(!err) {
				//no rates -> avg = 0
				if(notes.length == 0) return response.send(new commons.successMsg(0));
				
				//calculate average of notes
				var sum = 0;
				for(var i = 0; i < notes.length; i++){
					sum += notes[i].note;
				}
				return response.send(new commons.successMsg(sum / notes.length));
			}
			else return response.send(new commons.errorMsg(commons.ERROR));
		});
	});
}

module.exports = {
	rate : rate,
	notesByUser : notesByUser,
	avgSlidesRate : avgSlidesRate
}