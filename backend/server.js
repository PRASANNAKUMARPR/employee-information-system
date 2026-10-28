
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());

// Employee database model
const Employee = mongoose.model(
  "Employee",
  new mongoose.Schema({
    name: { type: String, required: true },
    department: { type: String, required: true },
    designation: { type: String, required: true },
    salary: { type: Number, required: true }
  })
);

// Test route
app.get("/", (req, res) => {
  res.send("Employee Information System Backend is Running!");
});

// Add employee
app.post("/api/employees", async (req, res) => {
  try {
    const employee = await Employee.create(req.body);
    res.status(201).json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// View all employees
app.get("/api/employees", async (req, res) => {
  try {
    res.json(await Employee.find().sort({ _id: -1 }));
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Search employees by name or ID
app.get("/api/employees/search", async (req, res) => {
  try {
    const q = req.query.q || "";
    const results = await Employee.find({
      $or: [
        { name: { $regex: q, $options: "i" } },
        { department: { $regex: q, $options: "i" } },
        { designation: { $regex: q, $options: "i" } }
      ]
    });
    res.json(results);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
});

// Update employee
app.put("/api/employees/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndUpdate(
      req.params.id,
      req.body,
      { new: true, runValidators: true }
    );

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json(employee);
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Delete employee
app.delete("/api/employees/:id", async (req, res) => {
  try {
    const employee = await Employee.findByIdAndDelete(req.params.id);

    if (!employee) {
      return res.status(404).json({ message: "Employee not found" });
    }

    res.json({ message: "Employee deleted successfully" });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
});

// Connect to MongoDB before starting the server
mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log("MongoDB connected successfully!");
    app.listen(5000, () => {
      console.log("Server running at http://localhost:5000");
    });
  })
  .catch(error => {
    console.error("MongoDB connection failed:", error.message);
  });
