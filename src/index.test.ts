import { getCookie, getCookies } from "@trashpanda001/helpers/cookies"
import { describe, expect, it } from "vitest"

describe("exports2", () => {
  it("should export getCookies function", () => {
    expect(getCookies).toBeDefined()
  })
  it("should export getCookie function", () => {
    expect(getCookie).toBeDefined()
  })
})
