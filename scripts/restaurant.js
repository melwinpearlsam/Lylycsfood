var url = new URL(window.location.href);
var restaurantId = url.searchParams.get("id");
// Component Variables
const title = document.querySelector(".title");
const rname = document.getElementById("rname");
const about = document.getElementById("about");
const phone = document.getElementById("phone");
const websiteurl = document.getElementById("websiteurl");
const restaurantImage = document.getElementById("restaurantImage");
const email = document.getElementById("email");
const locationbtn = document.getElementById("locationbtn");
const submitbtn = document.getElementById("submitbtn");
const phonebtn = document.getElementById("phone-add-btn");
const addImagebtn = document.querySelector(".images-add-btn");
const phoneNumberList = document.querySelector(".phone-number-container");
const imagesContainer = document.querySelector(".images-container");

// Address Component Variables
const updateAddressbtn = document.getElementById("updateaddress-btn");
const updateLocationbtn = document.getElementById("updatelocation-btn");
const address1 = document.getElementById("addressLine1");
const address2 = document.getElementById("addressLine2");
const locality = document.getElementById("locality");
const city = document.getElementById("city");
const state = document.getElementById("state");
const zipcode = document.getElementById("zipcode");
const updateLocationmsg = document.getElementById("updatelocation-msg");

let phoneList;
let selectedImage;
let address;

getRestaurant();
submitbtn.addEventListener("click", (e) => {
	e.preventDefault();
	updateRestaurant();
});

phonebtn.addEventListener("click", (e) => addPhoneNumber());

addImagebtn.addEventListener("click", (e) => uploadImage());
updateAddressbtn.addEventListener("click", (e) => updateAddress());
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

// Assign Address
function assignAddress(address) {
	if (!address) return;
	address1.value = address.addressLine1;
	address2.value = address.addressLine2;
	locality.value = address.locality;
	zipcode.value = address.zipCode;
	city.value = address.city;
	state.value = address.state;
}

// HTTP requests
async function getRestaurant() {
	try {
		fetch(
			"https://lylycsfood.herokuapp.com/v1/restaurant/restaurants/" +
				restaurantId
		)
			.then((r) => r.json())
			.then((r) => {
				title.innerHTML = r.displayName;
				rname.value = r.displayName;
				about.value = r.about;
				if (r.phoneNumbers.length === 0) {
					phoneNumberList.innerHTML +=
						"<p style='font-size:10px;'>No phone number added.</p>";
				}
				r.phoneNumbers.forEach((p) => {
					phoneNumberList.innerHTML += p + "<br>";
				});
				restaurantImage.src =
					"https://lylycsfood.herokuapp.com/" + r.displayImage;
				phoneList = r.phoneNumbers;
				websiteurl.value = r.website;
				email.value = r.email;
				assignAddress(r.address);
				address = r.address;
				if (r.photos.length === 0) {
					imagesContainer.innerHTML +=
						"<p style='font-size:10px;'>No images added.</p>";
				}
				r.photos.forEach((p) => {
					imagesContainer.innerHTML += restaurantComponent(p);
				});
			});
	} catch (error) {
		alert(error.message);
	}
}

// Update Restaurant
async function updateRestaurant() {
	if (rname.value === "") return alert("Please enter restaurant name.");
	try {
		fetch(
			"https://lylycsfood.herokuapp.com/v1/restaurant/restaurant/" +
				restaurantId,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: localStorage.getItem("token"),
				},
				body: JSON.stringify({
					displayName: rname.value,
					website: websiteurl.value,
					email: email.value,
					about: about.value,
				}),
			}
		)
			.then((r) => r.json())
			.then((r) => {
				console.log(r);
				window.location.reload();
			});
	} catch (error) {
		alert(error.message);
	}
}

// Update Number
async function addPhoneNumber() {
	if (!phone.checkValidity()) return;
	try {
		fetch(
			"https://lylycsfood.herokuapp.com/v1/restaurant/restaurant/" +
				restaurantId,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: localStorage.getItem("token"),
				},
				body: JSON.stringify({
					phoneNumbers: phone.value,
				}),
			}
		)
			.then((r) => r.json())
			.then((r) => {
				console.log(r);
				window.location.reload();
			});
	} catch (error) {
		alert(error.message);
	}
}

