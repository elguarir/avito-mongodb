const mongoose = require("mongoose");
const listingSchema = require("./schema/Listing");


url =
  "mongodb+srv://moha:moha@avitodb.zpksuvm.mongodb.net/avito?retryWrites=true&w=majority";

async function main() {
  await mongoose
    .connect(url)
    .then(() => {
      console.log("Connected :)");
    })
    .catch((e) => {
      console.log(e);
    });

  const Listing = mongoose.model("Listing", listingSchema);
  const listing = new Listing({
    title: "Title",
    description: "Description",
    price: "Price",
    publishedAt: Date.now(),
    place: "Place",
    images: ["image1", "image2"],
    attributes: [{ label: "label1", value: "value1" }],
  });

  await listing.save().then(() => {
    console.log("Saved");
  });
  console.log(listing._id); 
}

main();
