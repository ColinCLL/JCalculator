#include <emscripten.h>
#include <stdint.h>
#include <string.h>
#include <math.h>

typedef struct {
  char* key;
  double sum;
  double avg;
  double max;
  double min;
  int count;
} AggregationResult;

EMSCRIPTEN_KEEPALIVE
void groupCal(double* input, int input_len, double* output, int output_len) {
  // 实现分组计算逻辑
  // 这里需要根据JCalculator.js中的groupCal函数逻辑进行实现
  
  // 初始化聚合结果
  AggregationResult result = {
    .sum = 0,
    .avg = 0,
    .max = -INFINITY,
    .min = INFINITY,
    .count = 0
  };
  
  // 遍历输入数据
  for (int i = 0; i < input_len; i++) {
    double val = input[i];
    
    // 跳过无效值
    if (isnan(val)) continue;
    
    // 计算sum
    result.sum += val;
    
    // 计算max
    if (val > result.max) result.max = val;
    
    // 计算min
    if (val < result.min) result.min = val;
    
    // 计数
    result.count++;
  }
  
  // 计算avg
  if (result.count > 0) {
    result.avg = result.sum / result.count;
  }
  
  // 输出结果
  output[0] = result.sum;
  output[1] = result.avg;
  output[2] = result.max;
  output[3] = result.min;
  output[4] = result.count;
}