var express = require("express");
var router = express.Router();
var Campground = require("../models/campground");
var middleware = require("../middleware");

// Index - show all campgournds
router.get("/", function(req, res) {
	// fuzzy search
	var noMatch;
	if(req.query.search) {
		var regex = new RegExp(escapeRegex(req.query.search), "gi");
		Campground.find({name: regex}, function(err, allcampgrounds) {
			if(err) {
				console.log(err);
			} else {
				if(allcampgrounds.length < 1) {
					noMatch = "No campgrounds match...Please try again."
				}
				res.render("campgrounds/index", {
					campgrounds: allcampgrounds, 
					currentUser: req.user, 
					page: "campgrounds", 
					noMatch: noMatch
				});
			}
		});
	} else {
	// get all campround from db
		Campground.find({}, function(err, allcampgrounds) {
			if(err) {
				console.log(err);
			} else {
				res.render("campgrounds/index", {
					campgrounds: allcampgrounds, 
					currentUser: req.user, 
					page: "campgrounds", 
					noMatch: noMatch
				});
			}
		});
	}
});

// Create - add new campground to DB
router.post("/", middleware.isLoggedIn, function(req, res) {
	var name = req.body.name;
	var price = req.body.price;
	var image = req.body.image;
	var desc = req.body.description;
	var author = {
		id: req.user._id,
		username: req.user.username
	};
	var newCampground = {name: name, price: price, image: image, description: desc, author: author}
	
	// create a new campground and save to DB
	Campground.create(newCampground, function(err, newlyCreated) {
		if(err) {
			console.log(err);
		} else {
			res.redirect("/campgrounds");
		}
	});
	//campgrounds.push(req.body);
});

// New - show form to create new campground
router.get("/new", middleware.isLoggedIn, function(req, res) {
	res.render("campgrounds/new");
});

// Show - shows more info about one campground
router.get("/:id", function(req, res) {
	// find the campground with provided ID
	Campground.findById(req.params.id).populate("comments").exec(function(err, foundCampground) {
		if(err || !foundCampground) {
			req.flash("error", "Campground not found!");
			res.redirect("back");
		} else {
			// render show template with that cmapground
	        res.render("campgrounds/show", {campground: foundCampground});
		}
	});
});

// Edit Campground Route
router.get("/:id/edit", middleware.checkCampgroundOwnerShip, function(req, res) {
	    Campground.findById(req.params.id, function(err, foundCampground){
			res.render("campgrounds/edit", {campground: foundCampground});
	    });
});

// Udate Campground Route
router.put("/:id", middleware.checkCampgroundOwnerShip, function(req, res) {
	// find and update correct campground
	Campground.findByIdAndUpdate(req.params.id, req.body.campground, function(err, updatedCampground){
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds/" + req.params.id);
		}
	})
	// redirect show page
})

// Destroy Campground Route
router.delete("/:id", middleware.checkCampgroundOwnerShip, function(req, res) {
	Campground.findByIdAndRemove(req.params.id, function(err){
		if(err) {
			res.redirect("/campgrounds");
		} else {
			res.redirect("/campgrounds");
		}
	});
});

function escapeRegex(text) {
    return text.replace(/[-\/\\^$*+?.()|[\]{}]/g, '\\$&');
};

module.exports = router;
