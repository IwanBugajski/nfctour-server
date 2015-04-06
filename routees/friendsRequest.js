var models = require("../models.js");
var login = require("./login.js");
var commons = require('../commons.js');

var invite = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.body.name}, function(err, users){
			if((!err) && (users.length != 0)) {
				var user = users[0];
				
				return models.UserModel.find({name: request.params.user}, function(err, users){
					if((!err) && (users.length != 0)) {
						var invited = users[0];
						
						if(user._id == invited._id) return response.send(new commons.errorMsg("You can't invite yourself"));
						
						return models.FriendsModel.count({$or : [{user1 : user._id, user2 : invited._id}, {user1 : invited._id, user2 : user._id}]}, function(err, cnt){
							if(!err){
								if(cnt != 0){
									return response.send(new commons.errorMsg("You are already a friend with " + invited.name));
								}
								else {
									return models.FriendRequestModel.find({$or : [{origin : user._id, destination : invited._id}, {origin : invited._id, destination : user._id}]}, function(err, requests){
										if(!err){
											//check for invitation duplicates
											if(requests.length == 0){
												var invitation = new models.FriendRequestModel({
													origin : user._id,
													destination : invited._id,
													date : new Date()
												});
												
												return invitation.save(function(err){
													if(!err) return response.send(new commons.successMsg(commons.SUCCESS));
													else return response.send(new commons.errorMsg(commons.ERROR));
												});
											}
											else {
												var invitation = requests[0];
												if(invitation.origin == user._id) return response.send(new commons.errorMsg("You have already invited " + invited.name));
												else return response.send(new commons.errorMsg("You have been invited by " + invited.name + ". Accept this invitation."));
											}
										}
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
			}
			else {
				return response.send(new commons.errorMsg(commons.ERROR));
			}
		});
	});
}

var accept = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.body.name}, function(err, users){
			if((!err) && (users.length != 0)) {
				var user = users[0];
				
				return models.FriendRequestModel.find({_id : request.params.request}, function(err, requests){
					if((!err) && (requests.length != 0)){
						if(requests[0].destination != user._id){
							return response.send(new commons.errorMsg("This invitation is not yours"));
						}
						else {
							var friendShip = new models.FriendsModel({
								user1 : requests[0].origin,
								user2 : user._id
							});
							
							return friendShip.save(function(err){
								if(!err) {
									//remove accepted invitation
									return requests[0].remove(function(err){
										if(!err) return response.send(new commons.successMsg(commons.SUCCESS));
										else return response.send(new commons.errorMsg(commons.ERROR));
									});
								}
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



var cancel = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.body.name}, function(err, users){
			if((!err) && (users.length != 0)) {
				var user = users[0];
				
				return models.FriendRequestModel.find({_id : request.params.request}, function(err, requests){
					if((!err) && (requests.length != 0)) {
						var cancelledRequest = requests[0];
						//check if user is creator of this invitation
						if(cancelledRequest.origin != user._id){
							response.send(new commons.errorMsg(commons.ERROR));
						}
						//delete invitation
						else {
							return cancelledRequest.remove(function(err){
								if(!err) return response.send(new commons.successMsg(commons.SUCCESS));
								else return response.send(new commons.errorMsg(commons.ERROR));
							});
						}
					}
					else response.send(new commons.errorMsg(commons.ERROR));
				});
			}
			else {
				return response.send(new commons.errorMsg(commons.ERROR));
			}
		});
	});
}

var deny = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.body.name}, function(err, users){
			if((!err) && (users.length != 0)) {
				var user = users[0];
				
				return models.FriendRequestModel.find({_id : request.params.request}, function(err, requests){
					if((!err) && (requests.length != 0)) {
						var deniedRequest = requests[0];
						//check if user is recipient of this invitation
						if(deniedRequest.destination != user._id){
							response.send(new commons.errorMsg(commons.ERROR));
						}
						//delete invitation
						else {
							return deniedRequest.remove(function(err){
								if(!err) return response.send(new commons.successMsg(commons.SUCCESS));
								else return response.send(new commons.errorMsg(commons.ERROR));
							});
						}
					}
					else response.send(new commons.errorMsg(commons.ERROR));
				});
			}
			else {
				return response.send(new commons.errorMsg(commons.ERROR));
			}
		});
	});
}

var mine = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.body.name}, function(err, users){
			if((!err) && (users.length != 0)) {
				var user = users[0];
				
				return models.FriendRequestModel.find({origin : user._id}, function(err, requests){
					if(!err) return response.send(new commons.successMsg(requests));
					else response.send(new commons.errorMsg(commons.ERROR));
				});
			}
			else {
				return response.send(new commons.errorMsg(commons.ERROR));
			}
		});
	});
}

var toMe = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.body.name}, function(err, users){
			if((!err) && (users.length != 0)) {
				var user = users[0];
				
				return models.FriendRequestModel.find({destination : user._id}, "origin").populate("origin", "name").exec(function(err, requests){
					if(!err) return response.send(new commons.successMsg(requests));
					else response.send(new commons.errorMsg(commons.ERROR));
				});
			}
			else {
				return response.send(new commons.errorMsg(commons.ERROR));
			}
		});
	});
}

module.exports = {
	invite : invite,
	accept : accept,
	deny : deny,
	cancel : cancel,
	mine : mine,
	toMe : toMe
}