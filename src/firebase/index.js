const { initializeApp } = require("firebase/app");
const config = require("../config/firebase.config");
const { getStorage } = require("firebase/storage");

const app = initializeApp(config);

const storage = getStorage();

module.exports = { storage };
