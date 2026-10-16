import React, { Component, ErrorInfo, ReactNode } from 'react';
import { AlertTriangle, RotateCcw, X } from 'lucide-react';
import { SoundManager } from './SoundManager';

interface Props {
  children: ReactNode;
  onClose?: () => void;
  onRetry?: () => void;
  title?: string;
  description?: string;
}

interface State {
  hasError: boolean;
  error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
  public state: State = {
    hasError: false,
    error: null,
  };

  public static getDerivedStateFromError(error: Error): State {
    return { hasError: true, error };
  }

  public componentDidCatch(error: Error, _errorInfo: ErrorInfo) {
    console.warn('[ErrorBoundary] Ошибка в компоненте окна:', error?.message || error);
    const errMessage = String(error?.message || '');
    if (
      errMessage.includes('dynamically imported module') ||
      errMessage.includes('Failed to fetch dynamically imported module') ||
      errMessage.includes('Importing a module script failed')
    ) {
      try {
        const lastReload = sessionStorage.getItem('last_chunk_reload');
        const now = Date.now();
        if (!lastReload || now - Number(lastReload) > 8000) {
          sessionStorage.setItem('last_chunk_reload', String(now));
          window.location.reload();
        }
      } catch {}
    }
  }

  private handleRetry = () => {
    try {
      SoundManager.playClick();
    } catch {}
    const errMessage = String(this.state.error?.message || '');
    if (
      errMessage.includes('dynamically imported module') ||
      errMessage.includes('Failed to fetch dynamically imported module') ||
      errMessage.includes('Importing a module script failed')
    ) {
      window.location.reload();
      return;
    }
    this.setState({ hasError: false, error: null });
    if (this.props.onRetry) {
      this.props.onRetry();
    }
  };

  private handleClose = () => {
    try {
      SoundManager.playClick();
    } catch {}
    this.setState({ hasError: false, error: null });
    if (this.props.onClose) {
      this.props.onClose();
    }
  };

  public render() {
    if (this.state.hasError) {
      return (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn select-none">
          <div
            className="w-full max-w-md p-6 rounded-2xl bg-[#0F0C14] border border-[#8A6B3A]/60 flex flex-col items-center text-center shadow-2xl relative text-left"
            style={{
              boxShadow: 'inset 0 0 0 1px #3A2E1D, 0 20px 50px rgba(0, 0, 0, 0.95)',
            }}
          >
            {/* Brass corner brackets */}
            <div className="absolute top-1 left-1 w-2.5 h-2.5 border-t border-l border-[#C9A55C] pointer-events-none" />
            <div className="absolute top-1 right-1 w-2.5 h-2.5 border-t border-r border-[#C9A55C] pointer-events-none" />
            <div className="absolute bottom-1 left-1 w-2.5 h-2.5 border-b border-l border-[#C9A55C] pointer-events-none" />
            <div className="absolute bottom-1 right-1 w-2.5 h-2.5 border-b border-r border-[#C9A55C] pointer-events-none" />

            <div className="w-12 h-12 rounded-full bg-[#2A1717] border border-[#A83232]/60 flex items-center justify-center text-[#E5484D] mb-3.5 shadow-inner">
              <AlertTriangle className="w-6 h-6" />
            </div>

            <h3 className="text-lg font-heading font-bold text-[#EDE3CB] tracking-wide mb-1.5 text-center">
              {this.props.title || 'Что-то пошло не так'}
            </h3>

            <p className="text-xs text-[#BAAC93] font-prose leading-relaxed mb-5 max-w-xs text-center">
              {this.props.description ||
                'Произошла неожиданная заминка при открытии окна. Вы можете повторить попытку или закрыть окно и продолжить игру.'}
            </p>

            <div className="flex items-center justify-center gap-3 w-full">
              <button
                type="button"
                onClick={this.handleClose}
                className="flex-1 px-4 py-2 rounded-sm bg-[#14101A] hover:bg-[#1E1826] text-[#BAAC93] hover:text-[#EDE3CB] border border-[#3A2E1D] text-xs font-heading font-medium tracking-wide transition flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <X className="w-4 h-4" />
                Закрыть
              </button>

              <button
                type="button"
                onClick={this.handleRetry}
                className="flex-1 px-4 py-2 rounded-sm bg-[#2A1F13] hover:bg-[#3D2C1B] text-[#EDE3CB] hover:text-[#FFF1C5] border border-[#C9A55C] text-xs font-heading font-semibold tracking-wide transition flex items-center justify-center gap-1.5 shadow-md cursor-pointer"
              >
                <RotateCcw className="w-4 h-4 text-[#E8CF8A]" />
                Повторить
              </button>
            </div>
          </div>
        </div>
      );
    }

    return this.props.children;
  }
}

export default ErrorBoundary;
