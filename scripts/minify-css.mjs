// A deliberately small CSS minifier for the build: drops comments and
// collapses whitespace, and changes nothing else. Strings are copied as they
// are, and spaces inside values (calc(a + b), grid-template-areas) are kept as
// single spaces, so the minified sheet means exactly what the source does.
export function minifyCss(source) {
  let out = "";
  let pendingSpace = false;
  for (let i = 0; i < source.length; i++) {
    const char = source[i];
    if (char === "/" && source[i + 1] === "*") {
      const end = source.indexOf("*/", i + 2);
      i = end === -1 ? source.length : end + 1;
      pendingSpace = true;
      continue;
    }
    if (/\s/.test(char)) {
      pendingSpace = true;
      continue;
    }
    // Whitespace beside these never carries meaning; elsewhere it may
    // (descendant selectors, values), so one space is kept.
    if (pendingSpace && out && !/[{};,]$/.test(out) && !"{};,".includes(char))
      out += " ";
    pendingSpace = false;
    if (char === '"' || char === "'") {
      let end = i + 1;
      while (end < source.length && source[end] !== char)
        end += source[end] === "\\" ? 2 : 1;
      out += source.slice(i, end + 1);
      i = end;
      continue;
    }
    // The last declaration in a block needs no semicolon.
    if (char === "}" && out.endsWith(";")) out = out.slice(0, -1);
    out += char;
  }
  return out;
}