// Update DisplayImage
function handleDisplayUpload() {
	var image = document.getElementById("upload-dp-image").files[0];

	if (!image) return;

	try {
		var formData = new FormData();
		formData.append("restaurantId", restaurantId);
		formData.append("displayimg", image);
		var request = new XMLHttpRequest();
		request.open(
			"POST",
			"https://lylycsfood.herokuapp.com/v1/restaurant/restaurant/avatar"
		);
		request.setRequestHeader("Authorization", localStorage.getItem("token"));
		request.onload = async function (e) {
			const fresponse = await JSON.parse(request.response);
			if (request.status === 200) {
				alert("Updated restaurant profile picture");
				window.location.reload();
			} else {
				alert(fresponse.message);
			}
		};
		request.send(formData);
	} catch (error) {
		alert("Unable to update picture");
	}
}

// Update Images
function handleImageUpload() {
	var image = document.getElementById("upload-image").files[0];

	if (!image) {
		document.getElementById("display-image").src = "";
		addImagebtn.style.display = "none";
		selectedImage = null;
		return;
	}

	var reader = new FileReader();

	reader.onload = function (e) {
		document.getElementById("display-image").src = e.target.result;
		addImagebtn.style.display = "block";
		selectedImage = image;
	};

	reader.readAsDataURL(image);
}

async function uploadImage() {
	var formData = new FormData();
	formData.append("restaurantId", restaurantId);
	formData.append("restaurantPhoto", selectedImage);
	var request = new XMLHttpRequest();
	request.open(
		"POST",
		"https://lylycsfood.herokuapp.com/v1/restaurant/restaurant/photos"
	);
	request.setRequestHeader("Authorization", localStorage.getItem("token"));
	request.onload = async function (e) {
		const fresponse = await JSON.parse(request.response);
		if (request.status === 200) {
			alert(fresponse.message);
			window.location.reload();
		} else {
			alert(fresponse.message);
		}
	};
	request.send(formData);
}

async function deleteImage(photoId) {
	console.log(photoId);
	try {
		fetch(
			"https://lylycsfood.herokuapp.com/v1/restaurant/restaurant/photos/" +
				photoId,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: localStorage.getItem("token"),
				},
				body: JSON.stringify({
					phoneNumbers: phone.value,
				}),
			}
		)
			.then((r) => r.json())
			.then((r) => {
				window.location.reload();
			});
	} catch (error) {
		alert(error.message);
	}
}

// Address
async function updateAddress() {
	if (address) await deleteAddress();
	try {
		fetch(
			"https://lylycsfood.herokuapp.com/v1/restaurant/address/" + restaurantId,
			{
				method: "POST",
				headers: {
					"Content-Type": "application/json",
					Authorization: localStorage.getItem("token"),
				},
				body: JSON.stringify({
					addressLine1: address1.value,
					addressLine2: address2.value,
					locality: locality.value,
					city: city.value,
					zipCode: zipcode.value,
					state: state.value,
					country: "India",
				}),
			}
		)
			.then((r) => r.json())
			.then((r) => {
				console.log(r);
				window.location.reload();
			});
	} catch (error) {
		alert(error.message);
	}
}

// Only used for updating the address
async function deleteAddress() {
	try {
		fetch(
			"https://lylycsfood.herokuapp.com/v1/restaurant/address/" + address._id,
			{
				method: "DELETE",
				headers: {
					"Content-Type": "application/json",
					Authorization: localStorage.getItem("token"),
				},
			}
		)
			.then((r) => r.json())
			.then((r) => {
				console.log(r);
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
		fetch(
			"https://lylycsfood.herokuapp.com/v1/restaurant/restaurant/" +
				restaurantId,
			{
				method: "PATCH",
				headers: {
					"Content-Type": "application/json",
					Authorization: localStorage.getItem("token"),
				},
				body: JSON.stringify({
					location: {
						type: "Point",
						coordinates: [position.coords.latitude, position.coords.longitude],
					},
				}),
			}
		)
			.then((r) => r.json())
			.then((r) => {
				console.log(r);
				alert("Position in maps has been updated");
			});
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

// Components
restaurantComponent = (p) => {
	return `<img ondblclick="deleteImage('${p._id}')" src="https://lylycsfood.herokuapp.com/${p.path}" alt="${p._id}" />`;
};
