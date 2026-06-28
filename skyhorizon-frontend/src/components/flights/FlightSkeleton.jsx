import { motion } from 'framer-motion';

export default function FlightSkeleton() {
  return (
    <div className="w-full flex flex-col gap-4">
      {[1, 2, 3].map((item) => (
        <div 
          key={item}
          className="w-full rounded-[24px] bg-navy-900/60 border border-white/5 p-6 relative overflow-hidden animate-pulse"
        >
          {/* Shimmer background */}
          <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full animate-[shimmer_1.5s_infinite]" />

          <div className="grid grid-cols-1 md:grid-cols-12 gap-6 items-center">
            {/* Logo and Name Skeleton */}
            <div className="md:col-span-3 flex items-center gap-3">
              <div className="w-12 h-12 rounded-xl bg-slate-800/80" />
              <div className="flex flex-col gap-2">
                <div className="h-4 w-32 bg-slate-800/80 rounded" />
                <div className="h-3 w-16 bg-slate-800/60 rounded" />
              </div>
            </div>

            {/* Time Timeline Skeleton */}
            <div className="md:col-span-5 flex items-center justify-between gap-4">
              <div className="flex flex-col gap-2">
                <div className="h-6 w-16 bg-slate-800/80 rounded" />
                <div className="h-3.5 w-10 bg-slate-800/60 rounded" />
              </div>
              <div className="flex-grow flex flex-col items-center px-4">
                <div className="h-2.5 w-12 bg-slate-800/60 rounded mb-2" />
                <div className="w-full h-[1px] bg-slate-800/60 relative">
                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-4 h-4 bg-slate-800 rounded-full" />
                </div>
                <div className="h-2.5 w-16 bg-slate-800/60 rounded mt-2" />
              </div>
              <div className="flex flex-col items-end gap-2">
                <div className="h-6 w-16 bg-slate-800/80 rounded" />
                <div className="h-3.5 w-10 bg-slate-800/60 rounded" />
              </div>
            </div>

            {/* Cabin/Gate/Terminal Skeleton */}
            <div className="md:col-span-2 flex flex-col items-center gap-1.5">
              <div className="h-3.5 w-20 bg-slate-800/60 rounded" />
              <div className="h-3 w-24 bg-slate-800/40 rounded" />
            </div>

            {/* Price / CTA Skeleton */}
            <div className="md:col-span-2 flex flex-row md:flex-col items-center justify-between md:items-end gap-3 pt-4 md:pt-0 border-t md:border-t-0 border-white/5 md:border-l md:border-white/5 md:pl-6">
              <div className="flex flex-col md:items-end gap-1.5">
                <div className="h-3 w-16 bg-slate-800/60 rounded" />
                <div className="h-6 w-24 bg-slate-800/80 rounded" />
              </div>
              <div className="h-10 w-28 bg-slate-800/80 rounded-full" />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
