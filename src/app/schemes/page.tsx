import fs from "fs";
import path from "path";
import { GovernmentSchemesClient } from "./GovernmentSchemesClient";

export const metadata = {
  title: "Government Funding & Schemes for Startups - VC Friend",
  description: "Search and discover 220+ central and state government funding schemes, startup grants, MSME loans, and support programs for Indian entrepreneurs.",
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
