import assert from "node:assert/strict";
import { test } from "node:test";
import {
  PasswordConfirmationSchema,
  UsernameRegisterSchema,
} from "../src/features/auth/schemas/register.schema.ts";
test("reset and registration share strict password and confirmation validation", () => {
  assert.equal(
    PasswordConfirmationSchema.safeParse({
      password: "AB12!!ab",
      confirmPassword: "AB12!!ab",
    }).success,
    true,
  );
  const mismatch = PasswordConfirmationSchema.safeParse({
    password: "AB12!!ab",
    confirmPassword: "AB12!!cd",
  });
  assert.equal(mismatch.success, false);
  if (!mismatch.success)
    assert.deepEqual(mismatch.error.issues[0].path, ["confirmPassword"]);
  assert.equal(
    PasswordConfirmationSchema.safeParse({
      password: "123456",
      confirmPassword: "123456",
    }).success,
    false,
  );
  assert.equal(
    UsernameRegisterSchema.safeParse({
      mobile: "09123456789",
      username: "TestUser",
      password: "AB12!!ab",
      confirmPassword: "AB12!!cd",
    }).success,
    false,
  );
});
