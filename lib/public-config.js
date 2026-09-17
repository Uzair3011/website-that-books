// Public, non-secret contact details sourced from environment variables at build time.
export function publicConfig(env = process.env) {
  const config = {
    bookingUrl: env.PUBLIC_BOOKING_URL || "",
    email: env.PUBLIC_CONTACT_EMAIL || "",
    phone: env.PUBLIC_CONTACT_PHONE || "",
    whatsapp: (env.PUBLIC_WHATSAPP_NUMBER || "").replace(/^\+/, ""),
  };
  const invalid = [];
  if (config.bookingUrl) {
    try {
      if (new URL(config.bookingUrl).protocol !== "https:") throw new Error();
    } catch {
      invalid.push("PUBLIC_BOOKING_URL must be an HTTPS URL.");
    }
  }
  if (config.email && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(config.email))
    invalid.push("PUBLIC_CONTACT_EMAIL must be an email address.");
  if (config.phone && !/^\+[\d\s().-]{7,25}$/.test(config.phone))
    invalid.push("PUBLIC_CONTACT_PHONE must start with + and a country code.");
  if (config.whatsapp && !/^\d{7,15}$/.test(config.whatsapp))
    invalid.push(
      "PUBLIC_WHATSAPP_NUMBER must be an international number, digits only.",
    );
  if (invalid.length) throw new Error(invalid.join(" "));
  return config;
}

export function renderConfigScript(env = process.env) {
  return `// Generated from PUBLIC_* environment variables. Never place secrets here.\nwindow.VELTRA_CONFIG = Object.freeze(${JSON.stringify(publicConfig(env))});\n`;
}
