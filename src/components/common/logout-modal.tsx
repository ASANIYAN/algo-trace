import React from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { BaseButton } from "./base-button";
import { useAuth } from "@/contexts/auth-contexts";
import { toast } from "sonner";

interface LogoutModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export const LogoutModal: React.FC<LogoutModalProps> = ({
  open,
  onOpenChange,
}) => {
  const { signOut, user } = useAuth();

  const handleSignOut = async () => {
    try {
      await signOut();
      toast.success("Successfully signed out!");
      onOpenChange(false);
    } catch (error) {
      toast.error("Failed to sign out. Please try again.");
      console.error("Sign out error:", error);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md shadow-2xl border border-primary">
        <DialogHeader>
          <DialogTitle className="text-text-primary">Sign Out</DialogTitle>
          <DialogDescription className="text-text-secondary">
            Are you sure you want to sign out of your account?
          </DialogDescription>
        </DialogHeader>

        {user?.email && (
          <div className="px-4 py-3 bg-background-secondary rounded-lg border border-border-secondary">
            <p className="text-sm text-text-secondary">
              Currently signed in as:
            </p>
            <p className="text-sm font-medium text-text-primary truncate">
              {user.email}
            </p>
          </div>
        )}

        <DialogFooter className="gap-3 sm:gap-2">
          <BaseButton
            variant="outline"
            onClick={() => onOpenChange(false)}
            className="flex-1 sm:flex-initial py-5 text-sm"
          >
            Cancel
          </BaseButton>
          <BaseButton
            variant="primary"
            onClick={handleSignOut}
            className="flex-1 sm:flex-initial bg-accent-red hover:bg-accent-red/90 border-accent-red py-5 text-sm"
          >
            Sign Out
          </BaseButton>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
};
