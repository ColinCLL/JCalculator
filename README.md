# JCalculator 1.0.0
JCalculator是一款专门给前端工程师使用计算器，使前端复杂聚合计算更加简单，数据处理代码逻辑更加可读。

### 简单设计理念描述，后面有空再补充
JCalculator的设计理念是灵活，简易，提高前端复杂数据处理和计算的开发体验。我希望JCalculator所需输入的数据格式都支持数据库表查询得出的数据，统一数据库，服务端，前端的数据结构和数据聚合逻辑。而特殊的非接近数据表数据结构的数据，应该由JCalculator输出或者数据处理应该逻辑封装在前端组件内部，日常开发尽可能不需要处理非接近数据表数据结构的数据，从而在数据处理的层面达到高度可控、灵活、简单。目前我也是在为这种使用场景努力
当然，使用JCalculator并不一定要在上诉使用场景，这只是一款计算工具库，但在上诉场景会有更优表现。
JCalculator可以在node,web,worker环境使用，能够基本模拟SQL单表查询和聚合的数据处理逻辑。还有一些对数据表类格式的数据进行格式转换、补全的函数。也有一些基础循环，聚合的函数。还会有更多的数据处理函数慢慢更新到JCalculator，也期待您的加入。
进行中：完善文档，code review, 简化简单聚合操作。
单元测试可以看到一些基本使用方法。
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