# ember-stylus

ember-stylus uses broccoli-stylus-single to preprocess your ember-cli app's files and provides support for source maps and include paths. It provides support for the common use case for Ember.js projects:

- Source maps by default in development
- Support for [`outputPaths` configuration](http://ember-cli.com/user-guide/#configuring-output-paths)
- Provides the ability to specify include paths

## Installation

```
ember install ember-stylus
```

### Addon Development

If you want to use ember-stylus in an addon and you want to distribute the compiled CSS it must be installed as a `dependency` so that `addon/styles/addon.styl` is compiled into `dist/assets/vendor.css`. This can be done using:

```bash
npm install --save ember-stylus
```

## Usage

By default this addon will compile `app/styles/app.styl` into `dist/assets/[app-name].css` and produce 
a source map for your delectation.

If you want more control then you can specify options using the
`stylusOptions` config property in `ember-cli-build.js` (or in `Brocfile.js` if you are using an Ember CLI version older than 1.13):

```javascript
var app = new EmberApp({
  stylusOptions: {...}
});
```

- `includePaths`: an array of include paths
- `sourceMap`: controls whether to generate sourceMaps, defaults to `true` in development. The sourceMap file will be saved to `options.outputFile + '.map'`

### Processing multiple files

If you need to process multiple files, it can be done by [configuring the output paths](http://ember-cli.com/user-guide/#configuring-output-paths) in your `ember-cli-build.js`:

```js
var app = new EmberApp({
  outputPaths: {
    app: {
      css: {
        'app': '/assets/application-name.css',
        'themes/alpha': '/assets/themes/alpha.css'
      }
    }
  }
});
```

## Example

The following example assumes your bower packages are installed into `node_modules/`.

Install some Stylus:

```shell
npm install --save-dev kouto-swiss
```

Specify some include paths in your `ember-cli-build.js`:

```javascript
var app = new EmberApp({
  stylusOptions: {
    includePaths: [
      'node_modules/kouto-swiss'
    ]
  }
});
```

Import some deps into your app.scss:

```stylus
@import 'kouto-swiss'; /* import everything */
/* or just import the bits you need: @import 'kouto-swiss/functions'; */
```

## Addon Usage

To compile Stylus within an ember-cli addon, there are a few additional steps:

1. Include your styles in `addon/styles/addon.styl`.

2. Ensure you've installed `ember-stylus` under `dependencies` in your
   `package.json`.

3. Define an `included` function in your app:
   ```js
   // in your index.js
   module.exports = {
     name: 'my-addon',
     included: function(app) {
       this._super.included(app);
     }
   };
   ```

4. Make sure your dummy app contains an `app.scss`

5. If you run `ember build dist`, your styles from `addon/styles/addon.styl`
   should appear correctly in `dist/assets/vendor.css`

For an example of an addon that does this correctly, see
[ember-cli-notifications](https://github.com/Blooie/ember-cli-notifications)
