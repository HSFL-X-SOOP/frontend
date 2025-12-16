import { MarinaNameWithId } from '@/types/marina';
import { Router } from 'expo-router';
import { useMemo } from 'react';
import { SelectWithSheet } from '@/components/ui/SelectWithSheet';
import { Platform } from 'react-native';
import { ActionSheetSelect } from '@/components/ui/ActionSheetSelect';

interface NavigateDashboardDropdownMenuProps {
    router: Router;
    sensorLocations: MarinaNameWithId[];
    isDark?: boolean;
    selectedMarina: string;
    onSelectMarina?: (marinaName: string) => void;
}

export function NavigateDashboardDropdownMenu(props: NavigateDashboardDropdownMenuProps) {
    const {router, isDark, sensorLocations, selectedMarina, onSelectMarina} = props;

    const handleValueChange = (value: string) => {
        console.log('Selected marina:', value);
        if (onSelectMarina) {
            onSelectMarina(value);
        } else {
            router.push({ pathname: '/(dashboard)/marina/[name]', params: { name: value } });
        }
    };

    const locationOptions = useMemo(() =>
            sensorLocations.map(item => ({
                label: item.name,
                value: item.name
            })),
        [sensorLocations]
    );

    const mobileDropdown = (        
        <ActionSheetSelect
            items={locationOptions}
            value={selectedMarina}
            placeholder="Select Location"
            onChange={handleValueChange}
            />
        )
    const webDropdown = (
        <SelectWithSheet
            id="location-select"
            name="location"
            items={locationOptions}
            value={selectedMarina}
            onValueChange={handleValueChange}
            placeholder="Select Location"
        />
    )



    return Platform.OS === 'web' ? webDropdown : mobileDropdown;
}

