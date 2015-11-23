'use strict';
var yeoman = require('yeoman-generator');
var yosay = require('yosay');
var mkdirp = require('mkdirp');

module.exports = yeoman.generators.Base.extend({
  constructor: function () {
    yeoman.generators.Base.apply(this, arguments);

    this.option('skip-install', {
      desc: 'Skips the installation of dependencies',
      type: Boolean
    });
  },

  initializing: function () {
    this.pkg = require('../package.json');
  },

  prompting: function () {
    var done = this.async();

    this.log(yosay("Sit tight dawg!"));

    done();
  },

  writing: {
    mkdir: function () {
      mkdirp.sync('docs');

      mkdirp.sync('src');
      mkdirp.sync('src/fonts');
      mkdirp.sync('src/images');
      mkdirp.sync('src/scripts');
      mkdirp.sync('src/scripts/vendor');
      mkdirp.sync('src/styles');
      mkdirp.sync('src/styles/vendor');

      mkdirp.sync('test');
      mkdirp.sync('tmp');

      mkdirp.sync('www');
      mkdirp.sync('www/fonts');
      mkdirp.sync('www/images');
      mkdirp.sync('www/scripts');
      mkdirp.sync('www/styles');
    }, 
    src: function () {
      // js templates
      this.copy('js/helpers.js', 'src/scripts/_helpers.js');
      this.copy('js/app.js', 'src/scripts/app.js');

      // sass templates
      this.copy('sass/main.scss', 'src/styles/main.scss');

      // html templates
      this.copy('index.html', 'src/index.html');
    },

    h5bp: function () {
      this.copy('h5bp/apple-touch-icon.png', 'apple-touch-icon.png');
      this.copy('h5bp/robots.txt', 'robots.txt');
      this.copy('h5bp/favicon.ico', 'favicon.ico');
    },

    tests: function () {
      // this.fs.copy(
      //   this.templatePath('runner.html'),
      //   this.destinationPath('test/runner.html')
      // );
      this.copy('tests/tests.js', 'test/main.js');
    },

    // sprites: function() {
    //   mkdirp.sync('src/css/sprites');
    //   mkdirp.sync('src/img/sprites');

    //   this.fs.copy(
    //     this.templatePath('emptyfile'),
    //     this.destinationPath('src/css/sprites/index.scss')
    //   );

    //   this.fs.copy(
    //     this.templatePath('emptyfile'),
    //     this.destinationPath('src/img/sprites/.gitkeep')
    //   );
    // },

    packageJSON: function () {
      this.template('env/_package.json', 'package.json');
    },

    gulpfile: function () {
      this.template('env/gulpfile.js', 'gulpfile.js');
    },

    git: function () {
      this.copy('env/gitignore', '.gitignore');
    },

    projectfiles: function () {
      this.copy('env/babelrc', '.babelrc');
      this.copy('env/jshintrc', '.jshintrc');
      this.copy('README.md', 'README.md');
      this.copy('LICENSE.txt', 'LICENSE.txt');
    }    
  },

  install: function () {
    this.installDependencies({
      skipInstall: this.options['skip-install']
    });
  }
});
