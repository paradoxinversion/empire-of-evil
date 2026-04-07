// Polyfill for globalThis.crypto.randomUUID used across engine code/tests
// Vitest runs in Node and may not expose globalThis.crypto like browsers.
// This ensures a stable implementation using Node's crypto.randomUUID.

import nodeCrypto from "node:crypto";

if (!globalThis.crypto) {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    globalThis.crypto = { randomUUID: () => nodeCrypto.randomUUID() } as any;
} else if (typeof (globalThis.crypto as any).randomUUID !== "function") {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    (globalThis.crypto as any).randomUUID = () => nodeCrypto.randomUUID();
}
