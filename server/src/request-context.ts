import { AsyncLocalStorage } from "node:async_hooks";

type RequestContext = {
  userId?: string
  skipScope?: boolean
  skipCacheInvalidation?: boolean
}

export const requestContext = new AsyncLocalStorage<RequestContext>();

export function getRequestContext() {
    return requestContext.getStore();
}
