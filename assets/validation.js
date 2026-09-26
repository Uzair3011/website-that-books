// Shared by the browser form, the form endpoints and the AI-agent lead endpoint, so every lead
// is checked and stored the same way wherever it comes from.
export const serviceOptions = [
  "Website Design",
  "Local SEO + Google Business Profile",
  "Landing Pages + CRO",
  "AI Receptionist + Website Chat",
  "CRM, Booking + Follow-up Automation",
  "Not sure yet",
];

// [country, dial code]. The first entry is the default for numbers typed without one.
export const dialCodes = [
  ["United Kingdom", "+44"],
  ["Ireland", "+353"],
  ["United States / Canada", "+1"],
  ["Australia", "+61"],
  ["New Zealand", "+64"],
  ["France", "+33"],
  ["Germany", "+49"],
  ["Spain", "+34"],
  ["Italy", "+39"],
  ["Netherlands", "+31"],
  ["Belgium", "+32"],
  ["Portugal", "+351"],
  ["Poland", "+48"],
  ["Sweden", "+46"],
  ["Norway", "+47"],
  ["Denmark", "+45"],
  ["Switzerland", "+41"],
  ["United Arab Emirates", "+971"],
  ["Saudi Arabia", "+966"],
  ["Qatar", "+974"],
  ["India", "+91"],
  ["Pakistan", "+92"],
  ["South Africa", "+27"],
  ["Nigeria", "+234"],
];
export const DEFAULT_DIAL_CODE = dialCodes[0][1];

// Returns the number in international E.164 form (+447123456789), or "" if it isn't a
// plausible phone number. A number typed with its own +code or 00 prefix keeps it; a local
// number ("07123 456789") gets the chosen dial code with its leading trunk 0 dropped.
export function normalizePhone(phone, dialCode = DEFAULT_DIAL_CODE) {
  // "(0)" is the UK habit of showing the trunk prefix inside an international number.
  const value = String(phone ?? "")
    .trim()
    .replace(/\(0\)/g, "");
  if (!value || !/^[+\d\s().-]+$/.test(value)) return "";
  const digits = value.replace(/\D/g, "");
  let international;
  if (value.startsWith("+")) international = digits;
  else if (digits.startsWith("00")) international = digits.slice(2);
  else {
    const code = dialCodes.some(([, dial]) => dial === dialCode)
      ? dialCode
      : DEFAULT_DIAL_CODE;
    international = code.slice(1) + digits.replace(/^0+/, "");
  }
  // A UK number never keeps its trunk 0 after +44 ("+44 07123…").
  international = international.replace(/^440/, "44");
  return /^[1-9]\d{7,14}$/.test(international) ? `+${international}` : "";
}

export function validateInquiry(raw) {
  const data = {};
  const errors = {};
  const limits = {
    name: 100,
    email: 254,
    phone: 30,
    business: 150,
    service: 100,
  };
  for (const [field, max] of Object.entries(limits)) {
    data[field] = typeof raw[field] === "string" ? raw[field].trim() : "";
    if (data[field].length > max)
      errors[field] = `Please use ${max} characters or fewer.`;
  }
  if (!data.name) errors.name = "Please enter your name.";
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(data.email))
    errors.email = "Please enter a valid email address.";
  if (!data.phone) errors.phone = "Please enter your phone number.";
  else if (!errors.phone) {
    const phone = normalizePhone(data.phone, raw.dialCode);
    if (phone) data.phone = phone;
    else errors.phone = "Please enter a valid phone number.";
  }
  if (data.service && !serviceOptions.includes(data.service))
    errors.service = "Please choose a service from the list.";
  if (raw.consent !== true && raw.consent !== "on")
    errors.consent = "Please agree to being contacted about this request.";
  data.consent = raw.consent === true || raw.consent === "on";
  return { data, errors, valid: Object.keys(errors).length === 0 };
}
