export type InstallOutcome = "accepted" | "dismissed";

export type BeforeInstallPromptEvent = Event & {
  prompt: () => Promise<void>;

  userChoice: Promise<{
    outcome: InstallOutcome;
    platform: string;
  }>;
};

export type NavigatorWithStandalone = Navigator & {
  standalone?: boolean;
};

export type UsePwaInstallResult = {
  shouldShowPrompt: boolean;
  isIosOnly: boolean;
  install: () => Promise<void>;
  dismiss: () => void;
};
