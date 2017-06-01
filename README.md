# localLogger
A client side persistent logger based on localStorage.

## Features

1. get/set log to localStorage
2. clean expired log each time when the logger is inited

## How to Use?

### Import
Support UMD

### Initial
```
    var logger = new LocalLogger({
        name: 'TestLogger', // the prefix to the key for localStorage, default value is 'LocalLogger'
        timestamp: true, // has timestamp in each time to log, default value is false
        maxDays: 2 // the maximum days to store the log in localStorage, default value is 3
    });
```

## API
 
### write([key,] val)
Marks the string as log to localStorage.

* key - the specified key to store, if not specify the string, uses the auto-generated name when logger was inited.
* val - the value to store
 
### read(isGetPrev, [key])
Returns the value(s) stored in localStorage in string format.

* isGetPrev - to get previous log or not
* key - the specified key to get, if not specify the string, uses the auto-generated name when logger was inited.
 
### readAsList(isGetPrev, [key])
Returns the value(s) stored in localStorage in array list format.

* isGetPrev - to get previous log or not
* key - the specified key to get, if not specify the string, uses the auto-generated name when logger was inited.

Examples:
```
logger.readAsList(false);
// [
//    {"time":"16:16:33","val":"6666"},
//    {"time":"16:16:54","val":"qqq"},
//    {"time":"16:17:59","val":"bdc"}
// ]
```

```
logger.readAsList(true);
// [
//    {"date":"20170531","log":[{"time":"15:04:36","val":"xxxxx"},{"time":"15:05:01","val":" ;:'"}]},
//    {"date":"20170601","log":[{"time":"16:16:33","val":"6666"},{"time":"16:16:54","val":"qqq"},{"time":"16:17:59","val":"bdc"}]}
// ]
```
 
### clean(daysBefore)
Cleans the log(s) which was stored (n) days before

* daysBefore - the specified days before today
