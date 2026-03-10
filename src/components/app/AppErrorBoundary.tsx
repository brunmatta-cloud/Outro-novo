import React from 'react';

type Props = {
  children: React.ReactNode;
  title?: string;
  description?: string;
};

type State = {
  hasError: boolean;
};

class AppErrorBoundary extends React.Component<Props, State> {
  state: State = { hasError: false };

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Erro de renderizacao capturado pela AppErrorBoundary:', error, errorInfo);
  }

  handleRetry = () => {
    this.setState({ hasError: false });
  };

  render() {
    if (this.state.hasError) {
      return (
        <div className="glass-card p-6 sm:p-8">
          <div className="max-w-xl space-y-3">
            <h2 className="text-lg sm:text-xl font-display font-bold">
              {this.props.title || 'Nao foi possivel carregar esta tela'}
            </h2>
            <p className="text-sm text-muted-foreground">
              {this.props.description || 'Um erro inesperado foi interceptado antes de derrubar a aplicacao inteira.'}
            </p>
            <button
              type="button"
              onClick={this.handleRetry}
              className="px-4 py-2 rounded-lg bg-primary text-primary-foreground hover:bg-primary/90 transition-colors text-sm font-semibold"
            >
              Tentar novamente
            </button>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default AppErrorBoundary;
