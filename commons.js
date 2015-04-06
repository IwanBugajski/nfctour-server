module.exports = {
	SUCCESS : "SUCCESS",
	ERROR : "ERROR",
	LOGIN_ERROR : "LOGIN_ERROR",
	DENIED : "DENIED",
	SIGNED : "SIGNED",
	CREDENTIALS_ERROR : "Invalid login or password",
	
	successMsg : function(result) {
		this.success = true;
		this.result = result;
	},
	errorMsg : function(result) {
		this.success = false;
		this.result = result;
	}
}