export const businessTypes = [
  "Med spa / aesthetic clinic",
  "Salon / beauty business",
  "Gym / fitness studio",
  "Trades / home services",
  "Other service business",
];
export function validateInquiry(raw) {
  const data = {};
  const errors = {};
  const limits = {
    name: 100,
    email: 254,
    business: 150,
    businessType: 80,
    phone: 30,
    website: 300,
    challenge: 2000,
  };
  for (const [field, max] of Object.entries(limits)) {
    data[field] = typeof raw[field] === "string" ? raw[field].trim() : "";
    if (data[field].length > max)
      errors[field] = `Please use ${max} characters or fewer.`;
  }
  if (!data.name) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Please enter a valid email address.";
  if (!data.business) errors.business = "Please enter your business name.";
  if (!businessTypes.includes(data.businessType))
    errors.businessType = "Please choose your business type.";
  if (
    data.phone &&
    (!/^[+\d\s().-]+$/.test(data.phone) ||
      data.phone.replace(/\D/g, "").length < 7)
  )
    errors.phone = "Please enter a valid phone number, including country code.";
  if (data.website) {
    try {
      const url = new URL(
        /^https?:\/\//i.test(data.website)
          ? data.website
          : `https://${data.website}`,
      );
      if (
        !["https:", "http:"].includes(url.protocol) ||
        !url.hostname.includes(".") ||
        url.username ||
        url.password
      )
        throw new Error();
      data.website = url.href;
    } catch {
      errors.website = "Please enter a website like yourbusiness.com.";
    }
  }
  if (raw.consent !== true && raw.consent !== "on")
    errors.consent = "Please agree to being contacted about this request.";
  data.consent = raw.consent === true || raw.consent === "on";
  return { data, errors, valid: Object.keys(errors).length === 0 };
}
