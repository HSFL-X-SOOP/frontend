import { MarinaNameWithId } from '@/types/marina';
import { ChevronDown } from '@tamagui/lucide-icons';
import { Router } from 'expo-router';
import { useMemo } from 'react';
import { SelectWithSheet } from '@/components/ui/SelectWithSheet';
import { SelectItem } from '@/types/select';

interface NavigateDashboardDropdownMenuProps {
    router: Router;
    sensorLocations: MarinaNameWithId[];
    isDark?: boolean;
    selectedMarina: string;
}

export function NavigateDashboardDropdownMenu(props: NavigateDashboardDropdownMenuProps) {
    const {router, isDark, sensorLocations, selectedMarina} = props;

    const handleValueChange = (value: string) => {
        router.push({ pathname: '/(dashboard)/marina/[name]', params: { name: value } });
    };

    const locationOptions: SelectItem<string>[] = useMemo(() =>
            sensorLocations.map(item => ({
                value: item.name,
                label: item.name
            })),
        [sensorLocations]
    );

    return (
        <SelectWithSheet
            id="location-select"
            name="location"
            items={locationOptions}
            value={selectedMarina}
            onValueChange={handleValueChange}
            placeholder="Select Location"
            triggerProps={{
                width: 280,
                iconAfter: ChevronDown,
                backgroundColor: isDark ? '$gray8' : '$gray2',
                borderColor: isDark ? '$gray7' : '$gray4'
            }}
        />
    );
}