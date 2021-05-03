const path = require('path');
const gateway = require('express-gateway');
require("../../api/admin");
require("../../api/user");
require("../../api/room");
require("../../api/message");
require("../../api/participant");
require("../../api/crew");
require("../../api/movie");
require("../../api/rating");
require("../../api/review");
require("../../api/movie_crew");
require("../../api/role");
require("../../api/genre");
require("../../api/language");

gateway()
  .load(path.join(__dirname, 'config'))
  .run();
