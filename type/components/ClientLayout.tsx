"use client";

import { useState, useEffect } from "react";

export default function ClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoading(false);
    }, 1200);

    return () => clearTimeout(timer);
  }, []);

  if (isLoading) {
    return (
      <div className="fixed inset-0 flex items-center justify-center bg-white z-50">
        <div className="flex flex-col items-center">
          {/* Three bouncing balls */}
          <div className="flex space-x-3">
            <div className="w-6 h-6 bg-gray-800 rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0s]"></div>
            <div className="w-6 h-6 bg-gray-800 rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.2s]"></div>
            <div className="w-6 h-6 bg-gray-800 rounded-full animate-[bounce_0.6s_ease-in-out_infinite_0.4s]"></div>
          </div>

          <p className="mt-6 text-lg font-semibold text-gray-700">
            Loading Typing Master...
          </p>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}
