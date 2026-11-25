import assert from "node:assert/strict";
import { test } from "node:test";
import {
  PasswordSchema,
  PhoneLoginSchema,
  UsernameLoginSchema,
} from "../src/features/auth/schemas/login.schema.ts";

test("password validation accepts the exact boundary and preserves passwords", () => {
  assert.equal(PasswordSchema.parse("AB12!!ab"), "AB12!!ab");
  assert.equal(PasswordSchema.parse("a!1Bb@2A"), "a!1Bb@2A");
  assert.equal(PasswordSchema.parse(" AB12!! "), " AB12!! ");
});

for (const [password, message] of [
  ["", "رمز عبور را وارد کنید"],
  ["AB12!!a", "رمز عبور باید حداقل ۸ کاراکتر داشته باشد"],
  ["Ab12!!ab", "رمز عبور باید حداقل ۲ حرف بزرگ داشته باشد"],
  ["AB1a!!ab", "رمز عبور باید حداقل ۲ رقم داشته باشد"],
  ["AB12!abc", "رمز عبور باید حداقل ۲ کاراکتر ویژه (مثل !@#) داشته باشد"],
] as const) {
  test(`password validation reports: ${message}`, () => {
    const result = PasswordSchema.safeParse(password);
    assert.equal(result.success, false);
    if (!result.success) assert.equal(result.error.issues[0].message, message);
  });
}

test("special characters exclude whitespace and letters in other scripts", () => {
  assert.equal(PasswordSchema.safeParse("AB12ab  ").success, false);
  assert.equal(PasswordSchema.safeParse("AB12ab\n\t").success, false);
  assert.equal(PasswordSchema.safeParse("AB12abسلام").success, false);
  assert.equal(PasswordSchema.safeParse("AB۱۲!!ab").success, true);
});

test("username validation trims names while retaining the exact password", () => {
  assert.deepEqual(
    UsernameLoginSchema.parse({
      username: "  demo-user  ",
      password: " AB12!! ",
    }),
    { username: "demo-user", password: " AB12!! " },
  );
  const result = UsernameLoginSchema.safeParse({
    username: "  ",
    password: "AB12!!ab",
  });
  assert.equal(result.success, false);
  if (!result.success) {
    assert.deepEqual(result.error.issues[0].path, ["username"]);
    assert.equal(result.error.issues[0].message, "نام کاربری را وارد کنید");
  }
});

test("phone login retains mobile, email, and optional invitation-code validation", () => {
  assert.deepEqual(
    PhoneLoginSchema.parse({
      identifier: " 09123456789 ",
      invitationCode: " REF123 ",
    }),
    { identifier: "09123456789", invitationCode: "REF123" },
  );
  assert.deepEqual(PhoneLoginSchema.parse({ identifier: "demo@example.com" }), {
    identifier: "demo@example.com",
  });
  assert.equal(
    PhoneLoginSchema.safeParse({ identifier: "0912345678" }).success,
    false,
  );
  assert.equal(
    PhoneLoginSchema.safeParse({ identifier: "invalid" }).success,
    false,
  );
  assert.equal(PhoneLoginSchema.safeParse({ identifier: "" }).success, false);
});
