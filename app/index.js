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
      this.copy('helpers.js', 'src/scripts/_helpers.js');
      this.copy('app.js', 'src/scripts/app.js');

      // sass templates
      this.copy('main.scss', 'src/styles/main.scss');

      // html templates
      this.copy('index.html', 'src/index.html');
    },

    h5bp: function () {
      this.copy('apple-touch-icon.png', 'apple-touch-icon.png');
      this.copy('robots.txt', 'robots.txt');
      this.copy('favicon.ico', 'favicon.ico');
    },

    tests: function () {
      // this.fs.copy(
      //   this.templatePath('runner.html'),
      //   this.destinationPath('test/runner.html')
      // );
      this.copy('tests.js', 'test/main.js');
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
      this.template('_package.json', 'package.json');
    },

    gulpfile: function () {
      this.template('gulpfile.js', 'gulpfile.js');
    },

    git: function () {
      this.copy('gitignore', '.gitignore');
    },

    projectfiles: function () {
      this.copy('babelrc', '.babelrc');
      this.copy('jshintrc', '.jshintrc');
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
