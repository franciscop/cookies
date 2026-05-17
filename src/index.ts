export interface CookieOptions {
  expires?: number | Date | false;
  domain?: string | false;
  path?: string;
  secure?: boolean;
  nulltoremove?: boolean;
  autojson?: boolean;
  autoencode?: boolean;
  encode?: (val: string) => string;
  decode?: (val: string) => string;
  fallback?: ((key: string, opt: CookieOptions) => unknown) | false;
  test?: (cookie: string) => void;
}

export interface CookiesFn extends CookieOptions {
  (): CookiesFn;
  (data: string): unknown;
  (data: Record<string, unknown>, opt?: CookieOptions): CookiesFn;
}

const cookies = function (data?: string | Record<string, unknown>, opt?: CookieOptions): unknown {
  const c = cookies as CookiesFn;

  if (c.expires === undefined) c.expires = 365 * 24 * 3600;
  if (c.path === undefined) c.path = '/';
  if (c.secure === undefined) c.secure = window.location.protocol === 'https:';
  if (c.nulltoremove === undefined) c.nulltoremove = true;
  if (c.autojson === undefined) c.autojson = true;
  if (c.autoencode === undefined) c.autoencode = true;
  if (c.encode === undefined) c.encode = encodeURIComponent;
  if (c.decode === undefined) c.decode = decodeURIComponent;
  if (c.fallback === undefined) c.fallback = false;

  // Merge per-call options with global defaults; per-call options take precedence if defined
  const o: CookieOptions = {
    expires: c.expires, path: c.path, secure: c.secure, nulltoremove: c.nulltoremove,
    autojson: c.autojson, autoencode: c.autoencode, encode: c.encode, decode: c.decode,
    fallback: c.fallback, domain: c.domain,
  };
  if (opt) {
    for (const key in opt) {
      const v = (opt as Record<string, unknown>)[key];
      if (v !== undefined) (o as Record<string, unknown>)[key] = v;
    }
  }

  const encode = o.encode ?? encodeURIComponent;
  const decode = o.decode ?? decodeURIComponent;

  function makeExpires(time: number | Date): string {
    if (time instanceof Date) return time.toUTCString();
    const d = new Date();
    d.setTime(d.getTime() + time * 1000);
    return d.toUTCString();
  }

  if (typeof data === 'string') {
    const decoder = o.autoencode ? decode : (s: string) => s;
    const value = document.cookie
      .split(/;\s*/)
      .map(decoder)
      .map(part => part.split('='))
      .reduce<Record<string, string>>((acc, part) => {
        const [k = '', ...rest] = part;
        acc[k] = rest.join('=');
        return acc;
      }, {})[data];

    if (!o.autojson) return value;
    let real: unknown;
    try { real = JSON.parse(value as string); }
    catch { real = value; }
    if (typeof real === 'undefined' && o.fallback) real = o.fallback(data, o);
    return real;
  }

  if (data) {
    for (const key in data) {
      const val = data[key];
      const expired = val === undefined || (o.nulltoremove === true && val === null);
      const str = o.autojson ? JSON.stringify(val) : String(val);
      let encoded = o.autoencode ? encode(str) : str;
      if (expired) encoded = '';
      const res =
        encode(key) + '=' + encoded +
        (o.expires ? ';expires=' + makeExpires(expired ? -10000 : (o.expires as number | Date)) : '') +
        ';path=' + (o.path ?? '/') +
        (o.domain ? ';domain=' + o.domain : '') +
        (o.secure ? ';secure' : '');
      o.test?.(res);
      document.cookie = res;
    }
  }

  return cookies;
} as CookiesFn;

if (typeof window !== 'undefined') {
  (window as unknown as Record<string, unknown>)['cookies'] ??= cookies;
}

export { cookies };
export default cookies;
