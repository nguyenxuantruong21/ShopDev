const mongoose = require('mongoose')
const os = require('os')
const _SECONDS = 5000

// count connect
const countConnect = () => {
  const numConnection = mongoose.connection.length
  console.log(`Number of connection::${numConnection}`);
}

// check overload
const checkOverload = () => {
  setInterval(() => {
    const numConnection = mongoose.connection.length
    const numCore = os.cpus().length
    const memoryUsage = process.memoryUsage().rss

    // Example maximum number of connection base on number of core
    const maxConnection = numCore * 5

    console.log(`Active connections:: ${numConnection}`);
    console.log(`Memory usage:: ${memoryUsage / 1024 / 1024}`);

    if (numConnection > maxConnection) {
      console.log(`Connection overload detected`);
    }
  }, _SECONDS) // monitor every 5s
}

module.exports = {
  countConnect,
  checkOverload
}
