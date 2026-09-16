import { runDailyBlogAgent } from "../src/lib/blog/agent";

const force = process.argv.includes("--force");

runDailyBlogAgent({ force })
  .then((r) => {
    console.log(JSON.stringify(r, null, 2));
  })
  .catch((e) => {
    console.error(e);
    process.exit(1);
  });
