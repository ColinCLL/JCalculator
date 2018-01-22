# JCalculator 1.0.0
JCalculator is kind of processing data library for javascript. It supports data manipulation of sql, tree, spaceFix and so on.

page-CN: https://colincll.github.io/jc-doc/

page-EN: null;

any issue about document: https://github.com/ColinCLL/jc-doc/issues

## Demo
```javascript
  var table = [
    {time:"10/1", inPerson:20, outPerson:1000, region: "guangzhou"},
    {time:"10/1", inPerson:13, outPerson:900, region: "shenzhen"},
    {time:"10/2", inPerson:15, outPerson:900, region: "guangzhou"},
    {time:"10/2", inPerson:15, outPerson:1000, region: "shenzhen"},
    {time:"10/3", inPerson:15, outPerson:100, region: "guangzhou"},
    {time:"10/3", inPerson:15, outPerson:100, region: "shenzhen"},
    {time:"10/4", inPerson:90, outPerson:60, region: "guangzhou"},
    {time:"10/4", inPerson:70, outPerson:50, region: "shenzhen"},
    {time:"10/5", inPerson:500, outPerson:39, region: "guangzhou"},
    {time:"10/5", inPerson:350, outPerson:30, region: "shenzhen"},
    {time:"10/6", inPerson:900, outPerson:15, region: "guangzhou"},
    {time:"10/6", inPerson:1000, outPerson:15, region: "shenzhen"},
    {time:"10/7", inPerson:900, outPerson:10, region: "guangzhou"},
    {time:"10/7", inPerson:1200, outPerson:7, region: "shenzhen"}
  ]
  var data1 = jc.sql({
    select: {
      sum: ["inPerson", "outPerson"],
      avg: ["inPerson", "outPerson"]
    },
    from: table
  })

  console.log(data1) 
  // 输出： {sum_inPerson: 5103, sum_outPerson: 4226, avg_inPerson: 364.5, avg_outPerson: 301.85714285714283}

  var data2 = jc.sql({
    select : {
      col:{
        "city":"region"
      },
      sum : {
        "流入人口总和":"inPerson",
        "流出人口总和":"outPerson",
        "sumAll":function(row){
          return row.inPerson + row.outPerson
        }
      },
      avg : {
        "流入人口平均数":"inPerson",
        "流出人口平均数":"outPerson",
        "流入流出人口平均数":function(row){
          return row.inPerson + row.outPerson
        }
      }
    },
    from : table,
    groupBy:"region"
  })

  console.log(data2);
  /*
   输出: 
  [{"city":"guangzhou","流入人口总和":2440,"流出人口总和":2124,"sumAll":4564,"流入人口平均数":348.57142857142856,"流出人口平均数":303.42857142857144,"流入流出人口平均数":652},
  {"city":"shenzhen","流入人口总和":2663,"流出人口总和":2102,"sumAll":4765,"流入人口平均数":380.42857142857144,"流出人口平均数":300.2857142857143,"流入流出人口平均数":680.7142857142857}]
  */
```