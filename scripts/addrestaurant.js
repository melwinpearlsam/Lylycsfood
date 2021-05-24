var url = new URL(window.location.href);
var restaurantId = url.searchParams.get("id");
// Component Variables
const rname = document.getElementById("rname");
const about = document.getElementById("about");
const email = document.getElementById("email");
const submitbtn = document.getElementById("submitbtn");

// Location Component Variables
const updateLocationbtn = document.getElementById("updatelocation-btn");
const locationbtn = document.getElementById("locationbtn");
const updateLocationmsg = document.getElementById("updatelocation-msg");
const mapHolder = document.getElementById("mapholder");

let restaurantCoords;
// let displayImage;

submitbtn.addEventListener("click", (e) => {
	e.preventDefault();
	createRestaurant();
});

updateLocationbtn.addEventListener("click", (e) => updateLocation());

// Disabling enter
window.addEventListener(
	"keydown",
	function (e) {
		if (
			e.keyIdentifier == "U+000A" ||
			e.keyIdentifier == "Enter" ||
			e.keyCode == 13
		) {
			if (e.target.nodeName == "INPUT" && e.target.type == "text") {
				e.preventDefault();
				return false;
			}
		}
	},
	true
);

// Handle Validation
function handleValidation() {
	if (!rname.checkValidity()) {
		alert("Please enter restaurant name.");
		return false;
	} else if (!about.checkValidity()) {
		alert("Please enter a short description of restaurant(About).");
		return false;
	} else if (!email.checkValidity()) {
		alert(
			"Please enter a email of restaurant or your own email, and ensure whether it is a valid email."
		);
		return false;
	} else if (!restaurantCoords) {
		alert(
			"Please click update location, so that users can where your restaurant is located"
		);
		return false;
	} else {
		return true;
	}
}

// HTTP requests
// Create Restaurant
async function createRestaurant() {
	if (!handleValidation()) return;
	console.log("ok");
	try {
		fetch("https://lylycsfood.herokuapp.com/v1/restaurant/restaurant/", {
			method: "POST",
			headers: {
				"Content-Type": "application/json",
				Authorization: localStorage.getItem("token"),
			},
			body: JSON.stringify({
				displayName: rname.value,
				location: {
					type: "Point",
					coordinates: [restaurantCoords.latitude, restaurantCoords.longitude],
				},
				email: email.value,
				about: about.value,
			}),
		})
			.then((r) => r.json())
			.then((r) => {
				console.log(r);
				window.location.replace("home.html");
			});
	} catch (error) {
		alert(error.message);
	}
}

// Update Location
function updateLocation() {
	if (navigator.geolocation) {
		navigator.geolocation.getCurrentPosition(showPosition, showError);
	} else {
		updateLocationmsg.innerHTML =
			"Geolocation is not supported by this browser.";
	}
}

async function showPosition(position) {
	try {
		const uluru = {
			lat: position.coords.latitude,
			lng: position.coords.longitude,
		};
		// The map, centered at Uluru
		const map = new google.maps.Map(mapHolder, {
			zoom: 16,
			center: uluru,
			scrollwheel: false,
			zoomControl: false,
			fullscreenControl: false,
			mapTypeControl: false,
			streetViewControl: false,
		});
		// The marker, positioned at Uluru
		const marker = new google.maps.Marker({
			position: uluru,
			map: map,
		});
		mapHolder.style.height = "200px";
		mapHolder.style.width = "100vw";
		updateLocationmsg.innerHTML = "";
		restaurantCoords = position.coords;
	} catch (error) {
		alert(error.message);
	}
}

function showError(error) {
	switch (error.code) {
		case error.PERMISSION_DENIED:
			updateLocationmsg.innerHTML = "User denied the request for Geolocation.";
			break;
		case error.POSITION_UNAVAILABLE:
			updateLocationmsg.innerHTML = "Location information is unavailable.";
			break;
		case error.TIMEOUT:
			updateLocationmsg.innerHTML =
				"The request to get user location timed out.";
			break;
		case error.UNKNOWN_ERROR:
			updateLocationmsg.innerHTML = "An unknown error occurred.";
			break;
	}
}
