// Module dependencies.
var application_root = __dirname,
    express = require( 'express' ),
    path = require( 'path' ),   
    mongoose = require( 'mongoose' );
	
//create server 
var server = express();

// Configure server
server.configure(function() {
    server.use(express.bodyParser());
    server.use(express.methodOverride());
    server.use(server.router);
    server.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});


//Routing

//user management
var user = require("./routees/user.js");
server.get("/users", user.getAllUsers);
server.get("/users/find/:query", user.findUser);
server.post("/users", user.addUser);
server.post("/user/password", user.changePassword);
//server.get("/users/:id", user.getUserById);

//login
var login = require("./routees/login.js");
server.post("/login/login", login.login);
server.post("/login/logout", login.logoff);
server.post("/login/check", login.check);

//slides - get
var slides = require("./routees/slides.js");
server.post("/slides/user/:user", slides.slidesByUser);
server.post("/slides/user/:user/cnt", slides.slidesByUserCnt);
server.post("/slides", slides.slides);
server.post("/slides/id/:id", slides.slidesById);
server.post("/slides/category/:category", slides.slidesByCategory);
server.post("/slides/name/:name", slides.slidesByName);
server.post("/slides/location/:latitude/:longitude/:range", slides.slidesByLocation);
//slides - edit, create, delete
var slidesEdit = require("./routees/slidesEdit.js");
server.post("/slides/create", slidesEdit.create);
server.post("/slides/edit/:id", slidesEdit.edit);
server.post("/slides/delete/:id", slidesEdit.deleteSlide);

//slides - search
server.post("/slides/search/:text", slides.slidesSearch);

//slides - contents
var slidesContent = require("./routees/slidesContent.js");
server.post("/slides/id/:id/get/:number", slidesContent.getSlide);
server.post("/slides/id/:id/get", slidesContent.getSlides);
server.post("/slides/id/:id/delete/:number", slidesContent.deleteSlide);
server.post("/slides/id/:id/add", slidesContent.addSlide);
server.post("/slides/id/:id/edit/:number", slidesContent.editSlide);
server.post("/slides/id/:id/swap/:number/:newNumber", slidesContent.swapSlides);


//categories
var categories = require("./routees/categories.js");
server.get("/categories", categories.getCategories);

//visits
var visits = require("./routees/visits.js");
server.post("/visit/:slides", visits.visit);
server.post("/visited/:user", visits.visitedSlides);

//notes
var notes = require("./routees/notes.js");
server.post("/notes/rate/:slides", notes.rate);
server.post("/notes/user/:user", notes.notesByUser);
server.post("/notes/slides/:slides", notes.avgSlidesRate);

//friends
var friends = require("./routees/friends");
server.post("/friends/user/:user", friends.friendsByUser);
server.post("/friends/unfriend/:user", friends.unfriend);

var friendsRequest = require("./routees/friendsRequest.js");
server.post("/friends/request/invite/:user", friendsRequest.invite);
server.post("/friends/request/accept/:request", friendsRequest.accept);
server.post("/friends/request/deny/:request", friendsRequest.deny);
server.post("/friends/request/cancel/:request", friendsRequest.cancel);
server.post("/friends/request/mine", friendsRequest.mine);
server.post("/friends/request/tome", friendsRequest.toMe);

//Start server
var port = 8888;
server.listen( port, function() {
    console.log( 'Express server listening on port %d in %s mode', port, server.settings.env );
});