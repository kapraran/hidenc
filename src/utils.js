var fs = require("fs")

var utils = {
  ENCR_EXT: "encr",
  DECR_EXT: "decr",

  fileExists: function(file) {
    return fs.existsSync(file)
  },

  info: function(template, params, extras) {
    utils.print("INFO", template, params, extras)
  },

  error: function(template, params, extras) {
    utils.print("ERROR", template, params, extras)
  },

  print: function(type, template, params, extras) {
    if (!params) params = []

    if (!extras) extras = {}

    template = "[" + type + "] " + template
    params.unshift(template)

    console.log.apply(null, params)

    for (var key in extras) console.log("  -> %s: %s", key, extras[key])
  },

  extEquals: function(file, ext) {
    var parts = file.split(".")

    if (parts.length < 2) return false

    return ext === parts.pop()
  },

  parseFile: function(file) {
    var parts = file.split(".")

    if (parts.length < 3) {
      return parts
    } else {
      var ext = parts.pop()
      var name = parts.join(".")

      return [name, ext]
    }
  }
}

module.exports = utils
