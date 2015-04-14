// Module Dependencies
var express = require('express'),
  app = express();
  http = require('http'),
  path = require('path'),
  fs = require("fs"),
  _ = require('lodash'),
  dir  = require('node-dir'),
  jf = require('jsonfile'),
  util = require('util');

module.exports = function(conf){
  var conf = _.extend({
    dir : path.join(__dirname, 'app'),
    port : 8080
  },conf);

  // app.use(require('connect-livereload')());
  app.use(express.static(conf.dir));
  app.set("views", conf.dir)
  app.engine('ejs', require('ejs').__express);

  app.get("/", function(req, res, next) {
    dir.paths(conf.dir, function(err,paths){
      if(err)
        res.send(500);
      var filePath = path.join(__dirname, '/app/student-mat-columns.json');
      jf.readFile(filePath, function(err, obj) {
        console.log(util.inspect(obj));
        res.render("base.ejs", obj);
      });
    });
  });

  var relative_dirs = function(curr) {
    return path.relative(conf.dir, curr);
  }

  var excluded_folders = function(val) {
    return !val.match("bower_components");
  }

  app.get("/mat", function(req, res, next) {
    var readable = fs.createReadStream("app/student-mat.json");
    readable.pipe(res);
  });

  app.get("/por", function(req, res, next) {
    var readable = fs.createReadStream("app/student-por.json");
    readable.pipe(res);
  });

  var server = http.createServer(app);

  server.listen(conf.port, function() {
    console.log("Server started");
  });

  console.log("Server started in http://localhost:" + conf.port);
}
