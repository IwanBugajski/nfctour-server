mongoose = require( 'mongoose' );

mongoose.connect( 'mongodb://localhost/NFCTour' );

//Slide show
var SlideShowSchema = new mongoose.Schema({
	title : String,
	description : String,
	category : String,
	creator : {type : String, ref : 'User'},
	latitude : Number,
	longitude : Number
});
SlideShowSchema.index({title : 'text', description : 'text'});
var SlideShowModel = mongoose.model("SlideShow", SlideShowSchema);

//Category
var CategorySchema = new mongoose.Schema({
	name : String
});
var CategoryModel = mongoose.model("Category", SlideShowSchema);

//Slide
var SlideSchema = new mongoose.Schema({
	slideShow : String,
	number : Number,
	title : String,
	content : String
});
var SlideModel = mongoose.model("Slide", SlideSchema);

//Slide node
var SlideNodeSchema = new mongoose.Schema({
	slide : String,
	content : String,
	type : String
});
var SlideNodeModel = mongoose.model("SlideNode", SlideNodeSchema);

//User
var UserSchema = new mongoose.Schema({
	name : String,
	password : String
});
var UserModel = mongoose.model("User", UserSchema);

//Friends
var FriendsSchema = new mongoose.Schema({
	user1 : String,
	user2 : String
});
var FriendsModel = mongoose.model("Friends", FriendsSchema);

//FriendRequest
var FriendRequestSchema = new mongoose.Schema({
	origin : {type : String, ref : 'User'},
	destination : String,
	date : Date
});
var FriendRequestModel = mongoose.model("FriendRequest", FriendRequestSchema);

//Session
var SessionSchema = new mongoose.Schema({
	user : String,
	deviceId : String,
	lastActivity : Date
});
var SessionModel = mongoose.model("Session", SessionSchema);

//Notes
var NotesSchema = new mongoose.Schema({
	slideShow : String,
	user : String,
	note : Number
});
var NotesModel = mongoose.model("Notes", NotesSchema);

//Visits
var VisitsSchema = new mongoose.Schema({
	visitor : String,
	visited : {type : mongoose.Schema.Types.ObjectId, ref : 'SlideShow'},
	time : Number
});
var VisitsModel = mongoose.model("Visits", VisitsSchema);


module.exports = {
	UserModel : UserModel,
	SessionModel : SessionModel,
	SlideShowModel : SlideShowModel,
	CategoryModel : CategoryModel,
	VisitsModel : VisitsModel,
	NotesModel : NotesModel,
	FriendsModel : FriendsModel,
	FriendRequestModel : FriendRequestModel,
	SlideModel : SlideModel
}