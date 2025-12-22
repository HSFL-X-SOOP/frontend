import DashboardScreen from "@/app/(dashboard)/marina/[name]";
import {useState, useEffect} from 'react';
import {useLocalSearchParams} from 'expo-router';

/**
 * Dashboard Tab - Manages marina selection without navigation
 * Supports receiving marina name via search params when navigating from sensor markers
 */
export default function DashboardTabScreen() {
    const {marina} = useLocalSearchParams<{marina?: string}>();
    const [selectedMarina, setSelectedMarina] = useState<string | undefined>(marina);

    // Update selected marina when navigating with a new marina param
    useEffect(() => {
        if (marina) {
            setSelectedMarina(marina);
        }
    }, [marina]);

    return (
        <DashboardScreen
            selectedMarinaName={selectedMarina}
            onSelectMarina={setSelectedMarina}
        />
    );
}
