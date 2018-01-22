(function () {
  // 多种环境支持，以及一些零碎开头引用了underscore的代码，致敬经典。
  var root = typeof self == 'object' && self.self === self && self ||
  typeof global == 'object' && global.global === global && global || this;
  // 保存jc
  var previousjc = root.jc;
  // 原型赋值，便于压缩
  var ArrayProto = Array.prototype, ObjProto = Object.prototype;
  var push = ArrayProto.push,
    slice = ArrayProto.slice,
    toString = ObjProto.toString,
    hasOwnProperty = ObjProto.hasOwnProperty;
  // 定义了一些ECMAScript 5方法
  var nativeIsArray = Array.isArray,
    nativeKeys = Object.keys,
    nativeValues = Object.values ? Object.values : function (obj) {
      return nativeKeys(obj).map(function (key) {
        return obj[key];
      })
    },
    nativeCreate = Object.create;

  // 创建一个jc对象, 保留将来有拓展成支持链式的可能
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

  /**
  * 遍历
  *
  * @public
  * @param {array} data 数据
  * @param {function} fn 循环每行执行函数
  */
  jc.map = function (data, fn) {
    if (jc.isArray(data)) return data.map(fn);
    return [];
  };

  /**
  * 对象键值对循环
  *
  * @public
  * @param {objec} obj 数据
  * @param {function} fn 循环每个键值对执行函数
  */
  jc.forIn = function (obj, fn) {
    if (!jc.isObject(obj)) return {};
    var i = 0
    for (var key in obj) {
      fn(key, obj[key], i);
      i++;
    }
  }

  /**
  * 过滤
  *
  * @public
  * @param {array} data 数据
  * @param {function} iteratee 过滤函数
  */
  jc.filter = function (data, iteratee) {
    if (jc.isArray(data)) {
      return data.filter(iteratee);
    } else {
      return [];
    }
  }

  /**
  * 过滤
  *
  * @public
  * @param {array} data 数据
  * @param {object} key 过滤条件
  */
  jc.where = function (data, key) {
    var result;
    if (jc.isFunction(key)) {
      result = jc.filter(data, key)
    } else if (jc.isObject(key)) {
      result = jc.filter(data, function (d) {
        return nativeKeys(key).every(function (k) {
          return key[k] === d[k];
        })
      });
    } else {
      return []
    }
    return result;
  }


  /**
  * limit
  *
  * @public
  * @param {array} val 数据
  * @param {object} option 检索条件
  */
  jc.limit = function (data, option) {
    return sqlLimit(data, option);
  }

  /**
  * orderBy
  *
  * @public
  * @param array data 数据
  * @param {object||function} iteratee 排序条件
  */
  jc.order = jc.orderBy = function (data, iteratee) {
    return sqlOrder(data, iteratee);
  }

  /**
  * tree
  * 生成树
  *
  * @public
  * @param data 数据
  * @param option 生成树相关配置项
  */
  jc.tree = function (data, option) {
    if (!option.children) option.children = "children";
    // 生成jc.sql中的col选择项
    var col;
    if (jc.isString(option.retain)) {
      col = [option.retain, option.id, option.parent]
    } else if (jc.isArray(option.retain)) {
      col = option.retain;
      col.push(option.id);
      col.push(option.parent);
    } else if (jc.isObject(option.retain)) {
      col = option.retain;
      col[option.id] = option.id;
      col[option.parent] = option.parent;
    } else {
      // 为了不影响原始数据
      data = jc.extend(true, [], data);
    }
    // 使用sql方法，生成data;
    if (col) {
      data = jc.sql({
        select: {
          col: col
        },
        from: data
      })
    }

    // 上面都是都是为了提高灵活度，让用户能有自己的骚操作。下面才是生成树的核心
    var root = {};
    var group = jc.groupBy(data, function (row) {
      if (row[option.id] == option.root) root = row; // 假如数据中根节点不是虚拟存在的
      return row[option.parent]
    });
    jc.map(data, function (row) {
      // 行的ID相当于分组中的父ID
      var parentId = row[option.id]
      if (group[parentId]) {
        row[option.children] = group[parentId];
      }
    })

    if (jc.isObjEmpty(root)) root[option.children] = group[option.root];
    return root
  }

  /**
  * extend
  * 此段偷懒，大部分引用了jquery的extend，用法和jq一致;
  *
  * @public
  * @param boolean   可选，true为深拷贝，默认浅拷贝
  * @param {object|array} 被覆盖的对象
  * @param {object|array} 需要复制的对象
  * @return {object|array} 被覆盖的对象
  */
  jc.extend = function () {
    var options, name, src, copy, copyIsArray, clone, target = arguments[0] || {},
      i = 1,
      length = arguments.length,
      deep = false;
    if (typeof target === "boolean") {
      deep = target;
      target = arguments[1] || {};
      i++;
    }

    if (typeof target !== "object" && !jc.isFunction(target)) {
      target = {};
    }

    if (length === i) {
      target = this; --i;
    }
    for (; i < length; i++) {
      if ((options = arguments[i]) != null) {
        for (name in options) {
          src = target[name];
          copy = options[name];
          if (target === copy) {
            continue;
          }
          if (deep && copy && (jc.isObject(copy) || (copyIsArray = jc.isArray(copy)))) {
            if (copyIsArray) {
              copyIsArray = false;
              clone = src && jc.isArray(src) ? src : [];
            } else {
              clone = src && jc.isObject(src) ? src : {};
            }
            // 递归
            target[name] = jc.extend(deep, clone, copy);
          } else if (copy !== undefined) {
            target[name] = copy;
          }
        }
      }
    }
    return target;
  };

  /**
  * 去重
  *
  * @public
  * @param {array} data 数据
  */
  jc.unique = function (data) {
    if (!data || data.length == 0) return data;
    var newObj = {}, newArr = [];
    var arr = jc.map(data, function (d) {
      var item = JSON.stringify(d);
      newObj[item] = d;
    });
    jc.forIn(newObj, function (key, row) {
      newArr.push(row);
    });
    return newArr;
  }


  jc.spaceFix = function (data, set) {
    if (!data || data.length == 0) return data;
    var fix = [];
    // 补起点
    if (data[0][set.key] - set.start > 0) {
      var obj = {};
      obj[set.key] = set.start;
      jc.map(set.zeroFill, function (d) {
        obj[d] = 0;
      })
      data.unshift(obj);
    }
    // 补结束点
    if (data[data.length - 1][set.key] < set.end) {
      var obj = {};
      obj[set.key] = set.end;
      jc.map(set.zeroFill, function (d) {
        obj[d] = 0;
      });
      data.push(obj);
    }

    for (var i = 1, j = 0, len = data.length; i < len; i++) {
      if (i > 10000) break;
      var space = data[i][set.key] - data[i - 1][set.key];
      // 补零
      if (space <= set.space) {
        fix.push(data[i])
      } else {
        var t = set.space;
        for (var k = 0, l = space / set.space; k < (l - 1); k++) {
          if (k > 10000) break;
          var obj = {};
          obj[set.key] = parseInt(data[i - 1][set.key]) + parseInt(t);
          jc.map(set.zeroFill, function (d) {
            obj[d] = 0;
          });
          fix.push(obj);
          t += set.space;
        }
        fix.push(data[i]);
      }
    }
    fix.unshift(data[0]);
    return fix;
  }

  /**
  * keyArray
  * json根据键名生成数组，并存于一个对象内
  *
  * @public
  * @param [obj, obj, ...] data 数据
  * @param [keyName, keyName, ...] keyList转数组的键名
  */
  jc.keyArray = function (data, keyList) {
    if (!data || data.length == 0) return data;
    var objList = {}
    jc.map(data, function (d, i) {
      jc.map(keyList, function (e, j) {
        if (!objList[e]) objList[e] = [];
        objList[e].push(d[e]);
      })
    })
    return objList;
  }

  /**
  * keyBreak
  * json根据键名生成数组，并存于一个对象内
  *
  * @public
  * @param [obj, obj, ...] data 数据
  * @param {} option拆分数据配置项
  */
  jc.keyBreak = function (data, option) {
    if (!data || data.length == 0) return data;
    var arr = [];
    var key = option.key;
    var value = option.value;
    jc.map(data, function (d) {
      jc.map(option.break, function (e) {
        var obj = {};
        obj[key] = e;
        obj[value] = d[e];
        jc.map(option.retain, function (f) {
          obj[f] = d[f];
        });
        arr.push(obj);
      });
    })
    return arr;
  };

  /**
  * compare
  * 比较数字大小
  *
  * @private
  * @param num1  数据
  * @param num2  数据
  * @param type  取值类型
  */
  function compare (num1, num2, type) {
    var result;
    if (jc.isNoVal(num1) || jc.isNoVal(num2)) {
      // 存在空值情况下(undefined和null)
      result = jc.isNoVal(num1) ? num2 : num1
    } else {
      type = type == "max" ? (num1 > num2) : (num1 < num2)
      result = type ? num1 : num2
    }
    return result
  };

  /**
  * 最大值
  *
  * @param data 数据
  * @param iteratee 处理逻辑，纯数字数组允许为空
  */
  jc.max = function (data, iteratee) {
    if (!data || data.length == 0) return data;
    var result;
    // 兼容空值
    if (jc.isString(iteratee)) {
      var key = iteratee;
      iteratee = function (row) {
        return row[key]
      };
    } else if (jc.isUndefined(iteratee)) {
      iteratee = function (row) {
        return row
      };
    }
    jc.map(data, function (row) {
      // num1 num2 以防空值出现
      var num1 = result ? iteratee(result) : result;
      var num2 = row ? iteratee(row) : row;
      if (jc.isNoVal(num1) || jc.isNoVal(num2)) {
        // 存在空值情况下(undefined和null)
        result = jc.isNoVal(num1) ? row : result
      } else {
        result = num1 > num2 ? result : row
      }
    })
    return result
  };

  /**
  * 最小值
  *
  * @param data 数据
  * @param iteratee 处理逻辑，纯数字数组允许为空
  */
  jc.min = function (data, iteratee) {
    if (!data || data.length == 0) return data;
    var result;
    if (jc.isString(iteratee)) {
      var key = iteratee;
      iteratee = function (row) {
        return row[key]
      };
    } else if (jc.isUndefined(iteratee)) {
      iteratee = function (row) {
        return row
      };
    }
    jc.map(data, function (row) {
      // num1 num2 以防空值出现
      var num1 = result ? iteratee(result) : result;
      var num2 = row ? iteratee(row) : row;
      if (jc.isNoVal(num1) || jc.isNoVal(num2)) {
        // 存在空值情况下，选择非空，两个都空我就随意了。
        result = jc.isNoVal(num1) ? row : result
      } else {
        result = num1 < num2 ? result : row;
      }
    });
    return result
  };

  /**
  * 分组
  *
  * @public
  * @param {table} val 数据
  * @param {object|array|string} key 分组条件
  */
  jc.group = jc.groupBy = function (val, key) {
    if (!val || val.length == 0) return val;
    var groups = {};
    jc.map(val, function (row, i) {
      var k = [];
      if (jc.isArray(key)) {
        jc.map(key, function (a, i) {
          if (jc.isFunction(a)) {
            k.push(a(row));
          } else {
            k.push(row[a]);
          }
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
    errorCheck(query);
    if (query.from.length == 0 || !jc.isArray(query.from)) return [];
    var table = query.from;
    var whereData, groupData, havingData, selectData, orderData, limitData;
    whereData = sqlWhere(table, query.where);
    groupData = sqlGroup(whereData, query);
    havingData = sqlhaving(groupData, query.having)
    selectData = sqlSelect(havingData, query.select);
    orderData = sqlOrder(selectData, query.orderBy);
    limitData = sqlLimit(orderData, query.limit);
    return limitData;
  }

  function errorCheck (query) {
    if (!query.from) throw new Error("From is not defined", "Error from");
    if (!query.select) throw new Error("Select is not defined", "Error select");
    groupCheck(query);
  }

  // 检查group和col之间的关系是否合理
  function groupCheck (query) {
    var select = query.select, groupBy = query.groupBy;
    if (!(select.sum || select.avg || select.count || select.max || select.min)) return;
    if (select.col && !query.groupBy) return;
    var col = selectType("", select.col);
    col = nativeValues(col);
    var group = [];
    var flag = false;
    if (jc.isArray(groupBy)) {
      jc.map(groupBy, function (a, i) {
        group.push(a);
      })
    } else if (jc.isString(groupBy)) {
      group.push(groupBy)
    } else if (jc.isFunction(groupBy)) {
      group = [groupBy];
    }

    for (var i = 0, len = col.length; i < len; i++) {
      for (var j = 0; j < len; j++) {
        if (col[i] == group[j]) {
          flag = true;
          break;
        } else if (jc.isObject(col[i]) && jc.isObject(group[j])) {
          if (String(col[i]) === String(group[j])) {
            flag = true;
            break;
          }
        }
      }
      if (!flag) {
        throw new Error("groupBy should contain select.col", "Error groupBy");
      } else {
        flag = false;
      }
    }
  }

  function sqlWhere (table, where) {
    if (!where) return table;
    return jc.where(table, where);
  }

  function sqlGroup (table, query) {
    var flag;
    jc.forIn(query.select, function (key, val) {
      val = key == "col" ? false : true;
      flag = !!val || flag;
    })
    // 只有col选项
    if (!query.groupBy && !flag) return table;
    // 没有group和col
    if (!query.groupBy && !query.select.col) return {table: table};
    // 有group
    return jc.group(table, query.groupBy);
  }

  /**
  * having
  *
  * @private
  * @param {table} table 数据
  * @param {object} having 组筛选配置
  */
  function sqlhaving (table, having) {
    if (!having) return table;
    var operation = {
      sumObj: {},
      avgObj: {},
      maxObj: {},
      minObj: {},
      countObj: {}
    };
    var havingData = {};
    jc.forIn(having, function (key, val) {
      var reg = /[1-9a-zA-z_\$\@]+/g;
      var splitKey = key.split("_");
      // 首个_前面部分为聚合运算类型
      var type = splitKey.shift();
      var formula = splitKey.join("_");
      // 根据运算符号拆分出字段，在前后加上对应内容变成row["key"]这样的字符串
      formula = formula.replace(reg, function (match) {
        return "row['" + match + "']";
      });

      switch (type) {
      case "sum":
        operation.sumObj[key] = function (row) {
          return (new Function("row", "return " + formula))(row);
        };
        break;
      case "avg":
        operation.avgObj[key] = function (row) {
          return (new Function("row", "return " + formula))(row);
        };
        break;
      case "max":
        operation.maxObj[key] = function (row) {
          return (new Function("row", "return " + formula))(row);
        };
        break;
      case "min":
        operation.minObj[key] = function (row) {
          return (new Function("row", "return " + formula))(row);
        };
        break;
      case "count":
        operation.countObj[key] = function (row) {
          return (new Function("row", "return " + formula))(row);
        };
        break;
      }
    })
    jc.forIn(table, function (groupKey, groupItem, obj, i) {
      var row = groupCal(groupItem, operation);
      var flag;
      for (var key in having) {
        foo = new Function("return " + row[key] + having[key]);
        flag = foo();
        if (!flag) break;
      }
      if (flag) havingData[groupKey] = groupItem;
    });
    return havingData;
  }

  // select部分代码开始

  /**
  * select的查询计算方式
  * 生成计算键对象
  *
  * @private
  * @param {table} table 数据
  * @param {object} select 查询计算配置
  * @param {object|array|string|undefined} select.col 列查询计算配置
  * @param {object|array|string|undefined} select.sum 列总和查询计算配置
  * @param {object|array|string|undefined} select.avg 列平均数查询计算配置
  * @param {object|array|string|undefined} select.max 列最大值查询计算配置
  * @param {object|array|string|undefined} select.min 列最小值查询计算配置
  * @param {object|array|string|undefined} select.count 列计数查询计算配置
  */
  function sqlSelect (table, select) {
    if (!select) throw new Error("Select is not defined", "Error select");
    var selectData = [];
    var operation = {};
    if (select.col) operation.colObj = selectType("", select.col);
    if (select.sum) operation.sumObj = selectType("sum_", select.sum);
    if (select.avg) operation.avgObj = selectType("avg_", select.avg);
    if (select.max) operation.maxObj = selectType("max_", select.max);
    if (select.min) operation.minObj = selectType("min_", select.min);
    if (select.count) operation.countObj = selectType("count_", select.count);
    if (!jc.isArray(table)) {
      jc.forIn(table, function (groupKey, groupItem, obj, i) {
        var row = groupCal(groupItem, operation);
        selectData.push(row);
      });
    } else {
      jc.map(table, function (groupItem, i) {
        var row = groupCal([groupItem], operation);
        selectData.push(row);
      });
    }
    return selectData;
  }


  /**
  * select的查询计算方式
  * 生成计算键对象
  *
  * @private
  * @param {string} prefix 前缀
  * @param {object|array|string} option 查询计算配置
  */
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

  /**
  * 每个分组计算
  *
  * @private
  * @param {groupItem} groupItem 分组过后的一组数据
  * @param {object} operation 选择列的对象键信息，储存各种操作的信息
  */
  function groupCal (groupItem, operation) {
    var newRow = {};
    var itemLength = groupItem.length, validLength = {};
    jc.map(groupItem, function (row) {
      if (!jc.isObjEmpty(operation.colObj)) {
        jc.forIn(operation.colObj, function (key, val) {
          var rowVal = jc.isFunction(val) ? val(row) : row[val];
          newRow[key] = rowVal;
        })
      }

      if (!jc.isObjEmpty(operation.sumObj)) {
        jc.forIn(operation.sumObj, function (key, val) {
          var rowVal = jc.isFunction(val) ? val(row) : row[val];
          newRow[key] ? newRow[key] += rowVal || 0 : newRow[key] = rowVal || 0;
        })
      }

      if (!jc.isObjEmpty(operation.avgObj)) {
        jc.forIn(operation.avgObj, function (key, val) {
          if (!validLength[key]) validLength[key] = 0;
          var rowVal = jc.isFunction(val) ? val(row) : row[val];
          newRow[key] ? newRow[key] += rowVal || 0 : newRow[key] = rowVal || 0;
          if (rowVal || rowVal == 0) validLength[key]++;
        })
      }

      if (!jc.isObjEmpty(operation.maxObj)) {
        jc.forIn(operation.maxObj, function (key, val) {
          var rowVal = jc.isFunction(val) ? val(row) : row[val];
          newRow[key] = compare(newRow[key], rowVal, "max");
        })
      }

      if (!jc.isObjEmpty(operation.minObj)) {
        jc.forIn(operation.minObj, function (key, val) {
          var rowVal = jc.isFunction(val) ? val(row) : row[val];
          newRow[key] = compare(newRow[key], rowVal, "min");
        })
      }

      if (!jc.isObjEmpty(operation.countObj)) {
        jc.forIn(operation.countObj, function (key, val) {
          var rowVal = jc.isFunction(val) ? val(row) : row[val];
          if (jc.isUndefined(newRow[key])) newRow[key] = 0;
          switch (key) {
          case val == "*" ? key : "count_*":
            newRow[key] = itemLength;
            break;
          default :
            if (!jc.isUndefined(rowVal) && rowVal != null) {
              newRow[key]++
            }
          }
        })
      }
    })

    jc.forIn(operation.avgObj, function (key, val) {
      newRow[key] = newRow[key] / validLength[key];
    })
    return newRow;
  }
  // select部分代码结束



  /**
  * 排序
  *
  * @private
  * @param {array} table 数据
  * @param {object|function} order 排序配置
  ***/
  function sqlOrder (table, order) {
    if (!order) return table;
    if (jc.isObject(order) && !jc.isFunction(order)) {
      var keys = nativeKeys(order);
      var vals = nativeValues(order);
      table.sort(function (left, right) {
        var len = keys.length, key, val;
        for (var i = 0; i < len; i++) {
          key = keys[i];
          val = vals[i];
          if (left[key] !== right[key]) break;
        }
        if (left[key] !== right[key]) {
          if (left[key] > right[key] || right[key] === void 0) return val === "desc" || val === "DESC" ? -1 : 1;
          if (left[key] < right[key] || left[key] === void 0) return val === "desc" || val === "DESC" ? 1 : -1;
        }
        return val === "desc" || val === "DESC" ? right[key] - left[key] : left[key] - right[key];
      })
    } else if (jc.isFunction(order)) {
      table.sort(order)
    }
    return table;
  }
  // orderBy 部分代码结束

  /**
  * 检索记录行
  *
  * @private
  * @param {array} table 数据
  * @param {number|array} limit 检索行
  */
  function sqlLimit (table, limit) {
    if (!limit && limit != 0) return table;
    var limitData = [];
    var len = table.length;
    var i = 0;
    if (jc.isNumber(limit)) {
      len = limit > len ? len : limit;
    } else if (jc.isArray(limit)) {
      if (limit[0] > len) {
        return [];
      } else if (limit[0] < len) {
        i = limit[0];
      }
      len = limit[0] + limit[1] < len ? limit[0] + limit[1] : len;
    }
    for (; i < len; i++) {
      limitData.push(table[i]);
    }
    return limitData;
  }

  // 类型判断

  // 空对象
  jc.isObjEmpty = function (obj) {
    for (var name in obj) {
      return false;
    }
    return true;
  };

  // 值是undefined, NaN或者null
  jc.isNoVal = function (val) {
    return jc.isUndefined(val) || val == null || val != val
  };

  // 类型判断, 偷懒引用了underscore的代码.
  jc.isArray = nativeIsArray || function (val) {
    return toString.call(val) === '[object Array]';
  };

  jc.isObject = function (val) {
    var type = typeof val;
    return type === 'object' && !jc.isArray(val) && !!val;
  };

  jc.map(['Arguments', 'Function', 'String', 'Number', 'Date', 'RegExp', 'Error', 'Symbol', 'Map', 'WeakMap', 'Set', 'WeakSet'], function (name) {
    jc['is' + name] = function (val) {
      return toString.call(val) === '[object ' + name + ']';
    };
  });

  // 判断undefined
  jc.isUndefined = function (val) {
    return val === void 0;
  };

  // 对AMD支持的一些处理
  if (typeof define == 'function' && define.amd) {
    define('jc', [], function () {
      return jc;
    });
  }
}());