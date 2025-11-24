/**
 * Error Boundary Component
 * Catches rendering errors and displays fallback UI
 */

import React, { Component, ReactNode } from 'react';

interface Props {
    children: ReactNode;
    fallback?: ReactNode;
}

interface State {
    hasError: boolean;
    error: Error | null;
}

export class ErrorBoundary extends Component<Props, State> {
    constructor(props: Props) {
        super(props);
        this.state = { hasError: false, error: null };
    }

    static getDerivedStateFromError(error: Error): State {
        return { hasError: true, error };
    }

    componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
        console.error('Error caught by boundary:', error, errorInfo);
        // In production, you would send this to an error tracking service
    }

    handleReset = () => {
        this.setState({ hasError: false, error: null });
    };

    render() {
        if (this.state.hasError) {
            if (this.props.fallback) {
                return this.props.fallback;
            }

            return (
                <div className="min-h-screen flex items-center justify-center bg-background-cream p-4">
                    <div className="max-w-md w-full bg-white rounded-lg shadow-lg p-8 text-center">
                        <div className="mb-4">
                            <svg
                                className="mx-auto h-16 w-16 text-red-500"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    strokeWidth={2}
                                    d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z"
                                />
                            </svg>
                        </div>
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Oops! Something went wrong
                        </h2>
                        <p className="text-gray-600 mb-6">
                            We're sorry, but something unexpected happened. Please try refreshing the page.
                        </p>
                        {this.state.error && (
                            <details className="mb-6 text-left">
                                <summary className="cursor-pointer text-sm text-gray-500 hover:text-gray-700">
                                    Error details
                                </summary>
                                <pre className="mt-2 text-xs bg-gray-100 p-3 rounded overflow-auto">
                                    {this.state.error.toString()}
                                </pre>
                            </details>
                        )}
                        <div className="flex gap-4 justify-center">
                            <button
                                onClick={this.handleReset}
                                className="px-6 py-2 bg-primary-teal text-white rounded-full hover:bg-opacity-90 transition-colors"
                            >
                                Try Again
                            </button>
                            <button
                                onClick={() => window.location.href = '/'}
                                className="px-6 py-2 bg-gray-200 text-gray-700 rounded-full hover:bg-gray-300 transition-colors"
                            >
                                Go Home
                            </button>
                        </div>
                    </div>
                </div>
            );
        }

        return this.props.children;
    }
}
