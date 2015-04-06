var models = require("../models.js");
var login = require("./login.js");
var commons = require('../commons.js');

var slidesLimit = 20;

var getSlide = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.SlideShowModel.find({_id : request.params.id}, function(err, slideShows){
			if(!err){
				if(slideShows.length != 0){
					var slideShow = slideShows[0];
					
					return models.SlideModel.find({slideShow : slideShow._id, number : request.params.number}, function(err, slides) {
						if((!err) && (slides.length != 0)){
							var slide = slides[0];
							slide.slideShow = slideShow;
							return response.send(new commons.successMsg(slide));
						}
						else return response.send(new commons.errorMsg(commons.ERROR));
					});
				}
				else return response.send(new commons.errorMsg("Slide show does not exist"));
			}
			else return response.send(new commons.errorMsg(commons.ERROR));
		});
	});
}

var getSlides = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.SlideShowModel.find({_id : request.params.id}, function(err, slideShows){
			if(!err){
				if(slideShows.length != 0){
					var slideShow = slideShows[0];
					
					return models.SlideModel.find({slideShow : slideShow._id}, function(err, slides) {
						if(!err) return response.send(new commons.successMsg(slides));
						else return response.send(new commons.errorMsg(commons.ERROR));
					});
				}
				else return response.send(new commons.errorMsg("Slide show does not exist"));
			}
			else return response.send(new commons.errorMsg(commons.ERROR));
		});
	});
}


var addSlide = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.body.name}, function(err, users){
			if((!err) && (users.length != 0)){
				var user = users[0];
				
				return models.SlideShowModel.find({_id : request.params.id}, function(err, slideShows){
					if(!err){
						if(slideShows.length != 0){
							var slideShow = slideShows[0];
							
							if(slideShow.creator == user._id){
								return models.SlideModel.count({slideShow : request.params.id}, function(err, cnt){
									if(!err){
										if(cnt < slidesLimit){
											var slide = new models.SlideModel({
												slideShow : slideShow._id,
												number : cnt,
												title : request.body.title,
												content : request.body.content
											});
											
											return slide.save(function(err){
												if(!err) return response.send(new commons.successMsg(commons.SUCCESS));
												else return response.send(new commons.errorMsg(commons.ERROR));
											});
										}
										else return response.send(new commons.errorMsg("You have reached maximum number of slides"));
									}
									else return response.send(new commons.errorMsg(commons.ERROR));
								});
							}
							else return response.send(new commons.errorMsg(commons.DENIED));
						}
						else return response.send(new commons.errorMsg("Slide show does not exist")); 
					}
					else return response.send(new commons.errorMsg(commons.ERROR));
				});
			}
			else return response.send(new commons.errorMsg(commons.ERROR));
		});
	});
}

var editSlide = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.body.name}, function(err, users){
			if((!err) && (users.length != 0)){
				var user = users[0];
				
				return models.SlideShowModel.find({_id : request.params.id}, function(err, slideShows){
					if(!err){
						if(slideShows.length != 0){
							var slideShow = slideShows[0];
							
							if(slideShow.creator == user._id){
								return models.SlideModel.find({slideShow : request.params.id, number : request.params.number}, function(err, slides){
									if((!err) && (slides.length)){
										var slide = slides[0];
									
										if(request.body.title) slide.title = request.body.title;
										if(request.body.content) slide.content = request.body.content;
										
										return slide.save(function(err){
											if(!err) return response.send(new commons.successMsg(commons.SUCCESS));
											else return response.send(new commons.errorMsg(commons.ERROR));
										});
									}
									else return response.send(new commons.errorMsg(commons.DENIED));
								});
							}
							else return response.send(new commons.errorMsg(commons.DENIED));
						}
						else return response.send(new commons.errorMsg("Slide show does not exist")); 
					}
					else return response.send(new commons.errorMsg(commons.ERROR));
				});
			}
			else return response.send(new commons.errorMsg(commons.ERROR));
		});
	});
}


var deleteSlide = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.body.name}, function(err, users){
			if((!err) && (users.length != 0)){
				var user = users[0];
				
				return models.SlideShowModel.find({_id : request.params.id}, function(err, slideShows){
					if(!err){
						if(slideShows.length != 0){
							var slideShow = slideShows[0];
							
							if(slideShow.creator == user._id){
								return models.SlideModel.find({slideShow : slideShow._id, number : request.params.number}, function(err, slides){
									if((!err) && (slides.length == 1)){
										var slide = slides[0];
										
										return slide.remove(function(err){
											if(!err){
												//move slides with number grater than removed one
												return models.SlideModel.update({slideShow : slideShow._id, number : {$gt : request.params.number}}, {$inc : {number : -1}}, {multi: true}, function(err){
													if(!err) return response.send(new commons.successMsg(commons.SUCCESS));
													else return response.send(new commons.errorMsg(commons.ERROR)); 
												});
											}
											else return response.send(new commons.errorMsg(commons.ERROR)); 
										});
									}
									else return response.send(new commons.errorMsg(commons.ERROR));
								});
							}
							else return response.send(new commons.errorMsg(commons.DENIED));
						}
						else return response.send(new commons.errorMsg("Slide show does not exist")); 
					}
					else return response.send(new commons.errorMsg(commons.ERROR));
				});
			}
			else return response.send(new commons.errorMsg(commons.ERROR));
		});
	});
}

var swapSlides = function(request, response){
	return login.checkLogin(request, response, function(request, response){
		return models.UserModel.find({name: request.body.name}, function(err, users){
			if((!err) && (users.length != 0)){
				var user = users[0];
				
				return models.SlideShowModel.find({_id : request.params.id}, function(err, slideShows){
					if(!err){
						if(slideShows.length != 0){
							var slideShow = slideShows[0];
							
							if(slideShow.creator == user._id){
								return models.SlideModel.find({slideShow : slideShow._id, 
										$or : [{number : request.params.number}, {number : request.params.newNumber}]}, function(err, slides){
									if((!err) && (slides.length == 2)){
										var tmpNumber = slides[0].number;
										slides[0].number = slides[1].number;
										slides[1].number = tmpNumber;
										
										return slides[0].save(function(err){
											if(!err) return slides[1].save(function(err){
												if(!err) return response.send(new commons.successMsg(commons.SUCCESS));
											});
											else return response.send(new commons.errorMsg(commons.ERROR));
										});
									}
									else return response.send(new commons.errorMsg(commons.ERROR));
								});
							}
							else return response.send(new commons.errorMsg(commons.DENIED));
						}
						else return response.send(new commons.errorMsg("Slide show does not exist")); 
					}
					else return response.send(new commons.errorMsg(commons.ERROR));
				});
			}
			else return response.send(new commons.errorMsg(commons.ERROR));
		});
	});
}

module.exports = {
	getSlide : getSlide,
	getSlides : getSlides,
	deleteSlide : deleteSlide,
	addSlide : addSlide,
	editSlide : editSlide,
	swapSlides : swapSlides
}