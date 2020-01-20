const fs = require("fs");
const copydir = require("copy-dir");
const path = require("path");
const del = require("del");

const copyFile = function(source, dist) {
  dist = dist || source;
  fs.createReadStream(source).pipe(fs.createWriteStream(`dist/${dist}`));
};

const run = async function() {
  // del.sync("dist");
  // fs.mkdirSync("dist");

  await copydir("src", "dist", {
    cover: true,
    filter(stat, filepath, filename) {
      if (stat === "file" && path.extname(filepath) === ".ts") {
        return false;
      }
      return true;
    }
  });
};

run();
