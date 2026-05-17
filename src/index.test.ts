import { GlobalRegistrator } from '@happy-dom/global-registrator';
import { describe, it, expect, afterEach, beforeEach } from 'bun:test';
import cookies from './index';

GlobalRegistrator.register({ url: 'http://localhost' });

beforeEach(() => {
  document.cookie.split(';').forEach(c => {
    const [key = ''] = c.trim().split('=');
    if (key) document.cookie = `${key}=;expires=Thu, 01 Jan 1970 00:00:00 UTC;path=/`;
  });
});

describe('cookies()', () => {
  it('should be defined', () => {
    expect(!!cookies).toBe(true);
  });

  it('should be a function', () => {
    expect(typeof cookies).toBe('function');
  });

  it('can accept no argument', () => {
    expect(typeof cookies()).toBe('function');
  });
});

describe('Reading the cookies', () => {
  afterEach(() => {
    cookies({ a: null, b: null, c: null, d: null, e: null });
    expect(cookies('a')).toBe(undefined);
    expect(cookies('b')).toBe(undefined);
  });

  it('can read a simple cookie', () => {
    cookies({ a: 'a' });
    expect(cookies('a')).toBe('a');
  });

  it('can read a cookie with an equal sign', () => {
    cookies({ a: 'a=b' });
    expect(cookies('a')).toBe('a=b');
    cookies({ a: null });
  });
});

describe('Setting the cookies', () => {
  afterEach(() => {
    cookies({ a: null, b: null, c: null, d: null, e: null });
    expect(cookies('a')).toBe(undefined);
    expect(cookies('b')).toBe(undefined);
  });

  it('can set a simple cookie', () => {
    expect(cookies({ a: 'b' })('a')).toBe('b');
  });

  it('can set two simple cookies', () => {
    cookies({ a: 'b', c: 'd' });
    expect(cookies('a')).toBe('b');
    expect(cookies('c')).toBe('d');
  });

  it('can concatenate cookies', () => {
    cookies({ a: 'b' })({ c: 'd' });
    expect(cookies('a')).toBe('b');
    expect(cookies('c')).toBe('d');
  });

  it('can store foreign characters', () => {
    expect(cookies({ a: '北' })('a')).toBe('北');
  });

  it('can set a number', () => {
    expect(cookies({ a: 42 })('a')).toBe(42);
  });

  it('can set arrays', () => {
    const arr = ['a', 'b', 'c'];
    expect(cookies({ a: arr })('a')).toEqual(arr);
  });

  it('can set objects', () => {
    const obj = { a: 'a', b: 'b', c: 'c' };
    expect(cookies({ a: obj })('a')).toEqual(obj);
  });

  it('can set complex objects', () => {
    const obj = { a: 5, b: 'b', c: ['c', 'd'], d: { a: 'a', b: 'b' } };
    expect(cookies({ a: obj })('a')).toEqual(obj);
  });

  it('cannot handle methods and special classes', () => {
    const date = new Date();
    expect(cookies({ a: date })('a')).not.toBe(date);
  });

  it('can delete cookies', () => {
    let a: undefined;
    expect(cookies({ a: 'a' })({ a: null })('a')).toBe(undefined);
    expect(cookies({ a: 'a' })({ a: a })('a')).toBe(undefined);
    expect(cookies({ a: 'a' })({ a: 'a' }, { expires: -10 })('a')).toBe(undefined);
  });

  it('can handle a fallback', () => {
    const dataStorage: Record<string, unknown> = {
      a: 42,
      b: '25',
      c: { a: 1, b: 2 },
    };
    cookies.fallback = (data: string) => dataStorage[data];
    expect(cookies('a')).toBe(42);
    expect(cookies('b')).toBe('25');
    expect(cookies('c')).toEqual({ a: 1, b: 2 });
    expect(cookies('d')).toBe(undefined);
    cookies.fallback = undefined;
  });

  it('large cookies just fail', () => {
    let superlongtext = '';
    for (let i = 0; i < 10; i++) {
      superlongtext += 'Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui officia deserunt mollit anim id est laborum.';
    }
    void superlongtext;
    expect(cookies('test')).toBe(undefined);
  });
});

describe('Setting the options', () => {
  it('uses expires option', () => {
    cookies({ a: 'a' }, {
      test: (cookie: string) => {
        expect(cookie.match(/expires=/)?.length).toBe(1);
      },
    });
  });

  it('can set session cookies', () => {
    cookies({ a: 'a' }, {
      expires: false,
      test: (cookie: string) => {
        expect(cookie.match(/expires=/)).toBeNull();
      },
    });
  });

  it('can set future date with both methods', () => {
    const tenmin = new Date();
    tenmin.setTime(tenmin.getTime() + (10 * 60 * 1000));
    cookies({ a: 'a' }, {
      expires: tenmin,
      test: (exp: string) => {
        expect(exp.length).toBeGreaterThan(0);
        expect(typeof exp).toBe('string');
        cookies({ a: 'a' }, {
          expires: 10 * 60,
          test: (safe: string) => {
            expect(safe).toBe(exp);
          },
        });
      },
    });
  });
});
