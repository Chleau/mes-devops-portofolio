export async function register() {
  if (process.env.NEXT_RUNTIME === 'nodejs') {
    // Only load the SDK on the server side
    await import('./instrumentation.node');
  }
}
