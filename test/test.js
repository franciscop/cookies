var expect = chai.expect;

// Testing the main file
describe('cookies()', function () {
  it('should be defined', function () {
    expect(!!cookies).to.equal(true);
  });

  it('should be a function', function () {
    expect(typeof cookies).to.equal('function');
  });

  it('can accept no argument', function () {
    expect(typeof cookies()).to.equal('function', typeof cookies());
  });
});

describe('Reading the cookies', function () {
  afterEach(function () {
    cookies({ a: null, b: null, c: null, d: null, e: null });
    expect(cookies('a')).to.equal(undefined);
    expect(cookies('b')).to.equal(undefined);
  });

  it('can read a simple cookie', function () {
    cookies({ a: 'a' });
    expect(cookies('a')).to.equal('a');
  });

  it('can read a cookie with an equal sign', function () {
    cookies({ a: 'a=b' });
    expect(cookies('a')).to.equal('a=b');
    cookies({ a: null });
  });
});

describe('Setting the cookies', function () {
  afterEach(function () {
    cookies({ a: null, b: null, c: null, d: null, e: null });
    expect(cookies('a')).to.equal(undefined);
    expect(cookies('b')).to.equal(undefined);
  });

  it('can set a simple cookie', function () {
    expect(cookies({ a: 'b' })('a')).to.equal('b');
  });

  it('can set two simple cookies', function () {
    cookies({ a: 'b', c: 'd' });
    expect(cookies('a')).to.equal('b');
    expect(cookies('c')).to.equal('d');
  });

  it('can concatenate cookies', function () {
    cookies({ a: 'b' })({ c: 'd' });
    expect(cookies('a')).to.equal('b');
    expect(cookies('c')).to.equal('d');
  });

  it('can store foreign characters', function () {
    expect(cookies({ a: '北' })('a')).to.equal('北');
  });

  it('can set a number', function () {
    expect(cookies({ a: 42 })('a')).to.equal(42);
  });

  it('can set arrays', function () {
    var arr = ['a', 'b', 'c'];
    expect(cookies({ a: arr })('a')).to.deep.equal(arr);
  });

  it('can set objects', function () {
    var obj = { a: 'a', b: 'b', c: 'c' };
    expect(cookies({ a: obj })('a')).to.deep.equal(obj);
  });

  it('can set complex objects', function () {
    var obj = { a: 5, b: 'b', c: ['c', 'd'], d: { a: 'a', b: 'b' } };
    expect(cookies({ a: obj })('a')).to.deep.equal(obj);
  });

  it('cannot handle methods and special classes', function () {
    var date = new Date();
    expect(cookies({ a: date })('a')).not.to.equal(date);
  });

  it('can delete cookies', function () {
    var a;
    expect(cookies({ a: 'a' })({ a: null })('a')).to.equal(undefined);
    expect(cookies({ a: 'a' })({ a: a })('a')).to.equal(undefined);
    expect(cookies({ a: 'a' })({ a: 'a' }, { expires: -10 })('a')).to.equal(undefined);
  });

  it('can handle a fallback', function () {
    var dataStorage = {
      a: 42,
      b: '25',
      c: { a: 1, b: 2 }
    };
    cookies.fallback = function (data, opt) {
      return dataStorage[data];
    };
    expect(cookies('a')).to.equal(42);
    expect(cookies('b')).to.equal('25');
    expect(cookies('c')).to.deep.equal({ a: 1, b: 2 });
    expect(cookies('d')).to.equal(undefined);
    cookies.fallback = undefined;
  });

  it('large cookies just fail', function () {
    var superlongtext = '';
    for (var i = 0; i < 10; i++) {
      superlongtext += 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    }
    if (!/phantomjs/i.test(navigator.userAgent)) {
      expect(cookies('test')).to.equal(undefined);
    } else {
      console.log('    ? Cannot test large cookies in PhantomJS. Open in browser');
    }
  });
});

describe('Setting the options', function () {
  it('uses expires option', function () {
    cookies({ a: 'a' }, {
      test: function (cookie) {
        expect(cookie.match(/expires\=/).length).to.equal(1);
      }
    });
  });

  it('can set session cookies', function () {
    cookies({ a: 'a' }, {
      expires: false,
      test: function (cookie) {
        expect(cookie.match(/expires\=/)).to.equal(null);
      }
    });
  });

  it('can set future date with both methods', function () {
    var tenmin = new Date();
    tenmin.setTime(tenmin.getTime() + (10 * 60 * 1000));
    cookies({ a: 'a' }, {
      expires: tenmin,
      test: function (exp) {
        expect(exp).not.to.be.empty;
        expect(exp).to.be.a('string');
        cookies({ a: 'a' }, {
          expires: 10 * 60,
          test: function (safe) {
            expect(safe).to.equal(exp);
          }
        });
      }
    });
  });
});

// cookies({ a: 'A value' });
// cookies.expires = 600 * 24 * 3600;
// cookies({ b: 'B value' }, { path: '/bla', domain: '.jshell.net', secure: true });
// cookies({ c: { data: ['a', 'b'], value: 'x' } });
// cookies({ d: '北' });
// cookies({ e: 'E value' })({ f: 'f_value'})({ e: null });
//
// expect(u('.demo').length).to.equal(1);
