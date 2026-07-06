// ─── Token-bucket rate limiter (per IP) ──────────────────────────────────────

interface Bucket {
  tokens: number;
  lastRefill: number;
}

const CAPACITY = 30;   // max burst
const REFILL_RATE = 30; // tokens per minute

class RateLimiter {
  private buckets = new Map<string, Bucket>();

  isAllowed(ip: string): boolean {
    const now = Date.now();
    let bucket = this.buckets.get(ip);

    if (!bucket) {
      bucket = { tokens: CAPACITY - 1, lastRefill: now };
      this.buckets.set(ip, bucket);
      return true;
    }

    const elapsed = (now - bucket.lastRefill) / 60_000; // minutes
    bucket.tokens = Math.min(CAPACITY, bucket.tokens + elapsed * REFILL_RATE);
    bucket.lastRefill = now;

    if (bucket.tokens >= 1) {
      bucket.tokens -= 1;
      return true;
    }
    return false;
  }

  reset(ip: string): void {
    this.buckets.delete(ip);
  }
}

const globalForRL = globalThis as unknown as { _weatheropsRL?: RateLimiter };
if (!globalForRL._weatheropsRL) {
  globalForRL._weatheropsRL = new RateLimiter();
}

export const rateLimiter = globalForRL._weatheropsRL;
