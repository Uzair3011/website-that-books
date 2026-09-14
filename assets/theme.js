// Run before first paint; storage access may be blocked in private contexts.
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
