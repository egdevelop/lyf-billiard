const Table = require("../models/table.model");

exports.create = async (req, res) => {
  const table = new Table({
    name: req.body.name,
    status: req.body.status,
    transactionId: req.body.transactionId,
  });

  try {
    const data = await table.save();
    res.send(data);
  } catch (err) {
    res.status(500).send({
      message: err.message || "Some error occurred while creating the Table.",
    });
  }
};

exports.findAll = async () => {
  try {
    const data = await Table.find();
    return data;
  } catch (err) {
    return err;
  }
};

exports.findOne = async (req, res) => {
  try {
    const data = await Table.findById(req.params.id);
    if (!data) {
      return res.status(404).send({
        message: "Table not found with id " + req.params.id,
      });
    }
    res.send(data);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        message: "Table not found with id " + req.params.id,
      });
    }
    return res.status(500).send({
      message: "Error retrieving Table with id " + req.params.id,
    });
  }
};

exports.update = async (req, res) => {
  try {
    const data = await Table.findByIdAndUpdate(
      req.params.id,
      {
        name: req.body.name,
        status: req.body.status,
        transactionId: req.body.transactionId,
      },
      { new: true }
    );
    if (!data) {
      return res.status(404).send({
        message: "Table not found with id " + req.params.id,
      });
    }
    res.send(data);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        message: "Table not found with id " + req.params.id,
      });
    }
    return res.status(500).send({
      message: "Error updating Table with id " + req.params.id,
    });
  }
};

exports.delete = async (req, res) => {
  try {
    const data = await Table.findByIdAndRemove(req.params.id);
    if (!data) {
      return res.status(404).send({
        message: "Table not found with id " + req.params.id,
      });
    }
    res.send({ message: "Table deleted successfully!" });
  } catch (err) {
    if (err.kind === "ObjectId" || err.name === "NotFound") {
      return res.status(404).send({
        message: "Table not found with id " + req.params.id,
      });
    }
    return res.status(500).send({
      message: "Could not delete Table with id " + req.params.id,
    });
  }
};
