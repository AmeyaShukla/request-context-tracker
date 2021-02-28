const asyncHooks = require('async_hooks');
const { v4: uuidv4 } = require('uuid');

const contextMap = new Map();

const hook = asyncHooks.createHook({init, destroy});
hook.enable();

function init (asyncId, type, triggerAsyncId) {
    const parentContext = contextMap.get(triggerAsyncId);
    if(!parentContext) return;
    contextMap.set(asyncId, parentContext);
}

function destroy (asyncId) {
    contextMap.delete(asyncId);
}

/**
 * set the context object
 * @param {*} context 
 */
function set(context) {
    contextMap.set(asyncHooks.executionAsyncId(), context);
}

/**
 * get the key value from the context
 * @param {*} key 
 */
function get(key) {
    const context = contextMap.get(asyncHooks.executionAsyncId());
    if(context && context[key]) return context[key];
    return null;
}

/**
 * fetch the tracker id for request
 */
function id() {
    try {
        return get('tracerId');
    } catch(err){
        console.error(err);
        return null;
    }
}

/**
 * restify middleware function for setting tracer id;
 * @param {options} param
 */
function restifyMiddleware(options) {
    function restifyPluginHandler(req, res, next) {
        if(options && options.useHeader) set({tracerId: req.headers[(options && options.headerName)]})
        else set({tracerId: uuidv4()})
        next();
    }
    return restifyPluginHandler;
}

module.exports = {
    restifyMiddleware,
    id,
};