const express = require("express");
const bodyParser = require("body-parser");
const path = require("path");
const db = require("./configs/db");
const app = express();
const Table = require("./controllers/table.controller");
const Transaction = require("./controllers/transaction.controller");

// Set the view engine to ejs and define the views folder
app.set("view engine", "ejs");
app.set("views", path.join(__dirname, "views"));

// Set the static files folder
app.use(express.static(path.join(__dirname, "public")));

// Use body-parser middleware
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Connect to the database
db.connect();

// Example route
app.get("/", async (req, res) => {
  const table = await Table.findAll();
  const transaction = await Transaction.findAll();

  res.render("pages/dashboard", { table, transaction });
});

// Table routes
app.post("/table", Table.create);
app.put("/table/:id", Table.update);
app.delete("/table/:id", Table.delete);

// Transaction routes
app.post("/transaction", Transaction.create);
app.post("/transaction/update", async (req, res) => {
  const transaction = await Transaction.update(req.body);
  res.redirect("/");
});
app.get("/transaction/delete/:id", Transaction.delete);

app.get("/transaction/start/:id", async (req, res) => {
  const startTime = new Date();
  const transaction = await Transaction.update({
    id: req.params.id,
    status: "bermain",
    startTime: startTime,
  });
  res.redirect("/");
});

app.get("/transaction/end/:id", async (req, res) => {
  const endTime = new Date();
  const transaction = await Transaction.update({
    id: req.params.id,
    status: "selesai",
    endTime: endTime,
  });
  res.redirect("/");
});

// Start the server
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});
