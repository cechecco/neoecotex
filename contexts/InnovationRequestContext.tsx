"use client";

import { InnovationRequest } from "@/lib/types";
import { createContext, useContext, ReactNode, useState } from "react";

interface InnovationRequestContextType {
  request: InnovationRequest;
  setRequest: (request: InnovationRequest) => void;
}

const InnovationRequestContext = createContext<InnovationRequestContextType | undefined>(undefined);

export function InnovationRequestProvider({ 
  children, 
  initialRequest 
}: { 
  children: ReactNode;
  initialRequest: InnovationRequest;
}) {
  const [request, setRequest] = useState(initialRequest);

  return (
    <InnovationRequestContext.Provider value={{ request, setRequest }}>
      {children}
    </InnovationRequestContext.Provider>
  );
}

export function useInnovationRequest() {
  const context = useContext(InnovationRequestContext);
  if (context === undefined) {
    throw new Error('useInnovationRequest must be used within a InnovationRequestProvider');
  }
  return context;
} 