export async function register() {
  await import("@/config/env/server");
  if (process.env.NEXT_RUNTIME === "nodejs") {
    console.log("Node.js runtime");
  }

  if (process.env.NEXT_RUNTIME === "edge") {
    console.log("Edge runtime");
  }
}
