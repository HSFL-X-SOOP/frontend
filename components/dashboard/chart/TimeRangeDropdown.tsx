import {useTranslation} from "@/hooks/ui";
import {useMemo} from "react";
import {SelectWithSheet} from "@/components/ui/SelectWithSheet";
import type {SelectItem} from "@/types/select";
import { ActionSheetSelect } from "@/components/ui/ActionSheetSelect";
import { Platform } from "react-native";

export type ChartTimeRange =
    "today"
    | "24h"
    | "yesterday"
    | "last7days"
    | "last30days"
    | "last90days"
    | "last180days"
    | "last1year";

interface TimeRangeDropdownProps {
    selectedTimeRange: ChartTimeRange;
    setTimeRange: (range: ChartTimeRange) => void;
}

export function TimeRangeDropdown(props: TimeRangeDropdownProps) {
    const {selectedTimeRange, setTimeRange} = props;
    const {t} = useTranslation();

    const timeRangeOptions: SelectItem<ChartTimeRange>[] = useMemo(() => [
        {value: "today", label: t('dashboard.timeRange.todayButton')},
        {value: "yesterday", label: t('dashboard.timeRange.yesterdayButton')},
        {value: "last7days", label: t('dashboard.timeRange.last7daysButton')},
        {value: "last30days", label: t('dashboard.timeRange.last30daysButton')},
        {value: "last90days", label: t('dashboard.timeRange.last90daysButton')},
        {value: "last180days", label: t('dashboard.timeRange.last180daysButton')},
        {value: "last1year", label: t('dashboard.timeRange.last1yearButton')},
    ], [t]);

    const mobileDropdown = (
        <ActionSheetSelect
            items={timeRangeOptions}
            value={selectedTimeRange}
            placeholder={t('dashboard.timeRange.selectRange')}
            onChange={setTimeRange}
            />
    )

    const webDropdown = (
        <SelectWithSheet
            id="time-range-select"
            name="timeRange"
            items={timeRangeOptions}
            value={selectedTimeRange}
            onValueChange={setTimeRange}
            placeholder={t('dashboard.timeRange.selectRange')}
        />
    )

    return Platform.OS === 'web' ? webDropdown : mobileDropdown;
}
