import React from 'react';

interface SkeletonProps extends React.HTMLAttributes<HTMLDivElement> {
  className?: string;
}

/**
 * Base atomic Skeleton box with built-in shimmering wave animation.
 */
export const Skeleton: React.FC<SkeletonProps> = ({ className = '', ...props }) => {
  return (
    <div
      className={`bg-slate-200/80 rounded-md animate-shimmer ${className}`}
      {...props}
    />
  );
};

/**
 * Shimmer placeholder skeleton for public / explore listing cards.
 */
export const ListingCardSkeleton: React.FC = () => {
  return (
    <div className="flex flex-col bg-white rounded-2xl border border-slate-200/80 overflow-hidden shadow-xs h-full">
      {/* Image Skeleton */}
      <div className="relative h-48 w-full bg-slate-100 overflow-hidden">
        <Skeleton className="w-full h-full rounded-none" />
        {/* Type Badge */}
        <div className="absolute top-3 left-3">
          <Skeleton className="w-20 h-6 rounded-full" />
        </div>
      </div>

      {/* Content */}
      <div className="p-5 flex flex-col flex-grow space-y-3">
        {/* Title */}
        <Skeleton className="h-5 w-4/5 rounded" />
        
        {/* Location */}
        <div className="flex items-center gap-2">
          <Skeleton className="w-4 h-4 rounded-full shrink-0" />
          <Skeleton className="h-3.5 w-3/5 rounded" />
        </div>

        {/* Price info at bottom */}
        <div className="mt-auto pt-3 border-t border-slate-100 flex items-center justify-between">
          <Skeleton className="h-5 w-24 rounded" />
          <Skeleton className="h-4 w-12 rounded" />
        </div>
      </div>
    </div>
  );
};

/**
 * Shimmer placeholder grid for explore / public listings.
 */
export const ListingsGridSkeleton: React.FC<{ count?: number }> = ({ count = 8 }) => {
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ListingCardSkeleton key={`listing-skeleton-${i}`} />
      ))}
    </div>
  );
};

/**
 * Shimmer placeholder skeleton for Provider Listing management cards.
 */
export const ProviderListingCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs flex flex-col justify-between">
      <div>
        {/* Image Container */}
        <div className="h-48 bg-slate-100 relative overflow-hidden">
          <Skeleton className="w-full h-full rounded-none" />
          <div className="absolute top-3 right-3">
            <Skeleton className="w-20 h-6 rounded-full" />
          </div>
          <div className="absolute top-3 left-3">
            <Skeleton className="w-16 h-5 rounded-full" />
          </div>
        </div>

        {/* Content */}
        <div className="p-5">
          <Skeleton className="h-5 w-3/4 rounded mb-3" />
          
          <div className="flex items-center gap-2 mb-4">
            <Skeleton className="w-3.5 h-3.5 rounded-full shrink-0" />
            <Skeleton className="h-3.5 w-1/2 rounded" />
          </div>

          {/* Pricing Box */}
          <div className="bg-slate-50/90 rounded-xl p-3 border border-slate-100 mb-4 space-y-2">
            <div className="flex justify-between items-center">
              <Skeleton className="h-3.5 w-16 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
            <div className="flex justify-between items-center">
              <Skeleton className="h-3.5 w-14 rounded" />
              <Skeleton className="h-3.5 w-24 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="p-4 border-t border-slate-100 bg-slate-50/50 flex items-center justify-between gap-2">
        <Skeleton className="h-8 flex-1 rounded-full" />
        <Skeleton className="h-8 flex-1 rounded-full" />
        <Skeleton className="h-8 w-8 rounded-full shrink-0" />
      </div>
    </div>
  );
};

export const ProviderListingsGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProviderListingCardSkeleton key={`prov-listing-skeleton-${i}`} />
      ))}
    </div>
  );
};

/**
 * Shimmer placeholder skeleton for Provider Booking cards.
 */
