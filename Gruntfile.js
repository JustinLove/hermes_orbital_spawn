var spec = require('./lib/spec')
var prompt = require('prompt')
prompt.start()

console.log('run')

var modPath = '../../server_mods/com.wondible.pa.hermes_oribital_spawn/'
var stream = 'stable'
var media = require('./lib/path').media(stream)

module.exports = function(grunt) {
  // Project configuration.
  grunt.initConfig({
    copy: {
      mod: {
        files: [
          {
            src: [
              'modinfo.json',
              'LICENSE.txt',
              'README.md',
              'CHANGELOG.md',
              'ui/**',
              'pa/**'],
            dest: modPath,
          },
        ],
      },
    },
    // copy files from PA, transform, and put into mod
    proc: {
      // form 1: just the relative path, media src is assumed
      hermes: {
        src: [
          'pa*/units/orbital/orbital_probe/orbital_probe.json'
        ],
        cwd: media,
        dest: 'pa/units/orbital/orbital_probe/orbital_probe.json',
        process: function(spec) {
          spec.spawn_layers = "WL_Orbital"
          return spec
        }
      },
    }
  });

  grunt.loadNpmTasks('grunt-contrib-copy');

  grunt.registerMultiTask('proc', 'Process unit files into the mod', function() {
    if (this.data.targets) {
      var specs = spec.copyPairs(grunt, this.data.targets, media)
      spec.copyUnitFiles(grunt, specs, this.data.process)
    } else {
      var specs = this.filesSrc.map(function(s) {return grunt.file.readJSON(media + s)})
      var out = this.data.process.apply(this, specs)
      grunt.file.write(this.data.dest, JSON.stringify(out, null, 2))
    }
  })

  grunt.registerTask('printPath', function() {
    console.log(media)
  });

  // Default task(s).
  grunt.registerTask('default', ['proc', 'copy:mod', 'printPath']);

};

