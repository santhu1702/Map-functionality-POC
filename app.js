const express = require("express");
const path = require('path')


const route = require("./route");


const app = express();
const port = 8700;
app.set("view engine", "ejs"); // This line will set the view engine for the application
app.set('views', path.join(__dirname, 'views'));
app.use(express.static("public")); // This line will set the static files main folder
app.use("/",route);

app.listen(port, () =>
  console.log(
    `Map functionality & running. http://localhost:${port}`
  )
);
 