# JCalculator
JCalculator is kind of processing data library for javascript. It supports data manipulation of sql, tree, spaceFix and so on.

page-CN: https://colincll.github.io/jc-doc/

国内镜像: http://colincll.gitee.io/jc-doc

page-EN: null;

any issue about document: https://github.com/ColinCLL/jc-doc/issues

## npm
npm i jcalculator --save

## Demo
```javascript
var data = [
  { name: "apple", sell: 15, week: 2 },
  { name: "apple", sell: 5, week: 3 },
  { name: "apple", sell: 13, week: 4 },
  { name: "apple", sell: 3, week: 5 },
  { name: "banana", sell: 4, week: 2 },
  { name: "banana", sell: 5, week: 3 },
  { name: "banana", sell: 2, week: 4 },
  { name: "banana", sell: 2, week: 5 }
];

var test = jc.sql({
  select:{
    col: "name",
    sum: "sell"
  },
  from: data,
  where: function (row) {
    return row.week > 2
  },
  groupBy: "name"
})
console.log(test);
/* output: [
  {"name":"apple","sum_sell":21},
  {"name":"banana","sum_sell":9}
]*/
```