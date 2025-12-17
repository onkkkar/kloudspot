import { useState, useEffect, useRef } from "react";
import { X, CheckCircle, AlertTriangle, XCircle } from "lucide-react";

// Api Timing Interface
interface ApiTiming {
  name: string;
  duration: number;
}

// Api Performance Banner Props
interface ApiPerformanceBannerProps {
  timings: ApiTiming[];
  show: boolean;
}

// Get Performance Level
function getPerformanceLevel(avgMs: number) {
  if (avgMs < 5000) {
    return {
      level: "good",
      bgColor: "bg-green-50",
      borderColor: "border-green-200",
      textColor: "text-green-800",
      subTextColor: "text-green-700",
      hintColor: "text-green-600",
      iconColor: "text-green-600",
      Icon: CheckCircle,
      message: "Great performance!",
    };
  } else if (avgMs < 10000) {
    return {
      level: "moderate",
      bgColor: "bg-amber-50",
      borderColor: "border-amber-200",
      textColor: "text-amber-800",
      subTextColor: "text-amber-700",
      hintColor: "text-amber-600",
      iconColor: "text-amber-600",
      Icon: AlertTriangle,
      message: "Backend under moderate load",
    };
  } else {
    return {
      level: "slow",
      bgColor: "bg-red-50",
      borderColor: "border-red-200",
      textColor: "text-red-800",
      subTextColor: "text-red-700",
      hintColor: "text-red-600",
      iconColor: "text-red-600",
      Icon: XCircle,
      message: "Backend under heavy load !! Not frontend issue",
    };
  }
}

// Api Performance Banner Component
export function ApiPerformanceBanner({
  timings,
  show,
}: ApiPerformanceBannerProps) {
  const [dismissed, setDismissed] = useState(false);
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  // Visible state
  const visible = show && !dismissed && timings.length > 0;

  // Auto-dismiss after 5 seconds
  useEffect(() => {
    if (visible) {
      if (timerRef.current) clearTimeout(timerRef.current);
      timerRef.current = setTimeout(() => setDismissed(true), 5000);
      return () => {
        if (timerRef.current) clearTimeout(timerRef.current);
      };
    }
  }, [visible]);

  // If not visible, return null
  if (!visible) return null;

  // Calculate average time
  const avgTime = Math.round(
    timings.reduce((sum, t) => sum + t.duration, 0) / timings.length,
  );

  // Calculate max time
  const maxTime = Math.max(...timings.map((t) => t.duration));

  // Find slowest API
  const slowest = timings.find((t) => t.duration === maxTime);

  // Get performance level
  const perf = getPerformanceLevel(avgTime);
  const { Icon } = perf;

  return (
    // Api Performance Banner Container
    <div
      className={`animate-in slide-in-from-bottom-4 fixed right-4 bottom-4 z-50 max-w-sm rounded-lg border ${perf.borderColor} ${perf.bgColor} p-4 shadow-lg`}
    >
      {/* Close Button */}
      <button
        onClick={() => setDismissed(true)}
        className={`absolute top-2 right-2 ${perf.iconColor} hover:opacity-70`}
      >
        <X className="h-4 w-4" />
      </button>

      {/* Api Performance Details */}
      <div className="flex items-start gap-3">
        <Icon className={`mt-0.5 h-5 w-5 shrink-0 ${perf.iconColor}`} />
        <div className="text-sm">
          <p className={`font-medium ${perf.textColor}`}>
            Server Response Time
          </p>
          <p className={`mt-1 ${perf.subTextColor}`}>
            Avg:{" "}
            <span className="font-semibold">
              {(avgTime / 1000).toFixed(1)}s
            </span>
            {slowest && (
              <>
                {" "}
                · Slowest: {slowest.name} ({(maxTime / 1000).toFixed(1)}s)
              </>
            )}
          </p>
          <p className={`mt-1 text-xs ${perf.hintColor}`}>{perf.message}</p>
        </div>
      </div>
    </div>
  );
}
