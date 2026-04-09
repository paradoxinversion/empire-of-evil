import { expect, test } from "vitest";
import {
    startActivity,
    cancelActivity,
    assignAgentToActivity,
    removeAgentFromActivity,
} from "../index.js";

test("engine index exports activity mutation APIs", () => {
    expect(typeof startActivity).toBe("function");
    expect(typeof cancelActivity).toBe("function");
    expect(typeof assignAgentToActivity).toBe("function");
    expect(typeof removeAgentFromActivity).toBe("function");
});
