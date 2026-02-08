import React from "react";

interface AuthLayoutProps {
  children: React.ReactNode;
  title: string;
  subtitle?: string;
}

export const AuthLayout: React.FC<AuthLayoutProps> = ({
  children,
  title,
  subtitle,
}) => {
  return (
    <section className="min-h-screen bg-background flex items-center justify-center px-2.5 md:px-4">
      <div className="w-full max-w-md">
        {/* Logo/Brand */}
        <div className="text-center mb-8">
          <h1 className="text-3xl font-bold text-text-primary mb-2">
            Algotrace
          </h1>
          <div className="inline-block px-2 py-0.5 text-xs text-text-tertiary border border-border-secondary rounded">
            BETA
          </div>
        </div>

        {/* Auth Card */}
        <div className="bg-background-secondary border border-border-primary rounded-lg p-4 md:p-8">
          <div className="mb-6">
            <h2 className="text-2xl font-semibold text-text-primary mb-2">
              {title}
            </h2>
            {subtitle && (
              <p className="text-sm text-text-secondary">{subtitle}</p>
            )}
          </div>
          {children}
        </div>

        {/* Footer */}
        <p className="text-center text-sm text-text-tertiary mt-6">
          AI-Powered Algorithm Visualization
        </p>
      </div>
    </section>
  );
};
