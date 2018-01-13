var jc = require("../JCalculator");
var should = require("should");

var table = [
    { time: "10月1日", inPerson: 20, outPerson: 1000, region: "广州", fly: 12 },
    { time: "10月1日", inPerson: 13, outPerson: 900, region: "深圳", fly: 2 },
    { time: "10月2日", inPerson: 15, outPerson: 900, region: "广州", fly: null },
    { time: "10月2日", inPerson: 15, outPerson: 1000, region: "深圳", fly: 0 },
    { time: "10月3日", inPerson: 15, outPerson: 100, region: "广州" },
    { time: "10月3日", inPerson: 15, outPerson: 100, region: "深圳" },
    { time: "10月4日", inPerson: 90, outPerson: 60, region: "广州" },
    { time: "10月4日", inPerson: 70, outPerson: 50, region: "深圳" },
    { time: "10月5日", inPerson: 500, outPerson: 39, region: "广州" },
    { time: "10月5日", inPerson: 350, outPerson: 30, region: "深圳" },
    { time: "10月6日", inPerson: 900, outPerson: 15, region: "广州" },
    { time: "10月6日", inPerson: 1000, outPerson: 15, region: "深圳" },
    { time: "10月7日", inPerson: 900, outPerson: 10, region: "广州" },
    { time: "10月7日", inPerson: 1200, outPerson: 7, region: "深圳" }
]

