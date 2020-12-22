const express = require('express');

const app = express();

const todoRoute= require("./routes/todos")

app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.use("/todolist", todoRoute)

const PORT = 3000;
app.listen(PORT, () => {
  console.log(`Listening in http://localhost:${PORT}`);
});