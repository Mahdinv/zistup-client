import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement } from "react";
import { renderToStaticMarkup } from "react-dom/server";
import { AnimatePresence } from "framer-motion";
import { createServer } from "vite";

test("wave keyframes start at their initial positions inside the dashboard presence boundary", async () => {
  const server = await createServer({
    configFile: false,
    server: { middlewareMode: true },
    appType: "custom",
  });

  try {
    const { default: AnimatedWaveCircle } = await server.ssrLoadModule(
      "/src/features/dashboard/components/dashboard/daily-water/animated-wave-circle.tsx",
    );

    for (const progress of [0, 0.125, 0.5, 0.875, 1]) {
      const markup = renderToStaticMarkup(
        createElement(
          AnimatePresence,
          { initial: false },
          createElement(AnimatedWaveCircle, { progress }),
        ),
      );
      const groups = markup.match(/<g\b[^>]*>/g);
      assert.equal(groups?.length, 3);
      // A suppressed initial animation instead renders the LAST keyframes:
      // back = -200 and front = 0, leaving both infinite loops stopped.
      assert.match(groups![1], /transform:none;/);
      assert.match(groups![2], /transform:translateX\(-200px\);/);
      assert.equal(
        markup,
        renderToStaticMarkup(createElement(AnimatedWaveCircle, { progress })),
        "route presence must not change the wave's initial render",
      );
    }
  } finally {
    await server.close();
  }
});
