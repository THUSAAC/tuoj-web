# Result status

- Accepted
- Wrong Answer
- Time Limit Exceeded
- Memory Limit Exceeded
- Output Limit Exceeded
- Runtime Error
- Compilation Error
- Server Error

# 获得一个评测任务

POST /api/judge/get_task

## Request body

~~~
{
     "token": "faf3ar42q34"
}
~~~

## Response body

~~~
{
     "run_id": 32,
     "lang": "g++", // or "java"
     
     "source_url": ["http://tuoj.com/download/a.cpp", "http://tuoj.com/download/t1.ans", "http://tuoj.com/download/t2.ans"],

     // "total_cases": 10, 取消这个啦
     "data_md5": "4b4dc93fafa1298f95e731ebac7725d1",
     "data_url": "http://tuoj.com/download/t3.zip"
}
~~~

如果没有任务
~~~
{
     "run_id": -1 // run_id为-1
}
~~~

# 向评测机返回评测结果

POST /api/judge/update_results

## Request body

若编译正常，则 
~~~
{
     "run_id": 32,
     "token": "faf3ar42q34",

     "results": {
          "Compilation": {
               "status": "Compilation Success"
               "ext_info": { // "ext_info" 可以都显示到网页上，除了debug那一项
                   "Compilation Info": "",
                   "debug": ""
               }
          }
          "1": {
               "status": "Accepted",
               "time": 864, // ms
               "memory": 27815, // kB
               "score": 10
               "ext_info": {
                   "Judge Info": "Accepted" 
               }
          }
          "3": {
               "status": "Wrong Answer",
               "time": 999,
               "memory": 27813,
               "score": 5 // 根据prob.json返回一个范围内的值
               "ext_info": {
                   "Judge Info": "Expected 5, but found 10."
               }
          }
     }
}
~~~
否则返回

~~~
{
     "run_id": 32,
     "token": "faf3ar42q34",
     "results": {
          "Compilation": {
               "status": "Compilation Error",
               "ext_info": {
                   "Compilation Info": "g++ xxxx"
                   "debug": "xxx"
               }
          }
     }
}
~~~

## Response body

~~~
{
     "status": "success"
}
~~~
