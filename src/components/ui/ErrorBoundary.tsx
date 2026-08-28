"use client";

import { Component, type ReactNode } from "react";

interface Props {
  children: ReactNode;
  fallback?: ReactNode;
}

interface State {
  hasError: boolean;
}

export class ErrorBoundary extends Component<Props, State> {
  constructor(props: Props) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(): State {
    return { hasError: true };
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback ?? (
          <div className="flex min-h-[40vh] items-center justify-center p-8 text-center">
            <div>
              <p className="text-sm text-white/60">
                Something went wrong loading this section.
              </p>
              <button
                onClick={() => this.setState({ hasError: false })}
                className="btn-ghost mt-4 text-xs"
              >
                Try again
              </button>
            </div>
          </div>
        )
      );
    }
    return this.props.children;
  }
}
