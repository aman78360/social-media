const express = require("express");
require("dotenv").config("./.env");
const dbConnect = require("./dbConnect");
const authRouter = require("./routers/authRouter");
const postsRouter = require("./routers/postsRouter");
const morgan = require("morgan");

const app = express();

// middlewares
app.use(express.json());
app.use(morgan("common"));

app.use("/auth", authRouter);
app.use("/posts", postsRouter);

app.get("/", (request, response) => {
	response.status(200).send("Ok from server");
});

const PORT = process.env.PORT || 4001;
dbConnect();
app.listen(PORT, () => {
	console.log("process listening on port " + PORT);
});
