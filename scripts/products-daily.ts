import { runDailyProductAgent } from "../src/lib/products/agent";

async function main() {
  const force = process.argv.includes("--force");
  const limitArg = process.argv.find((a) => a.startsWith("--limit="));
  const limit = limitArg ? Number(limitArg.split("=")[1]) : 20;
  const result = await runDailyProductAgent({ force, limit });
  console.log(JSON.stringify(result, null, 2));
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
