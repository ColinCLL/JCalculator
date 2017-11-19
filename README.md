# JCalculator 1.0.0
概述：一款在前端处理查询，数据复杂聚合运算的工具，给JSer专用的计算器。
目前状态：已经实现类SQL形式的API来操作数据，计算数据。
进行中：完善文档，添加去重，以及一些原生SQL不支持但很常用计算逻辑。
将来目标：实现将数据生成树或者树链表，支持指定节点的属性更新，整个节点的更新。
## Demo
```javascript
  var table = [
    {time:"10月1日", inPerson:20, outPerson:1000, region: "广州"},
    {time:"10月1日", inPerson:13, outPerson:900, region: "深圳"},
    {time:"10月2日", inPerson:15, outPerson:900, region: "广州"},
    {time:"10月2日", inPerson:15, outPerson:1000, region: "深圳"},
    {time:"10月3日", inPerson:15, outPerson:100, region: "广州"},
    {time:"10月3日", inPerson:15, outPerson:100, region: "深圳"},
    {time:"10月4日", inPerson:90, outPerson:60, region: "广州"},
    {time:"10月4日", inPerson:70, outPerson:50, region: "深圳"},
    {time:"10月5日", inPerson:500, outPerson:39, region: "广州"},
    {time:"10月5日", inPerson:350, outPerson:30, region: "深圳"},
    {time:"10月6日", inPerson:900, outPerson:15, region: "广州"},
    {time:"10月6日", inPerson:1000, outPerson:15, region: "深圳"},
    {time:"10月7日", inPerson:900, outPerson:10, region: "广州"},
    {time:"10月7日", inPerson:1200, outPerson:7, region: "深圳"}
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
        "城市":"region"
      },
      sum : {
        "流入人口总和":"inPerson",
        "流出人口总和":"outPerson",
        "流入流出人口总和":function(row){
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
  [{"城市":"广州","流入人口总和":2440,"流出人口总和":2124,"流入流出人口总和":4564,"流入人口平均数":348.57142857142856,"流出人口平均数":303.42857142857144,"流入流出人口平均数":652},
  {"城市":"深圳","流入人口总和":2663,"流出人口总和":2102,"流入流出人口总和":4765,"流入人口平均数":380.42857142857144,"流出人口平均数":300.2857142857143,"流入流出人口平均数":680.7142857142857}]
  */
```