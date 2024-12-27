const bodyParser = require("body-parser");
const express = require("express");
const helmet = require("helmet");
const connectDB = require("./config/dbConnect");
const MongoStore = require('connect-mongo')
const multer = require("multer");
const { GridFsStorage } = require("multer-gridfs-storage");
const Grid = require("gridfs-stream");
const { GridFSBucket } = require("mongodb");
const crypto = require("crypto");
const path = require("path");
const methodOverride = require("method-override");
const mongoose = require("mongoose");
const session = require('express-session');
const ImageKit = require("imagekit");
const csv = require('csvtojson');
const fs = require('fs');
const passport = require('passport');
const GoogleStrategy = require('passport-google-oauth20').Strategy;
const User = require('./models/userModel')   // Adjust the path as needed


const { notFound, errorHandler } = require("./middlewares/errorHandler");
const app = express();
const dotenv = require("dotenv");
// .config();
require('dotenv').config();
// // Initialize Passport
// require('./config/passport')(passport);
const PORT = 8000;
const authRouter = require("./routes/authRoute");
const productRouter = require("./routes/productRoute");
const blogRouter = require("./routes/blogRoute");
const categoryRouter = require("./routes/prodcategoryRoute");
const blogcategoryRouter = require("./routes/blogCatRoute");
const brandRouter = require("./routes/brandRoute");
const colorRouter = require("./routes/colorRoute");
const enqRouter = require("./routes/enqRoute");
const couponRouter = require("./routes/couponRoute");
const uploadRouter = require("./routes/uploadRoute");
const postRouter = require("./routes/postRoute");
// const imageRoutes = require("./routes/imageRoute");
const sajivanorderRoutes = require('./routes/SajivanOrderRoute');
const roleRoutes = require('./routes/roleRoutes');
const activityLogRoutes = require('./routes/activityLogRoutes');

// const leadRouter = require("./routes/CRM/leadUserRoute");
// const agentRouter = require("./routes/CRM/agentRoute");
// const leadorderRouter = require("./routes/CRM/leadorderRoute");
// const leadproductRouter = require("./routes/CRM/leadprodRoute");
const eventRouter = require("./routes/eventRoute");
// const allleadRouter = require("./routes/CRM/allleadRoute");
const maintenanceRouter  = require('./routes/maintenanceRoutes');
const checkMaintenanceMode = require('./middlewares/checkMaintenanceMode');
// const rolesRouter = require("./routes/roleRoute");
// app.js or server.js (main application file)

const cookieParser = require("cookie-parser");
const morgan = require("morgan");
const cors = require("cors");

connectDB();
dotenv.config();

app.use(morgan("dev"));
// app.use(cors());
app.use(cors({ origin: '*' }));
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: false }));
app.use(cookieParser());


app.use(checkMaintenanceMode);
// Middleware to check maintenance mode
// app.use((req, res, next) => {
//   if (process.env.MAINTENANCE_MODE === "true") {
//       return res.status(503).json({
//           message: "The site is currently under maintenance. Please try again later.",
//       });
//   }
//   next();
// });
// // // Routes
// app.get("/", (req, res) => {
//   res.send("Welcome to the application!");
// });

// app.use(
//   helmet({
//     contentSecurityPolicy: {
//       directives: {
//         defaultSrc: ["'self'"],
//         // imgSrc: ["'self'", "https://example.com"],
//         scriptSrc: ["'self'", "https://example.com"],
//         // styleSrc: ["'self'", "https://example.com"],
//         // fontSrc: ["'self'", "https://example.com"],
//       },
//       hsts: false,
//     },
//   })
// );
// app.use(helmet.frameguard({ action: "deny" }));
// app.use(helmet.noSniff());
// app.use(helmet.hsts({ maxAge: 31536000 }));

// // Define the path to your CSV file
// const csvFilePath = path.join(__dirname, 'sales.csv');

// // Output file path for JSON
// const jsonFilePath = path.join(__dirname, 'users.json');

// // Convert CSV to JSON
// csv()
//   .fromFile(csvFilePath)
//   .then((jsonArray) => {
//     // Write the JSON array to a file
//     fs.writeFileSync(jsonFilePath, JSON.stringify(jsonArray, null, 2), 'utf-8');
//     console.log('CSV file successfully converted to JSON and saved to output.json');
//   })
//   .catch((err) => {
//     console.error('Error converting CSV to JSON:', err);
//   });

// Passport configuration
// const MongoDBURl = process.env.MONGODB_URI
// app.use(
//   session({
//     secret: 'your-secret-key',
//     resave: false,
//     saveUninitialized: true,
//     store: MongoStore.create({
//       mongoUrl: MongoDBURl,
//     }),
//     cookie: { maxAge: 1000 * 60 * 60 * 24 }, // 1 day
//   })
// );
// app.use(passport.initialize())
// app.use(passport.session())


// app.use(require("./routes/index"))
// app.use('/auth', require('./routes/auth'))
// Apply the checkMaintenanceMode middleware to protect other routes
// app.use(checkMaintenanceMode);
// Routes
app.use("/api/user", authRouter);
app.use("/api/product", productRouter);
app.use("/api/blog", blogRouter);
app.use("/api/category", categoryRouter);
app.use("/api/blogcategory", blogcategoryRouter);
app.use("/api/brand", brandRouter);
app.use("/api/coupon", couponRouter);
app.use("/api/color", colorRouter);
app.use("/api/enquiry", enqRouter);
app.use("/api/upload", uploadRouter);
app.use("/api/blogpost", postRouter);
app.use("/api/events", eventRouter);
// app.use('/api/images', imageRoutes);
app.use('/api/sajivanorders', sajivanorderRoutes);
app.use('/api/admin/maintenance', maintenanceRouter);


// app.use('/api/roles',rolesRouter)
app.use('/api/roles', roleRoutes);
app.use('/api/activity-logs', activityLogRoutes);

// crm routes
// app.use("/api/leaduser", leadRouter);
// app.use("/api/agent", agentRouter);
// app.use("/api/leadorder", leadorderRouter);
// app.use("/api/leadproduct", leadproductRouter);
// app.use("/api/alllead", allleadRouter);

app.use(notFound);
app.use(errorHandler);

app.listen(PORT, () => {
  console.log(`Server is running  at PORT ${PORT}`);
});
