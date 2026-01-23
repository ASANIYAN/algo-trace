import React from "react";

type MainLayoutProps = {
  children: React.ReactNode;
};

export const MainLayout: React.FC<MainLayoutProps> = ({ children }) => {
  return (
    <section className="min-h-screen bg-background text-text-primary">
      {/* Header */}
      <header className="border-b border-border-primary">
        <section className="container mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-2">
              <h1 className="text-2xl font-bold">Algotrace</h1>
              <span className="text-xs text-text-tertiary border border-border-secondary px-2 py-0.5 rounded">
                BETA
              </span>
            </div>
            <div className="text-sm text-text-secondary">
              AI-Powered Algorithm Visualization
            </div>
          </div>
        </section>
      </header>

      {/* Main Content */}
      <main className="container mx-auto px-6 py-6">{children}</main>
    </section>
  );
};
