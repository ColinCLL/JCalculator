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
        data.should.eql([{ "fly": 3,"all": 14, in: 14 }]);
    });

    it("test count array type", function () {
        var data = jc.sql({
            select: {
                count: ["fly", "*", "time"]
            },
            from: table
        });
    data.should.eql([{ "count_fly": 3, "count_*": 14, "count_time": 14 }]);
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
        data.should.eql([{ "fly": 14, in: inSum }]);
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
        data.should.eql([{ "sum_fly": 14, "sum_inPerson": inSum }]);
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
        data.should.eql([{ "fly": 14/3, in: inSum / table.length }]);
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
        data.should.eql([{ "avg_fly": 14/3, "avg_inPerson": inSum / table.length }]);
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
        data.should.eql([{ "fly": 12, in: 1200 }]);
    });

    it("test max array type", function () {
        var data = jc.sql({
            select: {
                max: ["fly", "inPerson"]
            },
            from: table
        });
        data.should.eql([{ "max_fly": 12, "max_inPerson": 1200 }]);
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
        data.should.eql([{ "fly": 0, in: 13 }]);
    });

    it("test min array type", function () {
        var data = jc.sql({
            select: {
                min: ["fly", "inPerson"]
            },
            from: table
        });
        data.should.eql([{ "min_fly": 0, "min_inPerson": 13 }]);
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
        data.should.eql(json);
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
        data.should.eql(json);
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
        data.should.eql(json);
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
        data.should.eql(json);
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
        data.should.eql(json);
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
        data.should.eql(json);
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
        data.should.eql(json);
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
        data.should.eql(json);
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
        data.should.eql(json);
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
        data.should.eql(json);
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
        data.should.eql(json);
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
        data.should.eql(json);
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
        data.should.eql(json);
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
        data.should.eql(json);
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
        data.should.eql(json);
    });

    it("test limit number > table.length type", function () {
        var data = jc.sql({
            select: {
                col: ["time", "inPerson"],
            },
            from: table,
            limit: 20
        });
        data.length.should.eql(14);
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
        data.should.eql(json);
    });

    it("test limit over", function () {
        var data = jc.sql({
            select: {
                col: ["time", "inPerson"],
            },
            from: table,
            limit: [15,20]

        });
        data.should.eql([]);
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
        data.should.eql({
            time: ["10月1日", "10月1日", "10月2日", "10月2日", "10月3日", "10月3日", "10月4日", "10月4日", "10月5日", "10月5日", "10月6日", "10月6日", "10月7日", "10月7日"],
            region: ["广州", "深圳", "广州", "深圳", "广州", "深圳", "广州", "深圳", "广州", "深圳", "广州", "深圳", "广州", "深圳"]
        });
    });

    it("test keyArray", function () {
        var data = jc.keyArray(table, ["time", "region"]);
        data.should.eql({
            time: ["10月1日", "10月1日", "10月2日", "10月2日", "10月3日", "10月3日", "10月4日", "10月4日", "10月5日", "10月5日", "10月6日", "10月6日", "10月7日", "10月7日"],
            region: ["广州", "深圳", "广州", "深圳", "广州", "深圳", "广州", "深圳", "广州", "深圳", "广州", "深圳", "广州", "深圳"]
        });
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
        data.should.eql([
            { number: 1, name: "Colin" },
            { number: 2, name: "Colin" },
            { number: 3, name: "Mr Chen" }
        ]);
    });
});