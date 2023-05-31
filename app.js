const express = require("express");

const app = express();
const port = 8700;
app.set("view engine", "ejs"); // This line will set the view engine for the application
app.use(express.static("public")); // This line will set the static files main folder

app.listen(port, () =>
  console.log(
    `Map functionality & running. http://localhost:${port}`
  )
);

app.get("/",(req,res) => {
    res.render("app",{
        port : port
    })
})