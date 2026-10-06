// Runs before first paint, so styles that depend on JS apply without a flash.
document.documentElement.classList.add("js");
try {
  // Clear the old light/dark preference; the site is light only.
  localStorage.removeItem("veltra-theme");
} catch {
  /* Storage access may be blocked in private contexts. */
}