export const ProviderBookingCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white p-5 sm:p-6 rounded-2xl border border-slate-200/90 shadow-xs flex flex-col justify-between">
      <div>
        {/* Header (Title & Status badge) */}
        <div className="flex justify-between items-start gap-2 mb-4">
          <Skeleton className="h-5 w-1/2 rounded" />
          <Skeleton className="h-6 w-24 rounded-full shrink-0" />
        </div>

        {/* Metadata Card */}
        <div className="space-y-3 mb-4 bg-slate-50/90 p-3.5 rounded-xl border border-slate-100">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-16 rounded" />
            <Skeleton className="h-3.5 w-28 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-14 rounded" />
            <Skeleton className="h-3.5 w-32 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-20 rounded" />
            <Skeleton className="h-3.5 w-24 rounded" />
          </div>
          <div className="flex items-center justify-between pt-2 border-t border-slate-200/70">
            <Skeleton className="h-4 w-20 rounded" />
            <Skeleton className="h-5 w-24 rounded" />
          </div>
        </div>

        {/* Customer Details */}
        <div className="space-y-2.5 mb-5 p-1">
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-16 rounded" />
            <Skeleton className="h-3.5 w-32 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-14 rounded" />
            <Skeleton className="h-3.5 w-40 rounded" />
          </div>
          <div className="flex items-center justify-between">
            <Skeleton className="h-3.5 w-14 rounded" />
            <Skeleton className="h-3.5 w-24 rounded" />
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="pt-3 border-t border-slate-100 flex gap-2">
        <Skeleton className="h-9 flex-1 rounded-full" />
        <Skeleton className="h-9 flex-1 rounded-full" />
      </div>
    </div>
  );
};

export const ProviderBookingsGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <ProviderBookingCardSkeleton key={`prov-booking-skeleton-${i}`} />
      ))}
    </div>
  );
};

/**
 * Shimmer placeholder skeleton for Customer Booking cards.
 */
export const CustomerBookingCardSkeleton: React.FC = () => {
  return (
    <div className="bg-white rounded-2xl border border-slate-200/80 shadow-xs overflow-hidden flex flex-col justify-between">
      <div>
        {/* Banner thumbnail */}
        <div className="h-40 bg-slate-100 relative overflow-hidden border-b border-slate-100">
          <Skeleton className="w-full h-full rounded-none" />
          <div className="absolute top-3 right-3">
            <Skeleton className="w-24 h-6 rounded-full" />
          </div>
          <div className="absolute top-3 left-3">
            <Skeleton className="w-16 h-5 rounded-full" />
          </div>
        </div>

        {/* Body */}
        <div className="p-5">
          <Skeleton className="h-5 w-3/4 rounded mb-2" />
          <Skeleton className="h-3.5 w-1/2 rounded mb-4" />

          {/* Slot info */}
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-100 space-y-2.5 mb-4">
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-14 rounded" />
              <Skeleton className="h-3.5 w-28 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-14 rounded" />
              <Skeleton className="h-3.5 w-32 rounded" />
            </div>
            <div className="flex items-center justify-between">
              <Skeleton className="h-3.5 w-20 rounded" />
              <Skeleton className="h-3.5 w-24 rounded" />
            </div>
            <div className="flex items-center justify-between pt-1.5 border-t border-slate-200/60">
              <Skeleton className="h-3.5 w-16 rounded" />
              <Skeleton className="h-4 w-20 rounded" />
            </div>
          </div>
        </div>
      </div>

      {/* Action Bar */}
      <div className="p-4 bg-slate-50/70 border-t border-slate-100 flex items-center justify-between">
        <Skeleton className="h-7 w-28 rounded-full" />
        <Skeleton className="h-7 w-24 rounded-full" />
      </div>
    </div>
  );
};

export const CustomerBookingsGridSkeleton: React.FC<{ count?: number }> = ({ count = 6 }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {Array.from({ length: count }).map((_, i) => (
        <CustomerBookingCardSkeleton key={`cust-booking-skeleton-${i}`} />
      ))}
    </div>
  );
};

/**
 * Shimmer placeholder skeleton for Listing Details page.
 */
