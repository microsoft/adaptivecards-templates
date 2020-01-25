const express = require("express");
const path = require("path");
const app = express();

app.use(express.static(path.join(__dirname, "./client/build")));

// enables client side routing
// see https://create-react-app.dev/docs/deployment/#serving-apps-with-client-side-routing
app.get("/*", function(req, res) {
	res.sendFile(path.join(__dirname, "./client/build", "index.html"));
});

const port = process.env.PORT || 5000;

// console.log that your server is up and running
app.listen(port, () => console.log(`Listening on port ${port}`));

// create a GET route
app.get("/express_backend", (req, res) => {
	res.send({
		express: "YOUR EXPRESS BACKEND IS CONNECTED TO REACT. CONFIRMED"
	});
});
