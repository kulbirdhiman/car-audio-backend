import sequelize from "../config/database";

console.log("Loaded models:", Object.keys(sequelize.models));

 

console.log("Models loaded:", sequelize.models);  // Log the loaded models


const syncDatabase = async () => {
  try {
    console.log("Loaded models:", Object.keys(sequelize.models));

    await sequelize.authenticate();
    console.log("✅ Database connected...");

    await sequelize.sync({ alter: true });  // Sync models and recreate tables (development only)
    console.log("✅ Database synced...");
  } catch (error) {
    console.error("❌ Error syncing database:", error);
  }
};

syncDatabase();
