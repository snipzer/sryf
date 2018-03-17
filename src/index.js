import mongooseHandler from "./services/mongooseHandler";
import Server from "./server";

// get .env vars
require('dotenv').config();

const server = new Server();

const mongoose = new mongooseHandler();
mongoose.connect().then(message => {
    console.log(message);
    server.run();
}).catch(error => console.log(error));



