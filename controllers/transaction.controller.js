const Transaction = require("../models/transaction.model");
const Tabel = require("../models/table.model");

exports.create = async (req, res) => {
  const { nama, nowa, status, table, paket, startTime, endTime, tableId } =
    req.body;
  const transaction = new Transaction({
    nama,
    nowa,
    status,
    table,
    paket,
    startTime,
    endTime,
    tableId,
  });

  if (table.split("-")[0] !== "wait") {
    const tableUpdate = await Tabel.findByIdAndUpdate(
      table,
      { transactionId: transaction._id, status: "terisi" },
      { new: true }
    );
  }

  const data = await transaction.save();
  res.redirect("/");
};

exports.findAll = async function () {
  try {
    const data = await Transaction.find().sort({ _id: -1 });

    function calculateSessionMinutes(startTime, endTime) {
      const result = { sesi1: 0, sesi2: 0 };
      let current = new Date(startTime);

      while (current < endTime) {
        const nextMinute = new Date(
          Math.ceil(current.getTime() / 60000) * 60000
        ); // +1 menit
        if (nextMinute > endTime) break;

        const hour = current.getHours();
        if (hour >= 1 && hour < 15) result.sesi1++;
        else result.sesi2++;

        current = nextMinute;
      }

      return result;
    }

    let finalData = [...data];

    await Promise.all(
      data.map(async (item, index) => {
        if (item.status === "selesai") {
          const session = calculateSessionMinutes(item.startTime, item.endTime);
          finalData[index] = { ...item.toObject(), sesi: session };
        }
      })
    );

    return finalData;
  } catch (err) {
    return err;
  }
};

exports.findOne = async (req, res) => {
  try {
    const data = await Transaction.findById(req.params.id);
    if (!data) {
      return res.status(404).send({
        message: "Transaction not found with id " + req.params.id,
      });
    }
    res.send(data);
  } catch (err) {
    if (err.kind === "ObjectId") {
      return res.status(404).send({
        message: "Transaction not found with id " + req.params.id,
      });
    }
    return res.status(500).send({
      message: "Error retrieving Transaction with id " + req.params.id,
    });
  }
};

exports.update = async (datas) => {
  const { nama, nowa, status, table, paket, startTime, endTime } = datas;
  const data = await Transaction.findByIdAndUpdate(
    datas.id,
    {
      nama,
      nowa,
      status,
      table,
      paket,
      startTime,
      endTime,
    },
    { new: true }
  );

  if (data.table.split("-")[0] !== "wait" && !endTime) {
    const tableUpdate = await Tabel.findByIdAndUpdate(
      data.table,
      { transactionId: data._id, status: "terisi" },
      { new: true }
    );
  } else if (endTime) {
    const tableUpdate = await Tabel.findByIdAndUpdate(
      data.table,
      { transactionId: null, status: "kosong" },
      { new: true }
    );
  }

  return data;
};

exports.delete = async (req, res) => {
  const data = await Transaction.findByIdAndDelete(req.params.id);
  if (!data) {
    return res.redirect("/");
  }
  return res.redirect("/");
};
