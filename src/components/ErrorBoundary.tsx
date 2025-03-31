import { Component, ErrorInfo, ReactNode } from "react";
import { Button } from "@/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";

interface Props {
  children: ReactNode;
  fallbackRender?: (props: { error: Error; reset: () => void }) => ReactNode;
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
    console.error("ErrorBoundary caught:", error, errorInfo);
    console.error("Path:", window.location.pathname);
    console.error("Component Stack:", errorInfo.componentStack);
    this.setState({
      error: new Error(
        `Ocorreu um erro: ${error.message}\nLocal: ${window.location.pathname}`
      ),
    });

    // FIXME: enviar para serviço de monitoramento (Sentry, etc)
    // logErrorToService(error, errorInfo);
  }

  handleReset = () => {
    this.setState({ hasError: false, error: undefined });
  };

  render() {
    if (this.state.hasError) {
      if (this.props.fallbackRender) {
        return this.props.fallbackRender({
          error: this.state.error!,
          reset: this.handleReset,
        });
      }

      return (
        <div className="flex flex-col items-center justify-center min-h-screen p-4">
          <Alert variant="destructive" className="max-w-md">
            <AlertTitle>Algo deu errado</AlertTitle>
            <AlertDescription>
              {this.state.error?.message || "Ocorreu um erro inesperado"}
            </AlertDescription>
            <div className="mt-4">
              <Button
                variant="outline"
                onClick={this.handleReset}
                className="w-full"
              >
                Tentar novamente
              </Button>
            </div>
          </Alert>
        </div>
      );
    }

    return this.props.children;
  }
}

interface ErrorBoundaryWrapperProps {
  children: ReactNode;
  onReset?: () => void;
}

export const ErrorBoundaryWrapper = ({
  children,
  onReset,
}: ErrorBoundaryWrapperProps) => {
  const fallbackRender = ({
    error,
    reset,
  }: {
    error: Error;
    reset: () => void;
  }) => {
    const handleReset = () => {
      reset();
      onReset?.();
    };

    return (
      <div className="flex flex-col items-center justify-center min-h-screen p-4">
        <Alert variant="destructive" className="max-w-md">
          <AlertTitle>Erro crítico</AlertTitle>
          <AlertDescription>
            {error.message || "Ocorreu um erro inesperado"}
          </AlertDescription>
          <div className="mt-4">
            <Button onClick={handleReset} className="w-full">
              Recarregar aplicação
            </Button>
          </div>
        </Alert>
      </div>
    );
  };

  return (
    <ErrorBoundary fallbackRender={fallbackRender}>{children}</ErrorBoundary>
  );
};
