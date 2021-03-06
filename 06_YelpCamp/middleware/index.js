var Campground = require("../models/campground");
var Comment = require("../models/comment");

// All the middleware goes here
var middlewareObj = {};

middlewareObj.checkCampgroundOwnerShip = function(req, res, next) {
	// is user logged in
	if(req.isAuthenticated()) {
	    Campground.findById(req.params.id, function(err, foundCampground){
		    if(err || !foundCampground) {
				req.flash("error", "Campground not found!")
		        res.redirect("back");
		    } else {
				// does user own the campground
				if(foundCampground.author.id.equals(req.user._id) || req.user.isAdmin) {
					next();
				} else {
					req.flash("error", "You dont't have permission to do that!");
					res.redirect("back");
				}
		    }
	    });
	} else {
		req.flash("error", "You need to be logged in to do that!")
		res.redirect("back");
	}
}	

middlewareObj.checkCommentOwnerShip = function(req, res, next) {
	// is user logged in
	if(req.isAuthenticated()) {
	    Comment.findById(req.params.comment_id, function(err, foundComment){
		    if(err || !foundComment) {
				req.flash("error", "Campground Not Found");
		        res.redirect("back");
		    } else {
				// does user own the comment?
				if(foundComment.author.id.equals(req.user._id) || req.user.isAdmin) {
					next();
				} else {
					req.flash("error", "You dont't have permission to do that!");
					res.redirect("back");
				}
		    }
	    });
	} else {
		req.flash("error", "You need to be logged in to do that!");
		res.redirect("back");
	}
};

middlewareObj.isLoggedIn = function isLoggedIn(req, res, next){
    if(req.isAuthenticated()){
        return next();
    }
	req.flash("error", "You need to be logged in to do that!");
    res.redirect("/login");
};

module.exports = middlewareObj;