describe("test/JCalculator.test.js", function () {
    it("test count obj type", function () {
        var data = jc.sql({
            select: {
                count:{
                    fly:"fly",
                    all:"*",
                    in: function (row) {
                       return row.inPerson
                    }
                }
            },
            from: table
        });
        data.should.deepEqual([{ "fly": 3,"all": 14, in: 14 }]);
    });

    it("test count array type", function () {
        var data = jc.sql({
            select: {
                count: ["fly", "*", "time"]
            },
            from: table
        });
    data.should.deepEqual([{ "count_fly": 3, "count_*": 14, "count_time": 14 }]);
    });

    it("test sum obj type", function () {
        var data = jc.sql({
            select: {
                sum: {
                    fly: "fly",
                    in: function (row) {
                        return row.inPerson
                    }
                }
            },
            from: table
        });
        var inSum=0;
        for (var i=0, len=table.length; i<len; i++) {
            inSum += table[i].inPerson || 0;
        }
        data.should.deepEqual([{ "fly": 14, in: inSum }]);
    });

    it("test sum array type", function () {
        var data = jc.sql({
            select: {
                sum: ["fly", "inPerson"]
            },
            from: table
        });
        var inSum = 0;
        for (var i = 0, len = table.length; i < len; i++) {
            inSum += table[i].inPerson || 0;
        }
        data.should.deepEqual([{ "sum_fly": 14, "sum_inPerson": inSum }]);
    });


    it("test avg obj type", function () {
        var data = jc.sql({
            select: {
                avg: {
                    fly: "fly",
                    in: function (row) {
                        return row.inPerson
                    }
                }
            },
            from: table
        });
        var inSum = 0;
        for (var i = 0, len = table.length; i < len; i++) {
            inSum += table[i].inPerson || 0;
        }
        data.should.deepEqual([{ "fly": 14/3, in: inSum / table.length }]);
    });

    it("test avg array type", function () {
        var data = jc.sql({
            select: {
                avg: ["fly", "inPerson"]
            },
            from: table
        });
        var inSum = 0;
        for (var i = 0, len = table.length; i < len; i++) {
            inSum += table[i].inPerson || 0;
        }
        data.should.deepEqual([{ "avg_fly": 14/3, "avg_inPerson": inSum / table.length }]);
    });

    it("test max obj type", function () {
        var data = jc.sql({
            select: {
                max: {
                    fly: "fly",
                    in: function (row) {
                        return row.inPerson
                    }
                }
            },
            from: table
        });
        data.should.deepEqual([{ "fly": 12, in: 1200 }]);
    });

    it("test max array type", function () {
        var data = jc.sql({
            select: {
                max: ["fly", "inPerson"]
            },
            from: table
        });
        data.should.deepEqual([{ "max_fly": 12, "max_inPerson": 1200 }]);
    });

    it("test min obj type", function () {
        var data = jc.sql({
            select: {
                min: {
                    fly: "fly",
                    in: function (row) {
                        return row.inPerson
                    }
                }
            },
            from: table
        });
        data.should.deepEqual([{ "fly": 0, in: 13 }]);
    });

    it("test min array type", function () {
        var data = jc.sql({
            select: {
                min: ["fly", "inPerson"]
            },
            from: table
        });
        data.should.deepEqual([{ "min_fly": 0, "min_inPerson": 13 }]);
    });

    it("test col obj type", function () {
        var data = jc.sql({
            select: {
                col: {
                    fly:"fly",
                    region: function (row) {
                        return row.region
                    }
                }
            },
            from: table
        });

        var json = [
        { region: "广州", fly: 12 },
        { region: "深圳", fly: 2 },
        { region: "广州", fly: null },
        { region: "深圳", fly: 0 },
        { region: "广州", fly: undefined},
        { region: "深圳", fly: undefined},
        { region: "广州", fly: undefined},
        { region: "深圳", fly: undefined},
        { region: "广州", fly: undefined},
        { region: "深圳", fly: undefined},
        { region: "广州", fly: undefined},
        { region: "深圳", fly: undefined},
        { region: "广州", fly: undefined},
        { region: "深圳", fly: undefined}
    ]
        data.should.deepEqual(json);
    });

    it("test col array type", function () {
        var data = jc.sql({
            select: {
                col: ["fly", "region"]
            },
            from: table
        });

        var json = [
            { region: "广州", fly: 12 },
            { region: "深圳", fly: 2 },
            { region: "广州", fly: null },
            { region: "深圳", fly: 0 },
            { region: "广州", fly: undefined },
            { region: "深圳", fly: undefined },
            { region: "广州", fly: undefined },
            { region: "深圳", fly: undefined },
            { region: "广州", fly: undefined },
            { region: "深圳", fly: undefined },
            { region: "广州", fly: undefined },
            { region: "深圳", fly: undefined },
            { region: "广州", fly: undefined },
            { region: "深圳", fly: undefined }
        ]
        data.should.deepEqual(json);
    });

    it("test select string type and group string", function () {
        var data = jc.sql({
            select: {
                col: "time",
                sum: "inPerson",
                avg: "outPerson",
                max: "fly",
                min: "fly",
                count: "fly",
            },
            from: table,
            groupBy:"time"
        });

        var json = [
            { time: "10月1日", sum_inPerson: 33, avg_outPerson: 950, count_fly: 2, max_fly: 12, min_fly: 2},
            { time: "10月2日", sum_inPerson: 30, avg_outPerson: 950, count_fly: 1, max_fly: 0, min_fly: 0},
            { time: "10月3日", sum_inPerson: 30, avg_outPerson: 100, count_fly: 0, max_fly: undefined, min_fly: undefined},
            { time: "10月4日", sum_inPerson: 160, avg_outPerson: 55, count_fly: 0, max_fly: undefined, min_fly: undefined},
            { time: "10月5日", sum_inPerson: 850, avg_outPerson: 34.5, count_fly: 0, max_fly: undefined, min_fly: undefined},
            { time: "10月6日", sum_inPerson: 1900, avg_outPerson: 15, count_fly: 0, max_fly: undefined, min_fly: undefined},
            { time: "10月7日", sum_inPerson: 2100, avg_outPerson: 8.5, count_fly: 0, max_fly: undefined, min_fly: undefined}
        ]
        data.should.deepEqual(json);
    });

    it("test group function string", function () {
        var data = jc.sql({
            select: {
                sum: "inPerson",
            },
            from: table,
            groupBy: function (row) {
                return row.time
            }
        });
        var json = [
            { sum_inPerson: 33 },
            { sum_inPerson: 30 },
            { sum_inPerson: 30 },
            { sum_inPerson: 160 },
            { sum_inPerson: 850 },
            { sum_inPerson: 1900 },
            { sum_inPerson: 2100 }
        ]
        data.should.deepEqual(json);
    });

    it("test group array include string", function () {
        var data = jc.sql({
            select: {
                col: "time",
                sum: "inPerson",
            },
            from: table,
            groupBy: ["time"]
        });
        var json = [
            { time: '10月1日', sum_inPerson: 33 },
            { time: '10月2日', sum_inPerson: 30 },
            { time: '10月3日', sum_inPerson: 30 },
            { time: '10月4日', sum_inPerson: 160 },
            { time: '10月5日', sum_inPerson: 850 },
            { time: '10月6日', sum_inPerson: 1900 },
            { time: '10月7日', sum_inPerson: 2100 }
        ]
        data.should.deepEqual(json);
    });


    it("test group array include function", function () {
        var data = jc.sql({
            select: {
                sum: "inPerson",
            },
            from: table,
            groupBy: [function (row) {
                return row.time
            }]
        });
        var json = [
            { sum_inPerson: 33 },
            { sum_inPerson: 30 },
            { sum_inPerson: 30 },
            { sum_inPerson: 160 },
            { sum_inPerson: 850 },
            { sum_inPerson: 1900 },
            { sum_inPerson: 2100 }
        ]
        data.should.deepEqual(json);
    });
    it("test where obj type", function () {
        var data = jc.sql({
            select: {
                col: ["time", "inPerson"],
            },
            from: table,
            where: {time: "10月1日"}
        });

        var json = [
            { time: "10月1日", inPerson: 20},
            { time: "10月1日", inPerson: 13}
        ]
        data.should.deepEqual(json);
    });

    it("test where function type", function () {
        var data = jc.sql({
            select: {
                col: ["time", "inPerson"],
            },
            from: table,
            where: function (row) {
                return row.time == "10月1日" && row.inPerson < 15
            }
        });

        var json = [
            { time: "10月1日", inPerson: 13 }
        ]
        data.should.deepEqual(json);
    });

    it("test having sum", function () {
        var data = jc.sql({
            select: {
                col: ["time"],
                sum:{
                    in: "inPerson"
                }
            },
            from: table,
            groupBy: "time",
            having: { "sum_inPerson+outPerson": ">1000"}
        });
        var json = [
            { time: "10月1日", in: 33 },
            { time: "10月2日", in: 30 },
            { time: "10月6日", in: 1900 },
            { time: "10月7日", in: 2100 }
        ];
        data.should.deepEqual(json);
    });

    it("test having count", function () {
        var data = jc.sql({
            select: {
                col: ["time"],
                sum: {
                    in: "inPerson"
                }
            },
            from: table,
            groupBy: "time",
            having: { "count_fly": ">= 2" }
        });
        var json = [
            { time: "10月1日", in: 33 }
        ];
        data.should.deepEqual(json);
    });

    it("test having max", function () {
        var data = jc.sql({
            select: {
                col: ["time"],
                sum: {
                    in: "inPerson"
                }
            },
            from: table,
            groupBy: "time",
            having: { "max_fly": ">= 2" }
        });
        var json = [
            { time: "10月1日", in: 33 }
        ];
        data.should.deepEqual(json);
    });

    it("test having min", function () {
        var data = jc.sql({
            select: {
                col: ["time"],
                sum: {
                    in: "inPerson"
                }
            },
            from: table,
            groupBy: "time",
            having: { "min_fly": "== 2" }
        });
        var json = [
            { time: "10月1日", in: 33 }
        ];
        data.should.deepEqual(json);
    });

    it("test having avg", function () {
        var data = jc.sql({
            select: {
                col: ["time"],
                sum: {
                    in: "inPerson"
                }
            },
            from: table,
            groupBy: "time",
            having: { "avg_fly": "== 7" }
        });
        var json = [
            { time: "10月1日", in: 33 }
        ];
        data.should.deepEqual(json);
    });

    it("test orderBy ASC", function () {
        var data = jc.sql({
            select: {
                col: ["inPerson"],
            },
            from: table,
            orderBy:{ inPerson: "ASC" }
        });

        var json = [
            { inPerson: 13 },
            { inPerson: 15 },
            { inPerson: 15 },
            { inPerson: 15 },
            { inPerson: 15 },
            { inPerson: 20 },
            { inPerson: 70 },
            { inPerson: 90 },
            { inPerson: 350 },
            { inPerson: 500 },
            { inPerson: 900 },
            { inPerson: 900 },
            { inPerson: 1000 },
            { inPerson: 1200 }
        ]
        data.should.deepEqual(json);
    });

    
    it("test orderBy desc", function () {
        var data = jc.sql({
            select: {
                col: ["inPerson"],
            },
            from: table,
            orderBy: { inPerson: "desc" }
        });

        var json = [
            { inPerson: 1200 },
            { inPerson: 1000 },
            { inPerson: 900 },
            { inPerson: 900 },
            { inPerson: 500 },
            { inPerson: 350 },
            { inPerson: 90 },
            { inPerson: 70 },
            { inPerson: 20 },
            { inPerson: 15 },
            { inPerson: 15 },
            { inPerson: 15 },
            { inPerson: 15 },
            { inPerson: 13 }
        ]
        data.should.deepEqual(json);
    });

    it("test orderBy function type", function () {
        var data = jc.sql({
            select: {
                col: ["inPerson"],
            },
            from: table,
            orderBy: function (left, right) {
                return right.inPerson - left.inPerson
            }
        });

        var json = [
            { inPerson: 1200 },
            { inPerson: 1000 },
            { inPerson: 900 },
            { inPerson: 900 },
            { inPerson: 500 },
            { inPerson: 350 },
            { inPerson: 90 },
            { inPerson: 70 },
            { inPerson: 20 },
            { inPerson: 15 },
            { inPerson: 15 },
            { inPerson: 15 },
            { inPerson: 15 },
            { inPerson: 13 }
        ]
        data.should.deepEqual(json);
    });
    
    it("test limit number type", function () {
        var data = jc.sql({
            select: {
                col: ["time", "inPerson"],
            },
            from: table,
            limit: 2

        });

        var json = [
            { time: "10月1日", inPerson: 20 },
            { time: "10月1日", inPerson: 13 }
        ]
        data.should.deepEqual(json);
    });

    it("test limit number > table.length type", function () {
        var data = jc.sql({
            select: {
                col: ["time", "inPerson"],
            },
            from: table,
            limit: 20
        });
        data.length.should.deepEqual(14);
    });

    it("test limit array type", function () {
        var data = jc.sql({
            select: {
                col: ["time", "inPerson"],
            },
            from: table,
            limit: [1,2]

        });

        var json = [
            { time: "10月1日", inPerson: 13},
            { time: "10月2日", inPerson: 15}
        ]
        data.should.deepEqual(json);
    });

    it("test limit array type, data.length between limit[0] and limit[1]", function () {
        var data = jc.sql({
            select: {
                col: ["time", "inPerson"],
            },
            from: table,
            limit: [12, 3]

        });

        var json = [
            { time: "10月7日", inPerson: 900},
            { time: "10月7日", inPerson: 1200}
        ]
        data.should.deepEqual(json);
    });
    it("test limit over", function () {
        var data = jc.sql({
            select: {
                col: ["time", "inPerson"],
            },
            from: table,
            limit: [15,20]

        });
        data.should.deepEqual([]);
    });

    it("test miss from", function () {
        (function () {
            jc.sql({
                select: {
                    col: ["time", "inPerson"],
                }
            })
        }).should.throw("From is not defined");
    });

    it("test error groupBy", function () {
        (function () {
            var data = jc.sql({
                select: {
                    col:["outPerson"],
                    sum: ["inPerson"],
                },
                from: table,
                groupBy:"fly"
            })
        }).should.throw("groupBy should contain select.col");
    });

    it("test miss select", function () {
        (function () {
            var data = jc.sql({
                from: table,
                groupBy: "fly"
            })
        }).should.throw("Select is not defined");
    });

    it("test keyArray", function () {
        var data = jc.keyArray(table, ["time", "region"]);
        data.should.deepEqual({
            time: ["10月1日", "10月1日", "10月2日", "10月2日", "10月3日", "10月3日", "10月4日", "10月4日", "10月5日", "10月5日", "10月6日", "10月6日", "10月7日", "10月7日"],
            region: ["广州", "深圳", "广州", "深圳", "广州", "深圳", "广州", "深圳", "广州", "深圳", "广州", "深圳", "广州", "深圳"]
        });
    });

    it("test isNoVal", function () {
        
        [jc.isNoVal(null), jc.isNoVal(undefined), jc.isNoVal(NaN), jc.isNoVal(0), jc.isNoVal({})].should.deepEqual([
            true,
            true,
            true,
            false,
            false
        ]);
    });

    // it("test jc.max, arr", function () {
    //     var table = [5, NaN, undefined, null, 1]
    //     var data = jc.max(table);
    //     data.should.deepEqual(5);
    // });

    // it("test jc.max, arr-obj", function () {
    //     var table = [
    //         { time: "10/1", mac: 10, win: 20 },
    //         { time: "10/1", mac: 30, win: 20 },
    //         { time: "10/1", mac: 45, win: 20 }
    //     ]
    //     var data = jc.max(table, function (row) {
    //         row.mac
    //     });
    //     [data].should.deepEqual([{ time: "10/1", mac: 45, win: 20 }]);
    // });

    it("test keyBreak", function () {
        var tb = [{ time: "10/1", mac: 10, win: 20 }]
        var data = jc.keyBreak(tb, {
            break: ["mac", "win"],
            key: "key",
            value: "value",
            retain: ["time"]
        });
        data.should.deepEqual([
            { time: "10/1", key: "mac", value: 10 },
            { time: "10/1", key: "win", value: 20 }
        ]);
    });

    it("test unique", function () {
        var tb = [
            { number: 1, name: "Colin" },
            { number: 1, name: "Colin" },
            { number: 2, name: "Colin" },
            { number: 3, name: "Mr Chen" },
            { number: 3, name: "Mr Chen" }
        ]
        var data = jc.unique(tb);
        [
            { number: 1, name: "Colin" },
            { number: 2, name: "Colin" },
            { number: 3, name: "Mr Chen" }
        ].should.deepEqual(data);
    });

    it("test spaceFix", function () {
        var time = [
            { TIME: 1, IN: 10, OUT: 10 },
            { TIME: 2, IN: 20, OUT: 20 },
            { TIME: 3, IN: 30, OUT: 30 },
            { TIME: 7, IN: 20, OUT: 40 },
            { TIME: 8, IN: 30, OUT: 50 },
            { TIME: 11, IN: 40, OUT: 60 }
        ];
        var fix = jc.spaceFix(time, {
            key: "TIME",
            start: 0,
            end: 12,
            space: 1,
            zeroFill: ["IN", "OUT"]
        });
        fix.should.deepEqual([
            { TIME: 0, IN: 0, OUT: 0 },
            { TIME: 1, IN: 10, OUT: 10 },
            { TIME: 2, IN: 20, OUT: 20 },
            { TIME: 3, IN: 30, OUT: 30 },
            { TIME: 4, IN: 0, OUT: 0 },
            { TIME: 5, IN: 0, OUT: 0 },
            { TIME: 6, IN: 0, OUT: 0 },
            { TIME: 7, IN: 20, OUT: 40 },
            { TIME: 8, IN: 30, OUT: 50 },
            { TIME: 9, IN: 0, OUT: 0 },
            { TIME: 10, IN: 0, OUT: 0 },
            { TIME: 11, IN: 40, OUT: 60 },
            { TIME: 12, IN: 0, OUT: 0 }
        ]);
    });

    it("test jc.orderBy", function () {
        var table = [
            { TIME: 1, IN: 10, OUT: 10 },
            { TIME: 2, IN: 20, OUT: 20 },
            { TIME: 3, IN: 30, OUT: 30 }
        ];
        var order = jc.orderBy(table, {IN:"DESC"});
        order.should.deepEqual([
            { TIME: 3, IN: 30, OUT: 30 },
            { TIME: 2, IN: 20, OUT: 20 },
            { TIME: 1, IN: 10, OUT: 10 }
        ]);
    });

    it("test jc.limit", function () {
        var time = [
            { TIME: 1, IN: 10, OUT: 10 },
            { TIME: 2, IN: 20, OUT: 20 },
            { TIME: 3, IN: 30, OUT: 30 },
            { TIME: 7, IN: 20, OUT: 40 },
            { TIME: 8, IN: 30, OUT: 50 },
            { TIME: 11, IN: 40, OUT: 60 }
        ];
        var fix = jc.limit(time, 2);
        fix.should.deepEqual([
            { TIME: 1, IN: 10, OUT: 10 },
            { TIME: 2, IN: 20, OUT: 20 }
        ]);
    });

    it("test sapceFix, empty", function () {
        var time = [];
        var fix = jc.spaceFix(time, {
            key: "TIME",
            start: 0,
            end: 12,
            space: 1,
            zeroFill: ["IN", "OUT"]
        });
        fix.should.deepEqual([]);
    });

    // it("test sum array type", function () {
    //     var tb = [1, 2, 3]
    //     var data = jc.sum(tb);
    //     data.should.deepEqual(6);
    // });

    // it("test sum array-obj type, key strng type", function () {
    //     var data = jc.sum(table,"fly");
    //     data.should.deepEqual(14);
    // });

    // it("test sum array-obj type, key array type", function () {
    //     var data = jc.sum(table, ["fly","inPerson"]);
    //     data.should.deepEqual({
    //         fly: 14,
    //         inPerson: 5103
    //     });
    // });

    // it("test sum obj type and  !key", function () {
    //     var tb = {
    //         a: 1,
    //         b: 2,
    //         c: 3
    //     }
    //     var data = jc.sum(tb);
    //     data.should.deepEqual(6);
    // });

    // it("test sum obj type and key", function () {
    //     var tb = {
    //         a: 1,
    //         b: 2,
    //         c: 3
    //     }
    //     var data = jc.sum(tb, ["a", "b"]);
    //     data.should.deepEqual(3);
    // });

    it("test group array type", function () {
        var group = jc.group(table, function(row) {
            return row.time
        })
        group.should.deepEqual({
            "10月1日": [{ time: "10月1日", inPerson: 20, outPerson: 1000, region: "广州", fly: 12 },
                { time: "10月1日", inPerson: 13, outPerson: 900, region: "深圳", fly: 2 }
            ],
            "10月2日": [
                { time: "10月2日", inPerson: 15, outPerson: 900, region: "广州", fly: null },
                { time: "10月2日", inPerson: 15, outPerson: 1000, region: "深圳", fly: 0 }
            ],
            "10月3日": [
                { time: "10月3日", inPerson: 15, outPerson: 100, region: "广州" },
                { time: "10月3日", inPerson: 15, outPerson: 100, region: "深圳" }
            ],
            "10月4日": [
                { time: "10月4日", inPerson: 90, outPerson: 60, region: "广州" },
                { time: "10月4日", inPerson: 70, outPerson: 50, region: "深圳" }
            ],
            "10月5日": [
                { time: "10月5日", inPerson: 500, outPerson: 39, region: "广州" },
                { time: "10月5日", inPerson: 350, outPerson: 30, region: "深圳" }
            ],
            "10月6日": [
                { time: "10月6日", inPerson: 900, outPerson: 15, region: "广州" },
                { time: "10月6日", inPerson: 1000, outPerson: 15, region: "深圳" }
            ],
            "10月7日": [
                { time: "10月7日", inPerson: 900, outPerson: 10, region: "广州" },
                { time: "10月7日", inPerson: 1200, outPerson: 7, region: "深圳" }
            ]
        });
    });
});