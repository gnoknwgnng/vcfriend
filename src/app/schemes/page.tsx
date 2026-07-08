import fs from "fs";
import path from "path";
import { GovernmentSchemesClient } from "./GovernmentSchemesClient";

export const metadata = {
  title: "Government Schemes - VC Friend",
  description: "Search and discover central and state government funding schemes, grants, and support programs for Indian startups.",
};

export default async function GovernmentSchemesPage() {
  // Read schemes from the JSON file at build/request time
  const jsonPath = path.join(process.cwd(), "src/data/government-schemes.json");
  const rawData = fs.readFileSync(jsonPath, "utf8");
  const schemes = JSON.parse(rawData);

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-book-texture">
      <GovernmentSchemesClient schemes={schemes} />
    </main>
  );
}
