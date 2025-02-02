const mongoose = require('mongoose');


//mongodb+srv://asadazizjs:ZEZjz8EhJVMsbSvP@cluster0.9fkd1.mongodb.net/
const connectDB = async () => {
  try {
    await mongoose.connect('mongodb+srv://asadazizjs:ZEZjz8EhJVMsbSvP@cluster0.9fkd1.mongodb.net/', {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error('MongoDB Connection Error:', err);
    process.exit(1);
  }
};

module.exports = connectDB;