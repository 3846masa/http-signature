class Headers implements Record<string, any[] | any> {
  [property: string]: any[] | any;

  constructor(headers: Record<string, any[] | any> = {}) {
    const lowerCased = new Map(Object.entries(headers).map(([property, value]) => [property.toLowerCase(), value]));

    return new Proxy(this, {
      get(_target, property) {
        if (typeof property !== 'string') {
          return undefined;
        }
        return lowerCased.get(property.toLowerCase());
      },
      set(_target, property, value) {
        if (typeof property !== 'string') {
          return false;
        }
        lowerCased.set(property.toLowerCase(), value);
        return true;
      },
    });
  }
}

export { Headers };
