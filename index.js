var jc = require('./JCalculator');


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

var data = jc.sql({
    select: {
        count: "fly"
    },
    from: table
});
console.log(data);