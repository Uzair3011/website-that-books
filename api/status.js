import { hasIntake } from "./inquiry.js";
export default function status(req, res) {
  res.setHeader("Cache-Control", "no-store");
  if (req.method !== "GET") {
    res.setHeader("Allow", "GET");
    return res.status(405).json({ message: "Method not allowed." });
  }
  return res.status(200).json({ intakeAvailable: hasIntake() });
}
