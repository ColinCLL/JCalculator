var jc = require("../JCalculator");
var should = require("should");
describe("test tree", function () {
  it("test jc.treeDic", function () {
    var json = [{ "id": 1, "pid": 0, "name": "china", "children": [{ "id": 2, "pid": 1, "name": "guangdong", "children": [{ "id": 3, "pid": 2, "name": "shenzhen" }, { "id": 4, "pid": 2, "name": "guangzhou" }] }] }, { "id": 5, "pid": 0, "name": "USA", "children": [{ "id": 6, "pid": 5, "name": "AK" }] }];
    var data = jc.treeDic(json);
    data.should.deepEqual({
      "1": {
        "id": 1,
        "pid": 0,
        "name": "china",
        "children": [
          {
            "id": 2,
            "pid": 1,
            "name": "guangdong",
            "children": [
              {
                "id": 3,
                "pid": 2,
                "name": "shenzhen"
              },
              {
                "id": 4,
                "pid": 2,
                "name": "guangzhou"
              }
            ]
          }
        ]
      },
      "2": {
        "id": 2,
        "pid": 1,
        "name": "guangdong",
        "children": [
          {
            "id": 3,
            "pid": 2,
            "name": "shenzhen"
          },
          {
            "id": 4,
            "pid": 2,
            "name": "guangzhou"
          }
        ]
      },
      "3": {
        "id": 3,
        "pid": 2,
        "name": "shenzhen"
      },
      "4": {
        "id": 4,
        "pid": 2,
        "name": "guangzhou"
      },
      "5": {
        "id": 5,
        "pid": 0,
        "name": "USA",
        "children": [
          {
            "id": 6,
            "pid": 5,
            "name": "AK"
          }
        ]
      },
      "6": {
        "id": 6,
        "pid": 5,
        "name": "AK"
      }
    });
  });

  it("test jc.treeDic, root is Object", function () {
    var json = {
      "id": 1,
      "pid": 0,
      "name": "china",
      "children": [
        {
          "id": 2,
          "pid": 1,
          "name": "guangdong",
          "children": [
            {
              "id": 3,
              "pid": 2,
              "name": "shenzhen"
            },
            {
              "id": 4,
              "pid": 2,
              "name": "guangzhou"
            }
          ]
        }
      ]
    }
    var data = jc.treeDic(json);
    data.should.deepEqual({
      "1": {
        "id": 1,
        "pid": 0,
        "name": "china",
        "children": [
          {
            "id": 2,
            "pid": 1,
            "name": "guangdong",
            "children": [
              {
                "id": 3,
                "pid": 2,
                "name": "shenzhen"
              },
              {
                "id": 4,
                "pid": 2,
                "name": "guangzhou"
              }
            ]
          }
        ]
      },
      "2": {
        "id": 2,
        "pid": 1,
        "name": "guangdong",
        "children": [
          {
            "id": 3,
            "pid": 2,
            "name": "shenzhen"
          },
          {
            "id": 4,
            "pid": 2,
            "name": "guangzhou"
          }
        ]
      },
      "3": {
        "id": 3,
        "pid": 2,
        "name": "shenzhen"
      },
      "4": {
        "id": 4,
        "pid": 2,
        "name": "guangzhou"
      }
    });
  });

  it("test jc.tree", function () {
    var table = [
      { id: 1, pid: 0, name: "china" },
      { id: 2, pid: 1, name: "guangdong" },
      { id: 3, pid: 2, name: "shenzhen" },
      { id: 4, pid: 2, name: "guangzhou" },
      { id: 5, pid: 0, name: "USA" },
      { id: 6, pid: 5, name: "AK" }
    ];
    var data = jc.tree(table, {
      root: 0,
      id: "id",
      parent: "pid",
      children: "children"
    });
    data.should.deepEqual({ "children": [{ "id": 1, "pid": 0, "name": "china", "children": [{ "id": 2, "pid": 1, "name": "guangdong", "children": [{ "id": 3, "pid": 2, "name": "shenzhen" }, { "id": 4, "pid": 2, "name": "guangzhou" }] }] }, { "id": 5, "pid": 0, "name": "USA", "children": [{ "id": 6, "pid": 5, "name": "AK" }] }] });
  });

  it("test jc.tree, without enter children", function () {
    var table = [
      { id: 1, pid: 0, name: "china" },
      { id: 2, pid: 1, name: "guangdong" },
      { id: 3, pid: 2, name: "shenzhen" },
      { id: 4, pid: 2, name: "guangzhou" },
      { id: 5, pid: 0, name: "USA" },
      { id: 6, pid: 5, name: "AK" }
    ];
    var data = jc.tree(table, {
      root: 0,
      id: "id",
      parent: "pid"
    });
    data.should.deepEqual({ "children": [{ "id": 1, "pid": 0, "name": "china", "children": [{ "id": 2, "pid": 1, "name": "guangdong", "children": [{ "id": 3, "pid": 2, "name": "shenzhen" }, { "id": 4, "pid": 2, "name": "guangzhou" }] }] }, { "id": 5, "pid": 0, "name": "USA", "children": [{ "id": 6, "pid": 5, "name": "AK" }] }] });
  });

  it("test jc.tree, retain is string", function () {
    var table = [
      { id: 1, pid: 0, name: "china", value: 1231 },
      { id: 2, pid: 1, name: "guangdong", value: 4321 },
      { id: 3, pid: 2, name: "shenzhen", value: 461 },
      { id: 4, pid: 2, name: "guangzhou", value: 512 },
      { id: 5, pid: 0, name: "USA", value: 911 },
      { id: 6, pid: 5, name: "AK", value: 654 }
    ];
    var data = jc.tree(table, {
      root: 0,
      id: "id",
      parent: "pid",
      retain: "name"
    });
    data.should.deepEqual({ "children": [{ "id": 1, "pid": 0, "name": "china", "children": [{ "id": 2, "pid": 1, "name": "guangdong", "children": [{ "id": 3, "pid": 2, "name": "shenzhen" }, { "id": 4, "pid": 2, "name": "guangzhou" }] }] }, { "id": 5, "pid": 0, "name": "USA", "children": [{ "id": 6, "pid": 5, "name": "AK" }] }] });
  });

  it("test jc.tree, retain is array", function () {
    var table = [
      { id: 1, pid: 0, name: "china", value: 1231 },
      { id: 2, pid: 1, name: "guangdong", value: 4321 },
      { id: 3, pid: 2, name: "shenzhen", value: 461 },
      { id: 4, pid: 2, name: "guangzhou", value: 512 },
      { id: 5, pid: 0, name: "USA", value: 911 },
      { id: 6, pid: 5, name: "AK", value: 654 }
    ];
    var data = jc.tree(table, {
      root: 0,
      id: "id",
      parent: "pid",
      retain: ["name", "value"]
    });
    data.should.deepEqual({
      "children": [
        {
          "id": 1,
          "pid": 0,
          "name": "china",
          "value": 1231,
          "children": [
            {
              "id": 2,
              "pid": 1,
              "name": "guangdong",
              "value": 4321,
              "children": [
                {
                  "id": 3,
                  "pid": 2,
                  "name": "shenzhen",
                  "value": 461
                },
                {
                  "id": 4,
                  "pid": 2,
                  "name": "guangzhou",
                  "value": 512
                }
              ]
            }
          ]
        },
        {
          "id": 5,
          "pid": 0,
          "name": "USA",
          "value": 911,
          "children": [
            {
              "id": 6,
              "pid": 5,
              "name": "AK",
              "value": 654
            }
          ]
        }
      ]
    });
  });

  it("test jc.tree, has root row", function () {
    var table = [
      { id: 0, pid: null, name: "world", value: 1231 },
      { id: 1, pid: 0, name: "china", value: 1231 },
      { id: 2, pid: 1, name: "guangdong", value: 4321 },
      { id: 3, pid: 2, name: "shenzhen", value: 461 },
      { id: 4, pid: 2, name: "guangzhou", value: 512 },
      { id: 5, pid: 0, name: "USA", value: 911 },
      { id: 6, pid: 5, name: "AK", value: 654 }
    ];
    var data = jc.tree(table, {
      root: 0,
      id: "id",
      parent: "pid",
      retain: {
        palce: "name",
        value: function (row) {
          return "$" + row.value
        }
      }
    });
    data.should.deepEqual({
      "palce": "world",
      "value": "$1231",
      "id": 0,
      "pid": null,
      "children": [
        {
          "palce": "china",
          "value": "$1231",
          "id": 1,
          "pid": 0,
          "children": [
            {
              "palce": "guangdong",
              "value": "$4321",
              "id": 2,
              "pid": 1,
              "children": [
                {
                  "palce": "shenzhen",
                  "value": "$461",
                  "id": 3,
                  "pid": 2
                },
                {
                  "palce": "guangzhou",
                  "value": "$512",
                  "id": 4,
                  "pid": 2
                }
              ]
            }
          ]
        },
        {
          "palce": "USA",
          "value": "$911",
          "id": 5,
          "pid": 0,
          "children": [
            {
              "palce": "AK",
              "value": "$654",
              "id": 6,
              "pid": 5
            }
          ]
        }
      ]
    });
  });

  it("test jc.tree, retain is object", function () {
    var table = [
      { id: 1, pid: 0, name: "china", value: 1231 },
      { id: 2, pid: 1, name: "guangdong", value: 4321 },
      { id: 3, pid: 2, name: "shenzhen", value: 461 },
      { id: 4, pid: 2, name: "guangzhou", value: 512 },
      { id: 5, pid: 0, name: "USA", value: 911 },
      { id: 6, pid: 5, name: "AK", value: 654 }
    ];
    var data = jc.tree(table, {
      root: 0,
      id: "id",
      parent: "pid",
      retain: {
        palce: "name",
        value: function (row) {
          return "$" + row.value
        }
      }
    });
    data.should.deepEqual({
      "children": [
        {
          "id": 1,
          "pid": 0,
          "palce": "china",
          "value": "$1231",
          "children": [
            {
              "id": 2,
              "pid": 1,
              "palce": "guangdong",
              "value": "$4321",
              "children": [
                {
                  "id": 3,
                  "pid": 2,
                  "palce": "shenzhen",
                  "value": "$461"
                },
                {
                  "id": 4,
                  "pid": 2,
                  "palce": "guangzhou",
                  "value": "$512"
                }
              ]
            }
          ]
        },
        {
          "id": 5,
          "pid": 0,
          "palce": "USA",
          "value": "$911",
          "children": [
            {
              "id": 6,
              "pid": 5,
              "palce": "AK",
              "value": "$654"
            }
          ]
        }
      ]
    });
  });

  it("test jc.tree, dont change table", function () {
    var table = [
      { id: 1, pid: 0, name: "china" },
      { id: 2, pid: 1, name: "guangdong" },
      { id: 3, pid: 2, name: "shenzhen" },
      { id: 4, pid: 2, name: "guangzhou" },
      { id: 5, pid: 0, name: "USA" },
      { id: 6, pid: 5, name: "AK" }
    ];
    var data = jc.tree(table, {
      root: 0,
      id: "id",
      parent: "pid",
      children: "children"
    });
    table.should.deepEqual([
      { id: 1, pid: 0, name: "china" },
      { id: 2, pid: 1, name: "guangdong" },
      { id: 3, pid: 2, name: "shenzhen" },
      { id: 4, pid: 2, name: "guangzhou" },
      { id: 5, pid: 0, name: "USA" },
      { id: 6, pid: 5, name: "AK" }
    ]);
  });

  it("test jc.treeFilter", function () {
    var json = [{ "id": 1, "pid": 0, "name": "china", "children": [{ "id": 2, "pid": 1, "name": "guangdong", "children": [{ "id": 3, "pid": 2, "name": "shenzhen" }, { "id": 4, "pid": 2, "name": "guangzhou" }] }] }, { "id": 5, "pid": 0, "name": "USA", "children": [{ "id": 6, "pid": 5, "name": "AK" }] }];
    var data = jc.treeFilter(json, {
      filter (row) {
        return parseInt(row.id) < 3
      }
    });
    data.should.deepEqual({
      "children": [{
        "id": 1,
        "pid": 0,
        "name": "china",
        "children": [
          {
            "id": 2,
            "pid": 1,
            "name": "guangdong",
            "children": [
              {
                "id": 3,
                "pid": 2,
                "name": "shenzhen"
              },
              {
                "id": 4,
                "pid": 2,
                "name": "guangzhou"
              }
            ]
          }
        ]
      }]
    });
  });

  it("test jc.treeMap, root is array", function () {
    var json = [{ "id": 1, "pid": 0, "name": "china", "children": [{ "id": 2, "pid": 1, "name": "guangdong", "children": [{ "id": 3, "pid": 2, "name": "shenzhen" }, { "id": 4, "pid": 2, "name": "guangzhou" }] }] }];
    var data = jc.treeMap(json, {
      map(row) {
        row.test = "test"
        return row
      }
    });
    data.should.deepEqual([{
      "id": 1,
      "pid": 0,
      "name": "china",
      "test": "test",
      "children": [
        {
          "id": 2,
          "pid": 1,
          "name": "guangdong",
          "test": "test",
          "children": [
            {
              "id": 3,
              "pid": 2,
              "name": "shenzhen",
              "test": "test",
            },
            {
              "id": 4,
              "pid": 2,
              "name": "guangzhou",
              "test": "test",
            }
          ]
        }
      ]
    }]);
  });

  it("test jc.treeMap, root is object", function () {
    var json = {
      "id": 1,
      "pid": 0,
      "name": "china",
      "children": [
        {
          "id": 2,
          "pid": 1,
          "name": "guangdong",
          "children": [
            {
              "id": 3,
              "pid": 2,
              "name": "shenzhen"
            },
            {
              "id": 4,
              "pid": 2,
              "name": "guangzhou"
            }
          ]
        }
      ]
    };
    var data = jc.treeMap(json, {
      map(row) {
        row.test = "test"
        return row
      }
    });
    data.should.deepEqual({
      "id": 1,
      "pid": 0,
      "name": "china",
      "test": "test",
      "children": [
        {
          "id": 2,
          "pid": 1,
          "name": "guangdong",
          "test": "test",
          "children": [
            {
              "id": 3,
              "pid": 2,
              "name": "shenzhen",
              "test": "test",
            },
            {
              "id": 4,
              "pid": 2,
              "name": "guangzhou",
              "test": "test",
            }
          ]
        }
      ]
    });
  });

  it("test jc.treeSearch, root is object and search is object", function () {
    var json = {
      "id": 1,
      "pid": 0,
      "name": "china",
      "children": [
        {
          "id": 2,
          "pid": 1,
          "name": "guangdong",
          "children": [
            {
              "id": 3,
              "pid": 2,
              "name": "shenzhen"
            },
            {
              "id": 4,
              "pid": 2,
              "name": "guangzhou"
            }
          ]
        }
      ]
    };
    var data = jc.treeSearch(json, {
      search: {id: 4},
    });
    data.should.deepEqual([{
      "id": 4,
      "pid": 2,
      "name": "guangzhou"
    }]);
  });

  it("test jc.treeSearch, search is function", function () {
    var json = [{
      "id": 1,
      "pid": 0,
      "name": "china",
      "children": [
        {
          "id": 2,
          "pid": 1,
          "name": "guangdong",
          "children": [
            {
              "id": 3,
              "pid": 2,
              "name": "shenzhen"
            },
            {
              "id": 4,
              "pid": 2,
              "name": "guangzhou"
            }
          ]
        }
      ]
    }];
    var data = jc.treeSearch(json, {
      search: function (row) {
        return row.id >= 2
      }
    });
    data.should.deepEqual([{
      "id": 2,
      "pid": 1,
      "name": "guangdong",
      "children": [
        {
          "id": 3,
          "pid": 2,
          "name": "shenzhen"
        },
        {
          "id": 4,
          "pid": 2,
          "name": "guangzhou"
        }
      ]},
      {
        "id": 3,
        "pid": 2,
        "name": "shenzhen"
      },
      {
        "id": 4,
        "pid": 2,
        "name": "guangzhou"
      }]);
  });

  it("test jc.treePath", function () {
    var json = [{
      "id": 1,
      "pid": 0,
      "name": "china",
      "children": [
        {
          "id": 2,
          "pid": 1,
          "name": "guangdong",
          "children": [
            {
              "id": 3,
              "pid": 2,
              "name": "shenzhen"
            },
            {
              "id": 4,
              "pid": 2,
              "name": "guangzhou"
            }
          ]
        }
      ]
    }];
    var data = jc.treePath(json, {
      path: 4
    });
    data.should.deepEqual([
    {
      "id": 1,
      "pid": 0,
      "name": "china",
      "children": [
        {
          "id": 2,
          "pid": 1,
          "name": "guangdong",
          "children": [
            {
              "id": 3,
              "pid": 2,
              "name": "shenzhen"
            },
            {
              "id": 4,
              "pid": 2,
              "name": "guangzhou"
            }
          ]
        }
      ]
    },
    {
      "id": 2,
      "pid": 1,
      "name": "guangdong",
      "children": [
        {
          "id": 3,
          "pid": 2,
          "name": "shenzhen"
        },
        {
          "id": 4,
          "pid": 2,
          "name": "guangzhou"
        }
      ]
    },
    {
      "id": 4,
      "pid": 2,
      "name": "guangzhou"
    }
  ]);
  });


})