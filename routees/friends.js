var models = require("../models.js");
var login = require("./login.js");
var commons = require('../commons.js');

var friendsByUser = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.params.user}, function(err, users){
			if((!err) && (users.length != 0)) {
				var user = users[0];
				
				return models.FriendsModel.find({$or : [{user1 : user._id}, {user2 : user._id}]}, function(err, friends){
					if(!err){
						var friendsIds = [];
						
						for(var i = 0; i < friends.length; i++){
							if(friends[i].user1 == user._id) friendsIds[friendsIds.length] = friends[i].user2;
							else friendsIds[friendsIds.length] = friends[i].user1;
						}
						
						return models.UserModel.find({"_id" : {$in : friendsIds}}, "name", function(err, friendNames){
							if(!err) response.send(new commons.successMsg(friendNames));
							else return response.send(new commons.errorMsg(commons.ERROR));
						});
						
					}
					else {
						return response.send(new commons.errorMsg(commons.ERROR));
					}					
				});
			}
			else{
				return response.send(new commons.errorMsg(commons.ERROR));
			}
		});
	});
}

var unfriend = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({$or : [{name : request.body.name}, {name : request.params.user}]}, function(err, users){
			if((!err) && (users.length == 2)) {
				//remove friendship info
				return models.FriendsModel.find({$or : [{user1 : users[0]._id, user2 : users[1]._id}, {user1 : users[1]._id, user2 : users[0]._id}]}, function(err, friends){
					var friendShip = friends[0];
					return friendShip.remove(function(err){
						if(!err) return response.send(new commons.successMsg(commons.SUCCESS));
						else return response.send(new commons.errorMsg(commons.ERROR));
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
	friendsByUser : friendsByUser,
	unfriend : unfriend
}