import DashboardScreen from "@/app/(dashboard)/marina/[name]";
import {useState} from 'react';

/**
 * Dashboard Tab - Manages marina selection without navigation
 */
export default function DashboardTabScreen() {
    const [selectedMarina, setSelectedMarina] = useState<string>();

    return (
        <DashboardScreen
            key={selectedMarina} // Force remount when marina changes
            selectedMarinaName={selectedMarina}
            onSelectMarina={setSelectedMarina}
        />
    );
}
