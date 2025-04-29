const mqtt = require("mqtt");
const Transactions = require("./controllers/transaction.controller");
const Table = require("./controllers/table.controller");
const db = require("./configs/db");

db.connect();

// Ganti broker sesuai yang digunakan ESP32
const broker = "mqtt://192.168.110.102:1883";

// Topik
const topicReceive = "esp32/pesan";
const topicSend = "esp32/terima";

// Connect ke broker
const client = mqtt.connect(broker);

client.on("connect", () => {
  console.log("✅ Terhubung ke broker MQTT");

  // Subscribe ke topik dari ESP32
  client.subscribe(topicReceive, (err) => {
    if (!err) {
      console.log(`📩 Subscribe ke topik: ${topicReceive}`);
    }
  });

  // Kirim pesan ke ESP32 setiap 10 detik
  setInterval(async () => {
    const transaction = await Transactions.findAll();
    const table = await Table.findAll();
    let message = ``;
    table.map((t) => {
      if (t.status === "terisi") {
        let o = transaction.find(
          (o) => o._id.toString() === t.transactionId.toString()
        );
        if (o.startTime) {
          message += `,${t.name}:1`;
          if (o.paket.split("-")[1] === "jam") {
            const nowTime = new Date();
            const startTime = new Date(o.startTime);
            let timeDiff =
              (nowTime.getTime() - startTime.getTime()) / (1000 * 60 * 60);
            if (timeDiff > parseInt(o.paket.split("-")[0])) {
              const c = Transactions.update({
                id: o._id,
                status: "selesai",
                endTime: nowTime,
              });
            }
          }
        } else {
          message += `,${t.name}:0`;
        }
      } else {
        message += `,${t.name}:0`;
      }
    });
    console.log(`🚀 Mengirim ke ESP32: ${message}`);
    client.publish(topicSend, message);
  }, 5000);
});

// Terima pesan dari ESP32
client.on("message", (topic, message) => {
  console.log(`📨 Pesan dari ESP32 [${topic}]: ${message.toString()}`);
});
