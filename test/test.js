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

describe('Setting the cookies', function () {
  after(function () {
    cookies({ a: null, b: null, c: null, d: null, e: null });
    expect(cookies('a')).to.equal(undefined);
    expect(cookies('b')).to.equal(undefined);
  });

  it('can set a simple cookie', function () {
    expect(cookies({ a: 'b' }, { test: function (str) {
      console.log(str);
    } })('a')).to.equal('b');
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
    expect(cookies({ a: 'a' })({ a: null })('a')).to.equal(undefined);
    expect(cookies({ a: 'a' })({ a: undefined })('a')).to.equal(undefined);
    expect(cookies({ a: 'a' })({ a: 'a' }, { expires: -10 })('a')).to.equal(undefined);
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
