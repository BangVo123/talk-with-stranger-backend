const _ = require("lodash");

const pickDataInfo = (object = {}, fields = []) => _.pick(object, fields);

const removeKeys = (obj = {}, keys = []) => _.omit(obj, keys);

function deepCleanObj(obj) {
  let cloned = { ...obj };

  for (var key in cloned) {
    if (cloned[key] === undefined || cloned[key] === null) {
      delete cloned[key];
    }
    if (typeof cloned[key] === "object") {
      const re = deepCleanObj(cloned[key]);
      cloned[key] = re;
    }
  }

  return cloned;
}

module.exports = {
  pickDataInfo,
  removeKeys,
  deepCleanObj,
};
