var url = new URL(window.location.href);
var restaurantId = url.searchParams.get("id");

// Component Variables
const restaurantImage = document.getElementById("restaurantImage");
const restaurantTitle = document.getElementById("restaurantName");
const restaurantRating = document.getElementById("restaurantRating");
const reviewList = document.getElementById("reviews-list");

getRestaurant();
getReviews();

// HTTP requests
async function getRestaurant() {
	try {
		fetch(
			"https://lylycsfood.herokuapp.com/v1/restaurant/restaurants/" +
				restaurantId
		)
			.then((r) => r.json())
			.then((r) => {
				console.log(r);
				restaurantImage.src =
					"https://lylycsfood.herokuapp.com/" + r.displayImage;
				restaurantTitle.innerHTML = r.displayName;
				restaurantRating.innerHTML += `${
					r.reviews.length === 0 ? 0 : r.reviews[0].avgRating
				} / 5 &nbsp<i class="fas fa-star"></i>`;
			});
	} catch (error) {
		alert(error.message);
	}
}

async function getReviews() {
	try {
		fetch(
			"https://lylycsfood.herokuapp.com/v1/restaurant/reviews/" + restaurantId
		)
			.then((r) => r.json())
			.then((r) => {
				if (r.length === 0) {
					return (reviewList.innerHTML = "<p>No reviews yet.</p>");
				}
				r.forEach((r) => {
					reviewList.innerHTML += reviewCard(r);
				});
			});
	} catch (error) {
		alert(error.message);
	}
}

// Components
const reviewCard = (r) => {
	return `<div class="review-card">
	<div class="review-card-header">
		<img src="https://lylycsfood.herokuapp.com/${
			r.userId.displayImage
		}" alt="profile" />
		<div>
			<p style="font-weight: bold">${r.userId.displayName}</p>
			<p style="font-size: 12px">${r.createdAt}</p>
		</div>
	</div>
	<hr style="border-top: 1px solid #cecece;">

	<div class="review-card-body">
		<p>${r.review}</p>
		<div class="review-card-images">
			${r.medias.map(
				(m) =>
					`<img src="https://lylycsfood.herokuapp.com/${m.path}" alt="review img" />`
			)}
		</div>
	</div>
</div>`;
};
