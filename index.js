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

function set(context) {
    contextMap.set(asyncHooks.executionAsyncId(), context);
}

function get() {
    const context = contextMap.get(asyncHooks.executionAsyncId());
    return context;
}

function id() {
    const context = contextMap.get(asyncHooks.executionAsyncId());
    if(context && context.tracerId) return context.tracerId;
    return null;
}

/**
 * restify middleware function for setting tracer id;
 * @param {options} param
 */
function restifyMiddleware({useHeader = false, headerName = null}) {
    function restifyPluginHandler(req, res, next) {
        if(useHeader) set({tracerId: req.headers[headerName]})
        else set({tracerId: uuidv4()})
        next();
    }
    return restifyPluginHandler;
}

module.exports = {
    set,
    get,
    restifyMiddleware,
    id,
};