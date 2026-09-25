// Runs before first paint. Storage access may be blocked in private contexts.
document.documentElement.classList.add("js");
try {
  const saved = localStorage.getItem("veltra-theme");
  if (
    saved === "dark" ||
    (!saved && matchMedia("(prefers-color-scheme: dark)").matches)
  ) {
    document.documentElement.classList.add("dark-mode");
  }
} catch {
  /* The default light theme works without storage. */
}
