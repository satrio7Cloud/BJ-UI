import type { LucideIcon } from "lucide-react";

export type SettingsTabId = "office" | "shipping" | "preferences";

export interface SettingsTabItem {
    id: SettingsTabId;
    label: string;
    icon: LucideIcon;
    description?: string;
}

