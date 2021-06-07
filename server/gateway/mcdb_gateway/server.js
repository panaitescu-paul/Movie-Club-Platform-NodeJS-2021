const path = require('path');
const gateway = require('express-gateway');
require("../../api/movie");
require("../../api/user");
require("../../api/rating");
require("../../api/review");
require("../../api/genre");
require("../../api/language");
require("../../api/movie_crew");
require("../../api/movie_genre");
require("../../api/movie_language");

require("../../api/crew");
require("../../api/admin");
require("../../api/role");
require("../../api/room");
require("../../api/message");
require("../../api/participant");

gateway()
  .load(path.join(__dirname, 'config'))
  .run();

module.exports = gateway;