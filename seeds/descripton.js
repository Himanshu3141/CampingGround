function getRandomDescription() {
  const campDescriptions = [
    "A serene spot surrounded by towering trees, perfect for a quiet getaway with scenic views and nearby hiking trails.",
    "Experience the beauty of wildflower meadows, bubbling streams, and crisp mountain air in a secluded valley.",
    "Nestled in the heart of a lush forest, this campground offers peaceful nights under a blanket of stars and quiet mornings by the water.",
    "A rugged retreat set along a crystal-clear river, ideal for canoeing, fishing, and enjoying nature’s sounds.",
    "A secluded site with panoramic views of the rolling hills, perfect for those seeking solitude and the sound of wind through the pines.",
    "Set in a valley with striking rock formations, this campground provides opportunities for both challenging hikes and relaxing afternoons.",
    "A remote campground near a pristine lake, offering fishing, kayaking, and campfire nights surrounded by dense woods.",
    "Located on the edge of a vast desert, the campground provides stunning sunsets, starry skies, and a true sense of wilderness.",
    "Surrounded by alpine lakes and towering peaks, this site is ideal for backpacking, mountain biking, and exploring the rugged terrain.",
    "A peaceful site on the shores of a quiet river, with opportunities for both fishing and wildlife viewing in a serene environment.",
    "This campground sits at the base of ancient, towering trees and is perfect for nature walks, birdwatching, and peaceful reflection.",
    "With lush meadows and winding trails, this spot is ideal for picnics, hikes, and enjoying the beauty of the changing seasons.",
    "Located at the foot of majestic cliffs, this campground is perfect for rock climbing enthusiasts and adventurers looking for a challenge.",
    "This site is located near a wildflower-filled valley and offers easy access to serene lakes and peaceful wildlife habitats.",
    "Surrounded by red rocks and desert landscapes, this campground is perfect for those seeking a peaceful retreat in nature’s beauty."
  ];

  if (campDescriptions.length === 0) {
    console.error("The campDescriptions array is empty.");
    return;
  }

  const randomIndex = Math.floor(Math.random() * campDescriptions.length);
  return campDescriptions[randomIndex];
}

module.exports = { getRandomDescription };
