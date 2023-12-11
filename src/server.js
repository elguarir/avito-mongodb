const express = require("express");
const mongoose = require("mongoose");
const Listing = require("./schema/Listing");

url =
  "mongodb+srv://moha:moha@avitodb.zpksuvm.mongodb.net/avito?retryWrites=true&w=majority";
mongoose
  .connect(url)
  .then(() => {
    app.listen(3000, () => {
      console.log("Server is running on port 3000");
    });
  })
  .catch((e) => {
    console.log(e);
  });

const app = express();
app.use(express.json());

app.get("/", (req, res) => {
  res.json({ message: "Hello World" });
});

app.get("/listing", (req, res) => {
  return res.json({ message: "Hello World!" });
});

app.post("/listing", async (req, res) => {
  const listing = req.body;
  const result = await Listing.create(listing);
  res.json({ success: true, listing: result });
});


app.get("/listings", async (req, res) => {
  const result = await Listing.find();
  res.json({ success: true, result: result });
});
