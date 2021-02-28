## request-context-tracker
###### * NOTE: UPGRADE YOUR NODE AND NPM VERSIONS IF THEIR VERSIONS ARE REALLY OLD
&nbsp;
```
const requestTracker = require('request-context-tracker');

# this will generate a uuid for trackerId
server.use(requestTracker.restifyMiddleware());

# is useHeader is set to true, the trackerId will taken from the headername field name in the req headers
server.use(requestTracker.restifyMiddleware(
    {
        useHeader: true, 
        headerName: 'auth_tracer_id'
    }
));

# for fetching the tracker id anywhere in the request life cycle
console.log("request Tracker Id is ::", requestTracker.id());
```