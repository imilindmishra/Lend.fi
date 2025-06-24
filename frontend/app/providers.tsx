"use client" // Sabse zaroori line

import { Web3Provider } from "@/context/Web3Context";
import { ReactNode } from "react";

// Yeh component hamare saare client-side providers ko wrap karega
export function Providers({ children }: { children: ReactNode }) {
  return (
    <Web3Provider>
      {children}
    </Web3Provider>
  );
}
