var models = require("../models.js");
var commons = require('../commons.js');

var findUser = function(request, response ) {
	return models.UserModel.find({name: new RegExp(request.params.query, "i")}, "name", function( err, users ) {
		if( !err ) {
			return response.send(new commons.successMsg(users));
		} else {
			console.log( err );
			return response.send(new commons.errorMsg(commons.ERROR));
		}
	});
}

var getAllUsers = function(request, response){
	return models.UserModel.find(function( err, users ) {
		if( !err ) {
			return response.send(new commons.successMsg(users));
		} else {
			console.log( err );
			return response.send(new commons.errorMsg(commons.ERROR));
		}
	});
}

var addUser = function(request, response ) {
	models.UserModel.count({name: request.body.name}, function(err, cnt){
		if(cnt == 0) {
			var user = new models.UserModel({
				name: request.body.name,
				password: request.body.password,
			});
			
			user.save( function( err ) {
				if( !err ) {
					return response.send(new commons.successMsg(commons.SUCCESS));
				} else {
					console.log( err );
					return response.send(new commons.errorMsg(commons.ERROR));
				}
			});
		}
		else {
			return response.send(new commons.errorMsg("User " + request.body.name + " already exists"));
		}
	});
}

var changePassword = function(request, response) {
	models.UserModel.find({name: request.body.name}, function(err, users){
		if(users.length != 0){
			user = users[0];
		
			if(user.password == request.body.currentPassword){
				user.password = request.body.newPassword;
				
				user.save(function( err ) {
					if( !err ) {
						return response.send(new commons.successMsg(commons.SUCCESS));
					} else {
						return response.send(new commons.errorMsg(commons.ERROR));
					}
				});
			}
			else {
				return response.send(new commons.errorMsg("Password incorrect"));
			}
		}
		else {
			return response.send(new commons.errorMsg("User does not exist"));
		}
	});
}

module.exports = {
	getAllUsers : getAllUsers,
	findUser : findUser,
	addUser : addUser,
	changePassword : changePassword
}