export const ListingDetailsSkeleton: React.FC = () => {
  return (
    <div className="w-full max-w-[1440px] mx-auto px-4 py-8">
      {/* Top Title & Location */}
      <div className="space-y-3 mb-6">
        <Skeleton className="h-8 w-2/5 rounded-lg" />
        <Skeleton className="h-4 w-1/4 rounded" />
      </div>

      {/* Image Gallery */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4 h-[380px] sm:h-[460px] rounded-3xl overflow-hidden mb-10">
        <div className="md:col-span-2 h-full">
          <Skeleton className="w-full h-full rounded-none" />
        </div>
        <div className="hidden md:grid md:col-span-2 grid-cols-2 gap-4 h-full">
          <Skeleton className="w-full h-full rounded-none" />
          <Skeleton className="w-full h-full rounded-none" />
          <Skeleton className="w-full h-full rounded-none" />
          <Skeleton className="w-full h-full rounded-none" />
        </div>
      </div>

      {/* Main Grid: Details + Booking Sidebar */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
        {/* Left column */}
        <div className="lg:col-span-2 space-y-8">
          <div className="flex items-center gap-4 pb-6 border-b border-slate-200">
            <Skeleton className="w-14 h-14 rounded-full shrink-0" />
            <div className="space-y-2">
              <Skeleton className="h-5 w-48 rounded" />
              <Skeleton className="h-3.5 w-32 rounded" />
            </div>
          </div>

          <div className="space-y-3">
            <Skeleton className="h-6 w-36 rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-full rounded" />
            <Skeleton className="h-4 w-4/5 rounded" />
          </div>

          <div className="space-y-4 pt-6 border-t border-slate-200">
            <Skeleton className="h-6 w-40 rounded" />
            <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
              <Skeleton className="h-12 rounded-xl" />
            </div>
          </div>
        </div>

        {/* Right column: Booking card */}
        <div className="lg:col-span-1">
          <div className="bg-white border border-slate-200 rounded-3xl p-6 shadow-sm space-y-6 sticky top-24">
            <div className="flex justify-between items-center">
              <Skeleton className="h-7 w-28 rounded" />
              <Skeleton className="h-5 w-16 rounded-full" />
            </div>
            <Skeleton className="h-48 w-full rounded-2xl" />
            <Skeleton className="h-12 w-full rounded-full" />
          </div>
        </div>
      </div>
    </div>
  );
};

/**
 * Shimmer placeholder skeleton for Provider Dashboard.
 */
export const ProviderDashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-6">
      {/* Profile Banner */}
      <div className="bg-white rounded-2xl border border-slate-200/80 p-6 shadow-xs flex items-center gap-4">
        <Skeleton className="w-14 h-14 rounded-full shrink-0" />
        <div className="space-y-2 flex-1">
          <Skeleton className="h-5 w-48 rounded" />
          <Skeleton className="h-3.5 w-64 rounded" />
        </div>
      </div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {Array.from({ length: 3 }).map((_, i) => (
          <div key={`stat-skeleton-${i}`} className="bg-white p-5 rounded-2xl border border-slate-200/80 shadow-xs space-y-3">
            <div className="flex justify-between items-center">
              <Skeleton className="h-4 w-24 rounded" />
              <Skeleton className="w-8 h-8 rounded-xl shrink-0" />
            </div>
            <Skeleton className="h-7 w-32 rounded" />
            <Skeleton className="h-3 w-40 rounded" />
          </div>
        ))}
      </div>

      {/* 2-Column Schedule & Recent Requests */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <Skeleton className="h-5 w-36 rounded" />
            <Skeleton className="h-5 w-20 rounded-full" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`sched-skeleton-${i}`} className="p-3.5 bg-slate-50/80 rounded-xl border border-slate-100 flex items-center gap-3">
                <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                <div className="space-y-1.5 flex-1">
                  <Skeleton className="h-4 w-3/4 rounded" />
                  <Skeleton className="h-3 w-1/2 rounded" />
                </div>
              </div>
            ))}
          </div>
        </div>

        <div className="bg-white p-6 rounded-2xl border border-slate-200/80 shadow-xs space-y-4">
          <div className="flex justify-between items-center pb-2 border-b border-slate-100">
            <Skeleton className="h-5 w-40 rounded" />
            <Skeleton className="h-4 w-16 rounded" />
          </div>
          <div className="space-y-3">
            {Array.from({ length: 3 }).map((_, i) => (
              <div key={`recent-skeleton-${i}`} className="p-3 bg-slate-50/80 rounded-xl border border-slate-100 flex justify-between items-center">
                <div className="flex items-center gap-3 flex-1">
                  <Skeleton className="w-9 h-9 rounded-full shrink-0" />
                  <div className="space-y-1.5 flex-1">
                    <Skeleton className="h-4 w-3/5 rounded" />
                    <Skeleton className="h-3 w-2/5 rounded" />
                  </div>
                </div>
                <Skeleton className="h-5 w-20 rounded-full shrink-0" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

