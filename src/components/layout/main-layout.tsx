import React from "react";

interface MainLayoutProps {
  children: React.ReactNode;
}

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <div className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="border-b border-border-primary sticky top-0 bg-background z-10">
        <div className="container mx-auto px-4 sm:px-6 py-3 sm:py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-xl sm:text-2xl font-bold">Algotrace</h1>
              <span className="text-xs text-text-tertiary border border-border-secondary px-2 py-0.5 rounded">
                BETA
              </span>
            </div>
            <div className="hidden sm:block text-sm text-text-secondary">
              AI-Powered Algorithm Visualization
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-4 sm:px-6 py-4 sm:py-6">
        {children}
      </main>

      {/* Footer - Mobile info */}
      <footer className="sm:hidden border-t border-border-primary mt-8">
        <div className="container mx-auto px-4 py-4 text-center">
          <p className="text-xs text-text-tertiary">
            AI-Powered Algorithm Visualization
          </p>
        </div>
      </footer>
    </div>
  );
};
