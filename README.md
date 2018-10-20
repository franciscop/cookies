# cookies.js [![Circle CI](https://circleci.com/gh/franciscop/cookies.js/tree/master.svg?style=shield)](https://circleci.com/gh/franciscop/cookies.js/tree/master) [![gzip size](https://img.badgesize.io/franciscop/cookies.js/master/cookies.min.js.svg?compression=gzip)](https://github.com/franciscop/cookies.js/blob/master/cookies.min.js) [![](https://data.jsdelivr.com/v1/package/npm/cookiesjs/badge?style=rounded)](https://www.jsdelivr.com/package/npm/cookiesjs)

Super simple cookie manipulation on the front-end using javascript:

```js
cookies({ token: '42' });     // Set it
var token = cookies('token'); // Get it
cookies({ token: null });     // Eat it
```

> **News**: See my latest Cookies and localStorage library **[`brownies`](https://github.com/franciscop/brownies)**!



## Getting started


There are few ways to use cookies.js. To install it into your bundle use *npm*:

```
npm install cookiesjs
```

Then import it into your project:

```js
import cookies from 'cookiesjs';  // New style
const cookies = require('cookiesjs');  // Old school

cookies(...);  // Use it
```

You can alternatively use the awesome JSDelivr CDN:

```html
<script src="https://cdn.jsdelivr.net/npm/cookiesjs@3"></script>
<script type="text/javascript">
  cookies(...);
</script>
```

Or just [download **cookies.min.js**](https://raw.githubusercontent.com/franciscop/cookies.js/master/cookies.min.js) and use it locally:

```html
<script src="cookies.min.js"></script>
<script type="text/javascript">
  cookies(...);
</script>
```




## Write a cookie

A cookie is set with a simple object as the first parameter:

```js
cookies({ token: '42' });
```

> We make the assumption that you want a cookie instead of a session, so cookies.js will set the expiration to 100 days by default. Set `cookies.expires = 0` as seen in [the options](#options) to use session cookies

You can set as many cookies as you want at the same time:

```js
cookies({ token: '42', question: 'the Ultimate Question' });
```

The example above would be the same as this:

```js
cookies({ question: 'the Ultimate Question' });
cookies({ token: '42' });
```


You can also set complex data and it will be json-encoded saved and retrieved properly **in a single cookie**:

```js
var userdata = { email: 'test@test.com', token: '42' };
cookies({ user: userdata });
```

The example above is **different** from this one. This one sets *two* cookies:

```js
cookies({ email: 'test@test.com' });
cookies({ token: '42' });
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

Note that this library **does not** accept a two-parameter strings to set cookies like many other libraries to avoid confusion with the options:

```js
// NOT VALID
cookies('token', '42');
```



### Options

> or continue to [read a cookie](#read-a-cookie)

When using cookies you can pass a second parameter as options (shown here with the defaults):

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

For instance, to set a cookie that expires in 24h you would do:

```js
cookies({ shortlife: 42 }, { expires: 24 * 3600 });
```

To set two cookies with the same domain, you could do:

```js
cookies({ same: '4', place: '2' }, { domain: '.example.com' });
```

But you can also set them to different domains:

```js
cookies({ same: '4' }, { domain: '.example.com' });
cookies({ place: '2' }, { domain: 'sub.example.com' });
```


### Advanced options

There are some advanced options that we don't recommend to change as you could have problems down the road, but if you know what you are doing go ahead.

```js
cookies({ token: '42' }, {
  nulltoremove: true,       // Set the value of a cookie to null to remove it
  autojson: true,           // Encode and decode data structures with JSON
  autoencode: true,         // Encode to make it safe for url (RFC6265)
  encode: function(str){ return encodeURIComponent(str); },  // Function to encode it
  decode: function(str){ return decodeURIComponent(str); },  // Function to decode it
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

Few notes and warnings:

- If you want to store a `null` value in a cookie you'll have to set up `cookies.nulltoremove = false`.
- If you cancel `cookies.autojson`, be aware that objects will be stored literally as `[object Object]`, arrays will be joined with `,` and numbers will become strings.
- Changing `cookies.autoencode` or `cookies.encode` could contribute to stop making it [RFC 6265 compliant](https://news.ycombinator.com/item?id=12450841).


## Read a cookie

To read a cookie you call the main function with a string, that is the key of the cookie that you want to read. Let's say that you want to read the cookie `token`

```js
var token = cookies('token');
```

> *cookies.js* automatically stores and retrieves the cookies with JSON and URI-encoded. You can disable this with the options `autojson` and `autoencode` as seen [in the Advanced Options](#advanced-options).

Set and read a cookie:

```js
cookies({ token: '42' });
var token = cookies('token');
// token === '42'
```

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

So, let's write, remove and read a cookie:

```js
cookies({ token: '42' });
cookies({ token: null });
var token = cookies('token');
// token === undefined
```



## Examples

Let's do a typical (simplified) authentication flow:

```js
var token = cookies('token');
var user;
if (token) {
  $.post('/user/auth', { token: token }, function(data){
    user = data;
  });
}
```

Or let's check if the user accepts cookies (European law):

```js
if (!cookies('accepted')) {
  $('.cookie-box').show();
  $('.cookie-box .accept').click(function(){
    $('.cookie-box').hide();
    cookies({ accepted: true });
  });
}
```



## Author and License

Created and maintained by [Francisco Presencia](https://github.com/franciscop) under the MIT license.
