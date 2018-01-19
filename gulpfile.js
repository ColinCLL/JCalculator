var gulp = require("gulp");
var eslint = require("gulp-eslint");

gulp.task("lint", function () {
  // ESLint ignores files with "node_modules" paths. 
  // So, it"s best to have gulp ignore the directory as well. 
  // Also, Be sure to return the stream from the task; 
  // Otherwise, the task may end before the stream has finished. 
  console.log("\n\n\nstart lint");
  return gulp.src(["**/JCalculator.js", "!node_modules/**"])
    // eslint() attaches the lint output to the "eslint" property 
    // of the file object so it can be used by other modules. 
    .pipe(eslint({
      rules:{
        "no-dupe-args":1,
        "use-isnan":1,
        "curly":[1, "multi-line"],
        "no-useless-escape":1,
        "no-unused-vars":1,
        "array-bracket-spacing":1,
        "block-spacing":1,
        "brace-style":1,
        "comma-style":1,
        "no-unused-vars":0,
        "computed-property-spacing":1,
        "indent": ["error", 2], // 缩进控制 2空格 
        "no-mixed-spaces-and-tabs": "error", // 禁止使用 空格 和 tab 混合缩进 
        "no-regex-spaces": "error", // 禁止正则表达式字面量中出现多个空格 
        "no-multi-spaces": "error", // 禁止出现多个空格而且不是用来作缩进的 
        "array-bracket-spacing": ["error", "never"], // 数组紧贴括号部分不允许包含空格。 
        "object-curly-spacing": ["error", "never"], // 对象紧贴花括号部分不允许包含空格。 
        "block-spacing": ["error", "never"], // 单行代码块中紧贴括号部分不允许包含空格。 
        "comma-spacing": ["error", {"before": false, "after": true}], // 在变量声明、数组字面量、对象字面量、函数参数 和 序列中禁止在逗号前使用空格,要求在逗号后使用一个或多个空格 
        "semi-spacing": ["error", {"before": false, "after": true}], // 禁止分号周围的空格 
        "computed-property-spacing": ["error", "never"], // 禁止括号和其内部值之间的空格 
        "keyword-spacing": ["error", {"before": true, "after": true}], // 该规则强制关键字和类似关键字的符号周围空格的一致性：as、break、case、catch、class、const、continue、debugger、default、delete、do、else、export、extends、finally、for、from、function、get、if、import、in、instanceof、let、new、of、return、set、static、super、switch、this、throw、try、typeof、var、void、while、with 和 yield。 
        "no-trailing-spaces": "error", // 禁用行尾空格 
        "no-spaced-func": "error", // 禁止 function 标识符和圆括号之间有空格 
        "space-before-function-paren": "error", // 禁止函数圆括号之前有一个空格 
        "space-before-blocks": ["error", "always"], // 禁止语句块之前的空格 
        "space-in-parens": ["error", "never"], // 禁止圆括号内的空格 
        "space-infix-ops": ["error", {"int32Hint": false}], // 要求中缀操作符周围有空格,设置 int32Hint 选项为 true (默认 false) 允许 a|0 不带空格。 
        "space-unary-ops": "error", // 要求或禁止在一元操作符之前或之后存在空格,new、delete、typeof、void、yield要求有空格，-、+、--、++、!、!!要求无空格。 
        "spaced-comment": ["error", "always"], // 要求在注释前有空白 
        "arrow-spacing": "error", // 要求箭头函数的箭头之前和之后有空格 
        "generator-star-spacing": ["error", {"before": false, "after": true}], // 强制 generator 函数中 * 号前有空格，后无空格。 
        "yield-star-spacing": ["error", {"before": true, "after": false}], // 强制 yield* 表达式中  * 号前有空格，后无空格。 
        "no-irregular-whitespace": "error", // 禁止不规则的空白。 
        "template-curly-spacing": ["error", "never"], // 强制模板字符串中花括号内不能出现空格  
        "linebreak-style": [1, "windows"],
        "new-cap":1
      }
    }))
    .pipe(eslint.format())
    // To have the process exit with an error code (1) on 
    // lint error, return the stream and pipe to failAfterError last. 
    .pipe(eslint.failAfterError());
});

// 监听任务
gulp.task("watch", function () {
  gulp.watch(["**/*.js", "!node_modules/**"], ["lint"]);
});

gulp.task("default", ["lint"], function () {
  console.log("lint successful")
});