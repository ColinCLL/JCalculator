(function () {
  //  多种环境支持，以及一些零碎开头引用了underscore的代码 
  var root = typeof self == 'object' && self.self === self && self ||
  typeof global == 'object' && global.global === global && global || this;
  //  保存jc 
  var previousjc = root.jc;
  //  原型赋值，便于压缩 
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var push = ArrayProto.push,
    slice = ArrayProto.slice,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;
    //  定义了一些ECMAScript 5方法 
  var nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeCreate = Object.create;

  //  创建一个jc对象, 保留将来有拓展成支持链式的可能 
  var jc = function (obj) {
    if (obj instanceof jc) return obj;
    if (!(this instanceof jc)) return new jc(obj);
    this._wrapped = obj;
  };
  //  针对不同的环境 
  if (typeof exports != 'undefined' && !exports.nodeType) {
    if (typeof module != 'undefined' && !module.nodeType && module.exports) {
      exports = module.exports = jc;
    }
    exports.jc = jc;
  } else {
    root.jc = jc;
  }
  // 版本 
  jc.VERSION = '1.0.0';

  // 循环 
  jc.map = function (val, fn) {
    if (jc.isArray(val)) return val.map(fn);
    if (jc.isObject(val)) return Object.values(val).map(fn)
  };

  // 对象遍历 
  jc.forIn = function (obj, fn) {
    if (!jc.isObject(obj)) return obj;
    var i = 0
    for (var key in obj) {
      fn(key, obj[key], obj, i)
      i++;
    }
  }

  // 原生filter，容错处理 
  jc.filter = function (val, fn) {
    if (jc.isArray(val)) {
      return val.filter(fn);
    } else {
      return val;
    }
  }

  // filter加工，可通过对象过滤 
  jc.where = function (val, key) {
    return jc.filter(val, function (d) {
      return Object.keys(key).every(function (k) {
        return key[k] === d[k];
      })
    });
  }

  // es6去重 
  function unique (arr) {
    var set = new Set(arr);
    return Array.from(set);
  }

  jc.sum = function (val, key) {
    var sum, length = 0, count = 0;
    if (jc.isArray(val)) {
      sum = !key || jc.isString(key) ? 0 : {},
      jc.map(val, function (row) {
        if (!key && (jc.isNumber(row))) {
          sum += row || 0;
        } else if (jc.isArray(key) && jc.isObject(row)) {
          jc.map(key, function (k) {
            if (!sum[k]) sum[k] = 0;
            sum[k] += row[k];
          })
        } else if (jc.isString(key)) {
          sum += row[key];
        }
      });
    }

    if (!jc.isArray(val) && jc.isObject(val)) {
      sum = 0;
      jc.forIn(val, function (k, row, i) {
        if (!!key) {
          jc.map(key, function (k1, j) {
            if (k == k1) sum += row[k];
          })
        } else {
          sum += row[k];
        }
      });
    }
    return sum;
  }

  jc.group = function (val, key) {
    var groups = {};
    jc.map(val, function (row, i) {
      var k = [];
      if (jc.isArray(key)) {
        jc.map(key, function (a, i) {
          k.push(row[a]);
        })
      } else if (jc.isString(key)) {
        k.push(row[key])
      } else if (jc.isFunction(key)) {
        k = key(row, i);
      }
      if (!groups[k]) groups[k] = [];
      groups[k].push(row);
    })
    return groups;
  }
  jc.sql = function (query) {
    if (!query.from) return;
    var table = query.from;
    var whereData, groupData, selectData;
    whereData = sqlWhere(table, query.where);
    groupData = sqlGroup(whereData, query.groupBy);
    selectData = sqlSelect(groupData, query.select);
    console.log(selectData);
  }

  function errorCheck (select) {
    var col = selectType("", select.col);
    if (!select) throw new Error("Error select", "Select is not defined");
  }

  function sqlWhere (table, where) {
    if (!where) return table;
    if (jc.isFunction(where)) return jc.filter(table, where);
    if (jc.isObject(where)) return jc.where(table, where);
  }

  function sqlGroup (table, group) {
    if (!group) return {table : table};
    return jc.group(table, group);
  }

  function sqlSelect (table, select) {
    if (!select) throw new Error("Error select", "Select is not defined");
    var selectData = [];
    if (select.col) var colObj = selectType("", select.col);
    if (select.sum) var sumObj = selectType("sum_", select.sum);
    if (select.avg) var avgObj = selectType("avg_", select.avg);
    if (select.max) var maxObj = selectType("max_", select.max);
    if (select.min) var minObj = selectType("min_", select.min);
    if (select.count) var countObj = selectType("count_", select.count);

    jc.forIn(table, function (groupKey, groupItem, obj, i) {
      var row = groupCyclic(groupItem, colObj, sumObj, avgObj, maxObj, minObj, countObj);
      selectData.push(row);
    });

    return selectData;
  }

  function selectType (prefix, option) {
    var obj = {};
    if (jc.isArray(option)) {
      jc.map(option, function (key) {
        obj[prefix + key] = key;
      })
    } else if (jc.isObject(option)) {
      jc.forIn(option, function (key, val) {
        obj[key] = val;
      })
    } else if (jc.isString(option)) {
      obj[prefix + option] = option;
    }
    return obj
  }

  function groupCyclic (groupItem, colObj, sumObj, avgObj, maxObj, minObj, countObj) {
    var newRow = {};
    var itemLength = groupItem.length, validLength = 0;
    jc.map(groupItem, function (row) {
      if (colObj) {
        jc.forIn(colObj, function (key, val) {
          var rowVal = jc.isFunction(val) ? val(row) : row[val];
          newRow[key] = rowVal;
        })
      }

      if (sumObj) {
        jc.forIn(sumObj, function (key, val) {
          var rowVal = jc.isFunction(val) ? val(row) : row[val];
          newRow[key] ? newRow[key] += rowVal || 0 : newRow[key] = rowVal || 0;
        })
      }

      if (avgObj) {
        jc.forIn(avgObj, function (key, val) {
          var rowVal = jc.isFunction(val) ? val(row) : row[val];
          newRow[key] ? newRow[key] += rowVal || 0 : newRow[key] = rowVal || 0;
        })
      }

      //  if (avgValidObj) { 
      //    jc.forIn(avgValidObj, function(key, val) { 
      //      var rowVal=jc.isFunction(val) ?  val(row) :  row[val]; 
      //      if (rowVal) validLength++; 
      //      newRow[key] ? newRow[key]+=rowVal||0 :  newRow[key]=rowVal||0; 
      //    }) 
      //  } 

      if (maxObj) {
        jc.forIn(maxObj, function (key, val) {
          var rowVal = jc.isFunction(val) ? val(row) : row[val];
          newRow[key] = newRow[key] > rowVal ? newRow[key] : rowVal;
        })
      }

      if (minObj) {
        jc.forIn(minObj, function (key, val) {
          var rowVal = jc.isFunction(val) ? val(row) : row[val];
          newRow[key] = newRow[key] < rowVal ? newRow[key] : rowVal;
        })
      }

      // COUNT(*)对所有行数计数，COUNT(字段名)对特定列有数据的行进行计数，忽略空值。
      if (countObj) {
        jc.forIn(countObj, function (key, val) {
          var rowVal = jc.isFunction(val) ? val(row) : row[val];
          if (jc.isUndefined(newRow[key])) newRow[key] = 0;
          switch (key) {
          case "*" :
            newRow[key] = itemLength;
            break;
          default :
            if (!jc.isUndefined(rowVal)) {
              newRow[key]++
            }
          }
        })
      }
    })
    jc.forIn(avgObj, function (key, val) {
      newRow[key] = newRow[key] / itemLength;
    })
    return newRow;
  }

  // 类型判断, 偷懒引用了underscore的代码. 
  jc.isArray = nativeIsArray || function (val) {
    return toString.call(val) === '[object Array]';
  };

  jc.isObject = function (val) {
    var type = typeof val;
    return type === 'function' || type === 'object' && !!val;
  };

  jc.map(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function (name) {
    jc['is' + name] = function (val) {
      return toString.call(val) === '[object ' + name + ']';
    };
  });

  jc.isUndefined = function (val) {
    return val === void 0;
  };

  //  对AMD支持的一些处理
  if (typeof define == 'function' && define.amd) {
    define('jc', [], function () {
      return jc;
    });
  }
}());