import React from "react";

export default function EyeIcon({ open }) {
  if (open) {
    return (
      <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
        <path d="M2 10s3-6 8-6 8 6 8 6-3 6-8 6-8-6-8-6Z" strokeLinecap="round" strokeLinejoin="round" />
        <circle cx="10" cy="10" r="2.5" />
      </svg>
    );
  }
  return (
    <svg width="18" height="18" viewBox="0 0 20 20" fill="none" stroke="currentColor" strokeWidth="1.6">
      <path d="M2.5 2.5l15 15" strokeLinecap="round" />
      <path d="M9.4 4.06A8.9 8.9 0 0110 4c5 0 8 6 8 6a13.6 13.6 0 01-2.36 3.15M6.1 5.6C3.6 7.05 2 10 2 10s3 6 8 6c1.06 0 2.03-.27 2.9-.7M8.1 8.1a2.5 2.5 0 003.6 3.5" strokeLinecap="round" strokeLinejoin="round" />
    </svg>
  );
}