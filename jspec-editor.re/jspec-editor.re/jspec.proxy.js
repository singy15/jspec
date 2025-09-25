
// @@@webenv.script(main)

const jspec = (obj) => {
  const isObject = (val) => {
    return val != null && val !== undefined && val.constructor == Object;
  };

  const isArray = (val) => {
    return Array.isArray(val);
  };

  const resolve = (val, path, root, onVisitLinker = null) => {
    let paths = path;
    if (!isArray(path)) {
      paths = (path.startsWith("#") ? path.substring(1) : path).split(".");
    }
    if (paths.length === 0) {
      if (val?.$link) {
        if (onVisitLinker) onVisitLinker(val);
        return resolve(root, val.$link, root, onVisitLinker);
      } else {
        return val;
      }
    }
    if (isObject(val)) {
      return resolve(val[paths[0]], paths.slice(1), root, onVisitLinker);
    } else if (isArray(val)) {
      return resolve(
        val[parseInt(paths[0], 10)],
        paths.slice(1),
        root,
        onVisitLinker,
      );
    }
    return val;
  };

  const createHandler = (root, linker = []) => {
    return {
      get(target, prop, receiver) {
        let ret = undefined;

        //ret = linker?.[prop];
        linker.forEach((lnk) => {
          if (ret === undefined && lnk?.[prop]) {
            ret = lnk?.[prop];
          }
        });

        if (ret === undefined) {
          if (isObject(target)) {
            ret = target[prop];
          } else if (isArray(target)) {
            ret = target[parseInt(prop, 10)];
          }
        }

        let resolved = [];
        if (isObject(ret) && ret.$link) {
          resolved.unshift(ret);
          ret = resolve(root, ret.$link, root, (link) => {
            //console.log("link", link);
            resolved.unshift(link);
          });
        }

        if (isObject(ret) || isArray(ret))
          ret = new Proxy(ret, createHandler(root, resolved));

        return ret;
      },
      set(target, prop, value) {
        // if (linker != null && prop in linker) {
        //   linker[prop] = value;
        // }

        if (linker.length > 0) {
          for (let lnk of linker) {
            if (prop in lnk) {
              lnk[prop] = value;
              break;
            }
          }
        } else {
          if (isObject(target)) {
            target[prop] = value;
          } else if (isArray(target)) {
            target[parseInt(prop, 10)] = value;
          }
        }
        return value;
      },
      ownKeys(target) {
        let keys = {};
        for (let key in target) {
          keys[key] = true;
        }
        // if (linker != null) {
        //   for (let key in linker) {
        //     keys[key] = true;
        //   }
        // }
        if (linker.length > 0) {
          linker.forEach((lnk) => {
            for (let key in lnk) {
              keys[key] = true;
            }
          });
        }
        return Object.keys(keys);
      },
      getOwnPropertyDescriptor(target, prop) {
        if (prop === "$link") {
          // return { configurable: true, enumerable: false, value: linker[prop] };
          return {
            configurable: true,
            enumerable: false,
            value: linker[0][prop],
          };
        }
        // if (linker?.[prop] !== undefined) {
        //   return { configurable: true, enumerable: true, value: linker[prop] };
        // }
        for (let lnk of linker) {
          if (lnk?.[prop] !== undefined) {
            return {
              configurable: true,
              enumerable: true,
              value: lnk[prop],
            };
          }
        }
        return { configurable: true, enumerable: true, value: target[prop] };
      },
    };
  };

  return new Proxy(obj, createHandler(obj));
};

const jspecObj = {
  simple: {
    prop1: 111,
    prop2: {
      x: 222,
    },
    prop3: [333],
    prop4: 444,
  },
  link1: {
    $link: "#simple",
    prop4: 4444,
  },
  link2: {
    $link: "#link1",
    prop4: 44444,
  },
};

let spec = jspec(jspecObj);

console.log("test1", spec.simple.prop1 === 111);
console.log("test link1", spec.link1.prop1 === 111, spec.link1);
console.log("test link2", spec.link1.prop2.x === 222);
console.log("test link3", spec.link1.prop3[0] === 333);
spec.link1.prop3[0] = 555;
console.log("test link4", spec.link1.prop3[0] === 555);
spec.link1.prop2.x = 999;
console.log("test link5", spec.link1.prop2.x === 999);
console.log("test link6", spec.link1.prop4 === 4444, spec.link1.prop4);
spec.link1.prop4 = 44444;
console.log("test link7", spec.link1.prop4 === 44444, spec.link1.prop4);
console.log("test link8", spec.link1.$link === "#simple", spec.link1.$link);
console.log(
  "test link9",
  Object.keys(spec.link1).length === 4,
  Object.keys(spec.link1),
);
console.log("test link10", spec.link2.prop1 === 111, spec.link2.prop1);
console.log("test link11", spec.link2.prop4 === 44444, spec.link2.prop4);
