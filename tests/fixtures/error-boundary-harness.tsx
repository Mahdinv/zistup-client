import { StrictMode, useState } from "react";
import { createRoot } from "react-dom/client";
import {
  createMemoryRouter,
  Link,
  Outlet,
  RouterProvider,
} from "react-router-dom";
import Providers from "../../src/app/providers";
import { withErrorBoundaries } from "../../src/app/route-error-boundary";
import ErrorBoundary from "../../src/shared/base-components/error-boundary";
import "../../src/index.css";

const scenario = new URLSearchParams(location.search).get("scenario");
let recovered = false;
let renderAttempts = 0;
Object.assign(window, {
  recoverRender: () => {
    recovered = true;
  },
  renderAttempts: () => renderAttempts,
});

function BrokenSection() {
  renderAttempts++;
  if (!recovered) throw new Error("Expected test render failure");
  return <p>Recovered section</p>;
}

function Shell() {
  const [count, setCount] = useState(0);
  return (
    <>
      <button onClick={() => setCount(count + 1)}>Unaffected {count}</button>
      <nav>
        <Link to="/broken">Broken page</Link>
        <Link to="/healthy">Healthy page</Link>
      </nav>
      <Outlet />
    </>
  );
}

const router = createMemoryRouter(
  withErrorBoundaries([
    {
      element: <Shell />,
      children: [
        { path: "/broken", element: <BrokenSection /> },
        { path: "/healthy", element: <p>Healthy content</p> },
        {
          path: "/loader",
          loader: () => {
            if (!recovered) throw new Error("Expected test loader failure");
            return null;
          },
          element: <p>Loader recovered</p>,
        },
      ],
    },
  ]),
  {
    initialEntries: [
      scenario === "loader"
        ? "/loader"
        : scenario === "optional"
          ? "/healthy"
          : "/broken",
    ],
  },
);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <Providers>
      {scenario === "root" ? (
        <BrokenSection />
      ) : (
        <RouterProvider router={router} />
      )}
      {scenario === "optional" && (
        <ErrorBoundary fallback={null}>
          <BrokenSection />
        </ErrorBoundary>
      )}
    </Providers>
  </StrictMode>,
);
