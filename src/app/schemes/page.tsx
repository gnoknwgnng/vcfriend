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

  // Generate top 15 schemes for structured data indexing
  const topSchemes = schemes.slice(0, 15).map((scheme: any, idx: number) => ({
    "@type": "ListItem",
    "position": idx + 1,
    "name": scheme.name,
    "description": scheme.description || "",
    "url": scheme.link || "https://www.vcfriend.online/schemes"
  }));

  const schemaMarkup = {
    "@context": "https://schema.org",
    "@type": "ItemList",
    "name": "Indian Government Schemes & Startup Grants Database",
    "description": "A searchable directory of 220+ central and state government funding schemes and grants for Indian startups.",
    "url": "https://www.vcfriend.online/schemes",
    "numberOfItems": schemes.length,
    "itemListElement": topSchemes
  };

  return (
    <main className="flex-1 flex flex-col min-h-screen bg-book-texture">
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schemaMarkup) }}
      />
      <GovernmentSchemesClient schemes={schemes} />
    </main>
  );
}
