// @vitest-environment node

import { describe, expect, it } from "vitest"
import { deleteCookie, getCookie, getCookies, nukeCookie, setCookie } from "./cookies.js"

describe("SSR tests", () => {
  it("should throw an error with appropriate message for each function", () => {
    expect(() => getCookie("test")).toThrowError("getCookie is not available during SSR")
    expect(() => setCookie("test", "value")).toThrowError("setCookie is not available during SSR")
    expect(() => deleteCookie("test")).toThrowError("deleteCookie is not available during SSR")
    expect(() => getCookies()).toThrowError("getCookies is not available during SSR")
    expect(() => nukeCookie("test")).toThrowError("nukeCookie is not available during SSR")
  })
})
