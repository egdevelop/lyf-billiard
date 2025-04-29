const mongoose = require("mongoose");

const transactionSchema = new mongoose.Schema(
  {
    nama: {
      type: String,
      required: true,
    },
    nowa: {
      type: Number,
      required: true,
    },
    status: {
      type: String,
      required: true,
    },
    table: {
      type: String,
    },
    paket: {
      type: String,
    },
    startTime: {
      type: Date,
    },
    endTime: {
      type: Date,
    },
  },
  {
    timestamps: true,
  }
);

const Transaction = mongoose.model("Transaction", transactionSchema);

module.exports = Transaction;
