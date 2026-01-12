const express = require("express");
const fs = require("fs");
const path = require("path");

const router = express.Router();

const DATA_DIR = path.join(__dirname, "../data");
const DB_FILE = path.join(DATA_DIR, "cars.json");

/* make sure data file exists */
function ensureDB() {
  if (!fs.existsSync(DATA_DIR)) {
    fs.mkdirSync(DATA_DIR, { recursive: true });
  }
  if (!fs.existsSync(DB_FILE)) {
    fs.writeFileSync(DB_FILE, "[]", "utf8");
  }
}

/* read cars */
function readCars() {
  ensureDB();
  return JSON.parse(fs.readFileSync(DB_FILE, "utf8"));
}

/* save cars */
function saveCars(cars) {
  ensureDB();
  fs.writeFileSync(DB_FILE, JSON.stringify(cars, null, 2), "utf8");
}

/* GET all cars */
router.get("/", (req, res) => {
  const cars = readCars();
  res.json(cars);
});

/* ADD car */
router.post("/", (req, res) => {
  const cars = readCars();
  const newCar = { id: Date.now(), ...req.body };
  cars.push(newCar);
  saveCars(cars);
  res.json(newCar);
});

/* DELETE car */
router.delete("/:id", (req, res) => {
  let cars = readCars();
  cars = cars.filter(c => c.id != req.params.id);
  saveCars(cars);
  res.json({ success: true });
});

module.exports = router;


/* UPDATE car */
router.put("/:id", (req, res) => {
  let cars = readCars();

  cars = cars.map(car =>
    car.id == req.params.id
      ? { ...car, ...req.body }
      : car
  );

  saveCars(cars);
  res.json({ success: true });
});
