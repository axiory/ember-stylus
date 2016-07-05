var StylusCompiler = require('broccoli-stylus-single');
var path = require('path');
var checker = require('ember-cli-version-checker');
var mergeTrees = require('broccoli-merge-trees');
var merge = require('merge');
var fs = require('fs');

function StylusPlugin(optionsFn) {
  this.name = 'ember-stylus';
  this.optionsFn = optionsFn;
  this.ext = ['styl'];
}

StylusPlugin.prototype.toTree = function(tree, inputPath, outputPath, inputOptions) {
  var options = merge({}, this.optionsFn(), inputOptions);

  var inputTrees = [tree];
  if (options.includePaths) {
    inputTrees = inputTrees.concat(options.includePaths);
  }
  var ext = options.extension || 'styl';
  var paths = options.outputPaths;
  var trees = Object.keys(paths).map(function(file) {
    var input = path.join(inputPath, file + '.' + ext);
    var output = paths[file];
    return new StylusCompiler(inputTrees, input, output, options);
  });

  return mergeTrees(trees);
};

module.exports = {
  name: 'ember-stylus',

  shouldSetupRegistryInIncluded: function() {
    return !checker.isAbove(this, '0.2.0');
  },

  stylusOptions: function () {
    var env  = process.env.EMBER_ENV;
    var options = (this.app && this.app.options && this.app.options.stylusOptions) || {};
    var envConfig = this.project.config(env).stylusOptions;
    if (envConfig) {
      console.warn("Deprecation warning: stylusOptions should be moved to your ember-cli-build");
      merge(options, envConfig);
    }

    if ((options.sourceMap === undefined) && (env == 'development')) {
      options.sourceMap = true;
    }

    if (options.sourceMap || options.sourceMapEmbed) {
      // we need to embed the sourcesContent in the source map until libsass has better support for broccoli-sass
      options.sourceMapContents = true;
    }

    options.outputFile = options.outputFile || this.project.name() + '.css';

    return options;
  },

  setupPreprocessorRegistry: function(type, registry) {
    registry.add('css', new StylusPlugin(this.stylusOptions.bind(this)));
  },

  included: function included(app) {
    this._super.included.apply(this, arguments);

    // see: https://github.com/ember-cli/ember-cli/issues/3718
    if (typeof app.import !== 'function' && app.app) {
      app = app.app;
    }

    this.app = app;

    if (this.shouldSetupRegistryInIncluded()) {
      this.setupPreprocessorRegistry('parent', app.registry);
    }
  }
};