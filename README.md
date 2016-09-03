# cookies.js [![Circle CI](https://circleci.com/gh/franciscop/cookies.js/tree/master.svg?style=shield)](https://circleci.com/gh/franciscop/cookies.js/tree/master) [![js-semistandard-style](https://img.shields.io/badge/code%20style-semistandard-brightgreen.svg)](https://github.com/Flet/semistandard) [![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/umbrellajs/umbrella/blob/master/LICENSE)

Super simple cookie manipulation on the front-end using javascript cookies:

```js
cookies({ token: '42' });      // Set it
var token = cookies('token');  // Get it
cookies({ token: null });      // Kill it
```



## Getting started

There are few ways to use cookies.js:


### Use a CDN

> Not yet; but planned

JSDelivr is an awesome service that hosts many open source projects so you don't need to even download the code:

[**JSDelivr CDN**](http://www.jsdelivr.com/projects/cookies)



### Use bower

Bower is a front-end package manager that makes it super-easy to add a new package:

```
bower install cookiesjs
```

### Module support

If you use a front-end module bundler like Webpack or Browserify, `u` and `ajax` are exposed as CommonJS exports. You can pull them in like so:

```
var u = require('path/to/cookies');
// or ES-style modules
import cookies from 'path/to/cookies';
```

### Download it

If you like it or prefer to try it locally, just download `cookeis.min.js`:

[**Download cookies.js**](https://raw.githubusercontent.com/franciscop/cookies.js/master/cookies.min.js)

Add it to your project:

```html
<script src="cookies.min.js"></script>
```


## Options

When setting the cookies you can pass a second parameter as options:

```js
cookies({ token: '42' }, {
  expires: 100 * 24 * 3600,   // The time to expire in seconds
  path: '/',      // The path for the cookie
  secure: false,  // Require it uses https only
  domain: '.mydomain.com'     // The domain for the cookie
});
```


## Author and License

Created and maintained by [Francisco Presencia](https://github.com/franciscop) under the MIT license.
