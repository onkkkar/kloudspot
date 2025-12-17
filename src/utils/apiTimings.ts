// Simple API timing tracker
type TimingListener = (timings: ApiTiming[]) => void;

// Api timing type
export interface ApiTiming {
  name: string;
  duration: number;
  timestamp: number;
}

// Api timing tracker class
class ApiTimingTracker {
  private timings: ApiTiming[] = [];
  private listeners: Set<TimingListener> = new Set();

  // Record API timing
  record(name: string, duration: number) {
    const timing = { name, duration, timestamp: Date.now() };
    this.timings.push(timing);
    // Keep only last 10 timings
    if (this.timings.length > 10) {
      this.timings = this.timings.slice(-10);
    }
    this.notifyListeners();
  }

  // Get recent API timings
  getRecent(withinMs: number = 30000): ApiTiming[] {
    const cutoff = Date.now() - withinMs;
    return this.timings.filter((t) => t.timestamp > cutoff);
  }

  // Subscribe to API timing updates
  subscribe(listener: TimingListener): () => void {
    this.listeners.add(listener);
    return () => this.listeners.delete(listener);
  }

  // Notify listeners of API timing updates
  private notifyListeners() {
    const recent = this.getRecent();
    this.listeners.forEach((listener) => listener(recent));
  }

  // Clear API timings
  clear() {
    this.timings = [];
    this.notifyListeners();
  }
}

// Instance
export const apiTimingTracker = new ApiTimingTracker();
