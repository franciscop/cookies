# cookies.js [![Circle CI](https://circleci.com/gh/franciscop/cookies.js/tree/master.svg?style=shield)](https://circleci.com/gh/franciscop/cookies.js/tree/master) [![License MIT](https://img.shields.io/badge/license-MIT-blue.svg)](https://github.com/umbrellajs/umbrella/blob/master/LICENSE)

Super simple cookie manipulation on the front-end using javascript cookies:

```js
cookies({ token: '42' });      // Set it
var token = cookies('token');  // Get it
cookies({ token: null });      // Eat it
```



## Getting started

There are few ways to use cookies.js. You can just install it with bower:

```
bower install cookiesjs
```

Or just download [**cookies.min.js**](https://raw.githubusercontent.com/franciscop/cookies.js/master/cookies.min.js) and use it locally:



## Write a cookie

A cookie is set with a simple object as the first parameter:

```js
cookies({ token: '42' });
```

> We make the assumption that you want a cookie instead of a session, so cookies.js will set the expiration to 100 days by default. Set `cookies.expires = 0` as seen in [the options](#options) to use session cookies

You can also set other complex data and it will be json-encoded saved and retrieved properly:

```js
var userdata = { email: 'test@test.com', token: '42' };
cookies({ user: userdata });
```

You can set as many cookies as you want at the same time:

```js
cookies({ token: '42', question: 'the Ultimate Question' });
```

It will also store numbers (instead of strings) because it uses json to encode them:

```js
cookies({ token: 42 });
var token = cookies('token');
console.log(token === 42, token === '42');  // true false
```

Lastly, you can concatenate them as many times as you want:

```js
cookies({ token: 42 })({ token: '42' });
```

Note that this library doesn't accept a two-parameter strings to set cookies like many of the other libraries to avoid confusion with the options:

```js
// NOT VALID
cookies('token', '42');
```



### Options

> or continue to [read a cookie](#read-a-cookie)

When using cookies you can pass a second parameter as options (shown with the defaults):

```js
cookies({ token: '42' }, {
  expires: 100 * 24 * 3600,     // The time to expire in seconds
  domain: false,                // The domain for the cookie
  path: '/',                    // The path for the cookie
  secure: https ? true : false  // Require the use of https
});
```

Or you could set any of the options globally for all the instances after being called:

```js
cookies.expires = 100 * 24 * 3600;      // The time to expire in seconds
cookies.domain = false;                 // The domain for the cookie
cookies.path = '/';                     // The path for the cookie
cookies.secure = https ? true : false;  // Require the use of https
```

An explanation of them all:

- `expires`: when the cookie will expire and be removed. It can be:
  - A positive int to set the number of seconds until expiration
  - A negative int to remove the cookie
  - A `Date()` instance with the date of expiration
  - `0`, `false` or a *falsy* value to set a session cookie
- `domain`: the domain where the cookie is applied.
- `path`: the folder where the cookie will be available. Normally it's better to leave this empty.
- `secure`: force the cookie to be retrieved through https. By default this is set to true when it's set in an https domain to avoid it being stolen if you later visit an http page on a public connection.


### Advanced options

There are some advanced options that we don't recommend to change, but that you can change if you want to do so. If you change some of these you could have problems down the road.

```js
cookies({ token: '42' }, {
  nulltoremove: true,       // Set the value of a cookie to null to remove it
  autojson: true,           // Encode and decode data structures with JSON
  autoencode: true,         // Encode to make it safe for url (RFC6265)
  encode: function(str){ return encodeURIComponent(str); },  // Function to encode it
  decode: function(str){ return decodeURIComponent(str); }   // Function to decode it
});
```

Normally you'd want to change these options globally:

```js
cookies.nulltoremove = true;
cookies.autojson = true;
cookies.autoencode = true;
cookies.encode = function(str){ return encodeURIComponent(str); };
cookies.decode = function(str){ return decodeURIComponent(str); };
```



## Read a cookie

To read a cookie you call the main function with a string, that is the key of the cookie that you want to read. Let's say that you want to read the cookie `token`

```js
var token = cookies('token');
```

> *cookies.js* automatically stores and retrieves the cookies with JSON and URI-encoded. You can disable this (but normally you wouldn't want to do this) with the options `autojson` and `autoencode` as seen [in the Advanced Options](#advanced-options).

You can set and read a cookie at the same time taking advantage of the concatenation:

```js
var token = cookies({ token: '42' })('token');
// token === '42'
```



## Remove a cookie

With the options by default, you can remove a cookie in few different ways:

```js
cookies({ token: null });
cookies({ token: 'a' }, { expires: -10 });
```




## Author and License

Created and maintained by [Francisco Presencia](https://github.com/franciscop) under the MIT license.
