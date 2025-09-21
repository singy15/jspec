const jspec = (obj) => {
  const isObject = (val) => {
    return val != null && val !== undefined && val.constructor == Object;
  };

  const isArray = (val) => {
    return Array.isArray(val);
  };

  const resolve = (val, path) => {
    let paths = path;
    if (!isArray(path)) paths = path.split(".");
    if (paths.length === 0) return val;
    if (isObject(val)) {
      return resolve(val[paths[0]], paths.slice(1));
    } else if (isArray(val)) {
      return resolve(val[parseInt(paths[0], 10)], paths.slice(1));
    }
    return val;
  };

  const createHandler = (root) => {
    return {
      get(target, prop, receiver) {
        let ret;

        if (isObject(target)) {
          ret = target[prop];
        } else if (isArray(target)) {
          ret = target[parseInt(prop, 10)];
        }

        if (isObject(ret) && ret.$link) {
          ret = resolve(root, ret.$link);
        }

        if (isObject(ret) || isArray(ret))
          ret = new Proxy(ret, createHandler(root));

        return ret;
      },
    };
  };

  return new Proxy(obj, createHandler(obj));
};

