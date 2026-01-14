const express = require("express");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

const carsRoutes = require("./routes/cars");
app.use("/api/cars", carsRoutes);

const PORT = 5000;
app.listen(PORT, () => {
  console.log("Server running on port " + PORT);
});
