var mongoose = require("mongoose");
var Campground = require("./models/campground");
var Comment   = require("./models/comment");

var data = [
	{name: "Cloud Rest",
	 image: "https://pixabay.com/get/57e8d3444855a914f6da8c7dda793f7f1636dfe2564c704c7d2e73d0954dc75d_340.jpg",
	 description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. "
	},
	{name: "Desert Mesa",
	 image: "https://pixabay.com/get/57e8d1464d53a514f6da8c7dda793f7f1636dfe2564c704c7d2e73d0954dc75d_340.jpg",
	 description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. "
	},
	{name: "Canyon Floor",
	 image: "https://pixabay.com/get/57e0d6424b56ad14f6da8c7dda793f7f1636dfe2564c704c7d2e73d0954dc75d_340.jpg",
	 description: "It is a long established fact that a reader will be distracted by the readable content of a page when looking at its     layout. The point of using Lorem Ipsum is that it has a more-or-less normal distribution of letters, as opposed to using 'Content here, content here', making it look like readable English. Many desktop publishing packages and web page editors now use Lorem Ipsum as their default model text, and a search for 'lorem ipsum' will uncover many web sites still in their infancy. "
	}
]

function seedDB() {
	// Remove all campgrounds
	Campground.remove({}, function(err) {
	if(err) {
		console.log(err);
	} else {
	    console.log("removed campgrounds!");
	// Add a few campgrounds
	data.forEach(function(seed) {
		Campground.create(seed, function(err, campground) {
			if(err) {
				console.log(err);
			} else {
				console.log("Added a campground");
				Comment.create(
					{
					  text: "This place is great, but I wish there was internet",
					  author: "Homer"
				    }, function(err, comment) {
						if(err) {
							console.log(err);
						} else {
						    campground.comments.push(comment);
						    campground.save();
							console.log("Created new comment");
						}
					});
			}
		});
	}) ;
	}
});
	// Add a few comments
};

module.exports = seedDB;