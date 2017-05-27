# localLogger
A client side persistent logger based on localStorage.

## Features

1. get/set log to localStorage
2.

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

 ### API
 
 * write([key,] val)
 
 * read([key])
 
 * readAsList([key])
 
 * clean(daysBefore)
 
