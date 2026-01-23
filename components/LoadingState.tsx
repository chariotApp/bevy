// src/components/balance/LoadingState.tsx
import { loadingStyles } from "@/styles/loading.styles";


interface LoadingStateProps {
  message?: string;
}

export function LoadingState({ message = "Loading..." }: LoadingStateProps) {
  return (
    <div style={loadingStyles.loadingContainer}>
      <div style={loadingStyles.loadingBox}>{message}</div>
    </div>
  );
}