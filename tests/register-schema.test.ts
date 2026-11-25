import assert from "node:assert/strict";
import { test } from "node:test";
import {
  RegistrationUsernameSchema,
  UsernameRegisterSchema,
  PasswordSchema,
} from "../src/features/auth/schemas/register.schema.ts";

const valid = {
  mobile: "09123456789",
  username: "TestUser12",
  password: "AB12!!ab",
  confirmPassword: "AB12!!ab",
};

test("registration validates and preserves matching passwords", () => {
  assert.deepEqual(UsernameRegisterSchema.parse(valid), valid);
  const mismatch = UsernameRegisterSchema.safeParse({
    ...valid,
    confirmPassword: "AB12!!cd",
  });
  assert.equal(mismatch.success, false);
  if (!mismatch.success) {
    assert.deepEqual(mismatch.error.issues[0].path, ["confirmPassword"]);
    assert.equal(
      mismatch.error.issues[0].message,
      "رمز عبور و تکرار آن یکسان نیستند",
    );
  }
  assert.equal(
    UsernameRegisterSchema.safeParse({ ...valid, confirmPassword: "" }).success,
    false,
  );
  assert.equal(
    UsernameRegisterSchema.safeParse({ ...valid, mobile: "demo@example.com" })
      .success,
    false,
  );
});

test("registration username rules match the supplied API contract", () => {
  for (const username of ["A", "testuser", "TestUser123", "A".repeat(50)]) {
    assert.equal(
      RegistrationUsernameSchema.safeParse(username).success,
      true,
      username,
    );
  }
  for (const username of [
    "",
    " ",
    "1test",
    "test user",
    "test_user",
    "test-user",
    "سلام",
    "A".repeat(51),
  ]) {
    assert.equal(
      RegistrationUsernameSchema.safeParse(username).success,
      false,
      username,
    );
  }
});

test("registration requires English uppercase letters", () => {
  assert.equal(PasswordSchema.safeParse("ÄÖ12!!ab").success, false);
  assert.equal(PasswordSchema.safeParse("AB12!!ab").success, true);
});
