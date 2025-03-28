import React, { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { useErrorStore } from "@/stores/errorStore";

interface Props {
  children: ReactNode;
  fallbackRender?: (error: Error) => ReactNode;
}

interface State {
  hasError: boolean;
  error?: Error;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    const setError = useErrorStore.getState().setError;
    setError({
      message: error.message,
      type: "error",
    });

    // FIXME Log de erro (ser substituído por serviço de monitoramento)
    console.error("Uncaught error:", error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
    useErrorStore.getState().clearError();
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallbackRender) {
        return this.props.fallbackRender(this.state.error!);
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertTitle>Erro Crítico</AlertTitle>
            <AlertDescription>
              {this.state.error?.message || "Erro inesperado"}
            </AlertDescription>
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={this.handleReset}
                className="w-full"
              >
                Recuperar
              </Button>
            </div>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

// Wrapper for hooks
export const ErrorBoundaryWrapper: React.FC<Props> = ({
  children,
  fallbackRender,
}) => {
  return (
    <ErrorBoundary fallbackRender={fallbackRender}>{children}</ErrorBoundary>
  );
};
