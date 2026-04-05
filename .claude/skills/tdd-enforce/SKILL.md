---
name: tdd-enforce
description: >
  Enforce strict TDD (red→green→refactor) whenever implementing new functionality, adding features,
  creating new functions or modules, or fixing bugs. Use this skill proactively any time you are
  about to write production code — if you're about to create a function, class, module, or fix a
  bug, this skill must run first. Do NOT write any production code before a failing test exists.
---

# TDD Enforcement: Red → Green → Refactor

You are about to write production code. Stop. Tests come first.

## The Non-Negotiable Rule

```
No production code without a failing test that demands it.
```

If you wrote code before reading this skill, delete it. All of it. Start over.

## The Cycle

### Step 1 — RED: Enumerate, then write one failing test

Before writing any test, spend a moment mapping the behavior surface:

**Identify what must be true:**
- The primary success path (happy path)
- Boundary conditions (empty inputs, zero, max values, single items)
- Invalid/unexpected inputs (wrong types, nulls, out-of-range)
- Error paths (what should throw, what should return an error value)
- State transitions (if applicable — before/after side effects)

Write down this list. It becomes your test queue. Then write the **first** test only — the simplest one that establishes the core contract.

A good test:
- Has a name that reads like a specification: `'returns empty array when input has no matching entries'`
- Tests **observable behavior**, not implementation details (don't assert on private state, internal call counts, or specific algorithms)
- Uses real inputs and checks real outputs — avoid mocks unless the dependency is external I/O (network, filesystem, clock)
- Tests one thing

```typescript
// Good — tests the contract
test('filters citizens below minimum skill threshold', () => {
  const citizens = [
    { id: 'a', skills: { stealth: 3 } },
    { id: 'b', skills: { stealth: 7 } },
  ];
  expect(filterByMinSkill(citizens, 'stealth', 5)).toEqual([citizens[1]]);
});

// Bad — tests implementation
test('calls Array.filter internally', () => {
  const spy = vi.spyOn(Array.prototype, 'filter'); // vi imported from 'vitest'
  filterByMinSkill([], 'stealth', 5);
  expect(spy).toHaveBeenCalled();
});
```

### Step 2 — Verify RED

Run the test. It must fail.

```bash
pnpm --filter @empire-of-evil/engine test -- run src/path/to/test.test.ts
```

Confirm:
- Test **fails** (not errors out with a syntax/import problem)
- The failure message names the missing behavior, not a typo
- It fails because the feature doesn't exist yet

If it passes immediately, you're testing already-existing behavior. Fix the test.  
If it throws a module/import error, fix the import — but do not write implementation yet.

### Step 3 — GREEN: Write the minimum code to pass

The constraint is real: **minimum**. No extra parameters, no future-proofing, no "while I'm here" improvements. Write exactly what the test demands.

```typescript
// The test asked for: filter by skill threshold
// Write exactly this, nothing more
function filterByMinSkill(citizens, skill, min) {
  return citizens.filter(c => (c.skills[skill] ?? 0) >= min);
}
```

Run the test again. It must pass. All previously passing tests must still pass.

```bash
pnpm --filter @empire-of-evil/engine test
```

If other tests broke, fix them before moving on.

### Step 4 — REFACTOR: Clean without changing behavior

Now and only now: improve the code. Extract helpers, improve names, remove duplication. Tests stay green throughout.

Do not add new behavior during refactor. If you think of something new, add it to your test queue and handle it in the next cycle.

### Step 5 — Repeat

Pull the next test from your queue. Go to Step 1.

---

## Edge Case Checklist

For every unit of behavior, consider:

| Category | Questions to ask |
|---|---|
| Empty / zero | What happens with empty collections, zero values, empty strings? |
| Single item | Does it behave correctly at the boundary between "none" and "many"? |
| Boundary values | Off-by-one errors — test at n-1, n, n+1 |
| Invalid input | Missing required fields, wrong types, null/undefined |
| Order sensitivity | Does the output depend on input order? Should it? |
| Idempotency | Calling twice — same result or side-effect accumulation? |
| Large / max | Does it degrade gracefully at scale? |

Don't test all of these blindly. Use judgment — which ones are plausible failure modes for this specific function? Write tests for those.

---

## Project Context

This is `@empire-of-evil/engine` — pure TypeScript, no browser, no I/O. That means:

- **No mocks needed** in most cases. Functions take plain data and return plain data. Test them directly.
- `GameState` must be `JSON.stringify`-able. Test that new state fields don't break this invariant if you're touching state structure.
- Entities reference each other by string ID. Tests should set up minimal state with valid IDs rather than mocking query helpers.
- Use `exactOptionalPropertyTypes: true` — absent fields must be absent (not `undefined`). Tests that construct objects should reflect this.

---

## Completion Checklist

Before marking any feature complete:

- [ ] Every new function has at least one test that watched it fail first
- [ ] Edge cases from the enumeration list have tests (or a noted reason they're omitted)
- [ ] Tests assert on observable outputs, not internal structure
- [ ] All tests pass (`pnpm --filter @empire-of-evil/engine test`)
- [ ] No mocks used where real data would work
- [ ] Refactor pass done: code is clean, names are clear, no duplication

---

## When you're stuck

| Situation | What it usually means |
|---|---|
| Can't figure out how to test it | The function's interface is unclear. Define the API you *wish* existed, then write the test against that. |
| Test setup requires 50 lines of state | The function takes on too much context. Split it, or extract a helper with a narrower contract. |
| Everything needs to be mocked | The function is coupled to things it shouldn't be. Inject dependencies or split concerns. |
| Test is flaky | There's hidden state or non-determinism. Find and eliminate it. |

Hard-to-test code is a design signal. Listen to it.
