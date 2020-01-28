import app from "./app";

// Start express server
const port = process.env.PORT || 5000;
const server = app.listen(port, () => console.log(`Listening on port ${port}`));

export default server;
