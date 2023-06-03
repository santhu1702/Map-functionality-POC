const express = require("express");
const path = require('path');
const route = require("./route");

const app = express();
const port = process.env.PORT || 3000; // Use the PORT environment variable provided by Azure or fallback to port 3000

app.set("view engine", "ejs");
app.set('views', path.join(__dirname, 'views'));
app.use(express.static(path.join(__dirname, 'public'))); // Serve static files from the "public" folder
app.use("/", route);

app.listen(port, () =>
  console.log(
    `Map functionality is running. http://localhost:${port}`
  )
);
