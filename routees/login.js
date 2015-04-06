var models = require("../models.js");
var user = require("./user.js");
var commons = require('../commons.js');

var sessionLifeTime = 120000000;

var login = function(request, response ) {
	models.UserModel.find({name: request.body.name}, function(err, users){
		if(users.length != 0){
			user = users[0];
			
			if(user.password == request.body.password){
				models.SessionModel.find({user: user._id, deviceId : request.body.deviceId}, function(err, sessions){
					if(!err){
						//create new session
						if(sessions.length == 0) {
							var session = new models.SessionModel({
								user : user._id,
								deviceId : request.body.deviceId,
								lastActivity : new Date()
							});
						}
						//update current session
						else {
							var session = sessions[0];
							session.lastActivity = new Date();
						}
						
						session.save(function( err ) {
							if(err){
								return response.send(new commons.errorMsg(commons.ERROR));
							}
							else {
								return response.send(new commons.successMsg(commons.SUCCESS));
							}
						});
					}
					else {
						console.log( err );
						return response.send(new commons.errorMsg(commons.ERROR));
					}
				});
			}
			else {
				return response.send(new commons.errorMsg(commons.CREDENTIALS_ERROR));
			}
		}
		else {
			return response.send(new commons.errorMsg(commons.CREDENTIALS_ERROR));
		}
	});
}

var logoff = function(request, response ) {
	models.UserModel.find({name: request.body.name}, function(err, users){
		if(!err){
			if(users.length != 0){
				user = users[0];
				
				models.SessionModel.find({user: user._id, deviceId : request.body.deviceId}, function(err, sessions){
					if(!err){
						if(sessions.length == 0) {
							return response.send(new commons.successMsg(commons.SUCCESS));
						}
						else {
							session = sessions[0];
							return session.remove(function(err){
								if(!err){
									return response.send(new commons.successMsg(commons.SUCCESS));
								}
								else {
									console.log(err);
									return response.send(new commons.errorMsg(commons.ERROR));
								}
							});
						}
					}
				});
			}
			else {
				return response.send(new commons.errorMsg(commons.ERROR));
			}
		}
		else {
			console.log(err);
			return response.send(new commons.errorMsg(commons.ERROR));
		}
	});
}

var checkLogin = function(request, response, callback){
	models.UserModel.find({name: request.body.name}, function(err, users){
		if(!err) {
			if(users.length != 0){
				var user = users[0];
				models.SessionModel.find({user: user._id, deviceId : request.body.deviceId}, function(err, sessions){
					if(!err){
						if(sessions.length == 0){
							return response.send(new commons.errorMsg(commons.DENIED));
						}
						else {
							var session = sessions[0];
							var currentTime = new Date().getTime();
							var savedTime = session.lastActivity.getTime();
							
							//session expired
							if(Math.abs(currentTime - savedTime) > sessionLifeTime){
								//delete session record
								return session.remove(function(err){
									return response.send(new commons.errorMsg(commons.DENIED));
								});
							}
							else {
								session.lastActivity = new Date();
								return session.save(function( err ) {
									if(!err){
										return callback(request, response);
									}
									else {
										return response.send(new commons.errorMsg(commons.DENIED));
									}
								});
								
							}
						}
					}
					else {
						console.log(err);
						return response.send(new commons.errorMsg(commons.DENIED));
					}
				});
			}
			else {
				return response.send(new commons.errorMsg(commons.DENIED));
			}
		}
		else {
			console.log(err);
			return response.send(new commons.errorMsg(commons.DENIED));
		}
	});
}

var check = function(request, response ) {
	return checkLogin(request, response, function(request, response){
		return response.send(new commons.successMsg(commons.SIGNED));
	});
}

module.exports = {
	login : login,
	logoff : logoff,
	check : check,
	checkLogin : checkLogin
}