"use strict";

const fs = require("fs");
const execSync = require("child_process").execSync;
const input = process.argv[2];

function xy2ll(x, y, z) {
  var n = Math.PI - 2 * Math.PI * y / Math.pow(2, z);
  return [
    x / Math.pow(2, z) * 360 - 180,
    180 / Math.PI * Math.atan(0.5 * (Math.exp(n) - Math.exp(-n)))
  ];
}

function Bounds() {
  this.min = null;
  this.max = null;
  this.points = {};
}
Bounds.prototype.add = function(point) {
  this.min = this.min ? [
    Math.min(this.min[0], point[0]),
    Math.min(this.min[1], point[1])
  ] : point;
  this.max = this.max ? [
    Math.max(this.max[0], point[0]),
    Math.max(this.max[1], point[1])
  ] : point;
  this.points[point.join("/")] = true;
};
Bounds.prototype.toPBM = function() {
  var a = "P1\n";
  a += (this.max[0] - this.min[0] + 1) + " ";
  a += (this.max[1] - this.min[1] + 1) + "\n";
  for (var y = this.min[1]; y <= this.max[1]; y++)
    for (var x = this.min[0]; x <= this.max[0]; x++) {
      a += this.points[x + "/" + y] ? "1" : "0";
      a += (x == this.max[0] ? "\n" : " ");
    }
  return a;
};

function flash(zoom, data) {

  var pbm = input.replace(/\.[^\.]+$/, "." + zoom + ".pbm");
  var json = input.replace(/\.[^\.]+$/, "." + zoom + ".json");
  var geojson = input.replace(/\.[^\.]+$/, "." + zoom + ".geojson");

  var bounds = new Bounds();
  data.forEach(a => {
    bounds.add([a[1], a[2]]);
  });

  fs.writeFileSync(pbm, bounds.toPBM(), "UTF-8");
  execSync("potrace -b geojson " + pbm + " -o " + json);

  var dig = function(a) {
    if (a.forEach && !a[0].forEach) {
      var b = xy2ll(bounds.min[0] + a[0] + 0.5, bounds.max[1] - a[1] + 0.5, zoom);
      a[0] = Math.round(b[0] * 10e6) / 10e6;
      a[1] = Math.round(b[1] * 10e6) / 10e6;
    } else if (a.geometry && a.geometry.coordinates)
      a.geometry.coordinates.forEach(dig);
    else if (a.forEach)
      a.forEach(dig);
    else if (a.features)
      a.features.forEach(dig);
    return a;
  };

  var j = dig(JSON.parse(fs.readFileSync(json, "UTF-8")));
  fs.writeFileSync(geojson, JSON.stringify(j, null, ""), "UTF-8");
}

(function() {
  var zoom = NaN;
  var data = [];
  fs.readFileSync(input, "utf-8")
    .split("\n")
    .filter(a => a.match(/^[0-9]+\/.+$/))
    .filter(a => !a.endsWith("41ad1e3d34ec92311b20acb1a37ccef7"))
    .forEach(a => {
      var b = a.split(/[,\.\/]/);
      if (data.length == 0 || b[0] == zoom) {
        data.push(b);
      } else {
        flash(zoom, data);
        data = [];
      }
      zoom = b[0];
    });
  if (data.length > 0)
    flash(zoom, data);
})();

