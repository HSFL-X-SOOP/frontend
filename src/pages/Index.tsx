// src/pages/IndexPage.tsx
import DefaultLayout from "@/layouts/DefaultLayout";
import {NavItems} from "@/types";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    DrawerFooter,
    Button,
    useDisclosure,
    Tooltip,
    Select,
    SelectItem,
    Checkbox
} from "@heroui/react";
import {FilterIcon} from "@/components/Icons.tsx";
import {useState} from "react";
import {Input} from "@heroui/input";

export default function IndexPage() {
    const lat = 54.32829139396176;
    const lon = 10.179455986018528;
    const {isOpen, onOpen, onOpenChange} = useDisclosure();
    const [waveMin, setWaveMin] = useState<string>("");
    const [waveMax, setWaveMax] = useState<string>("");
    const [windDirs, setWindDirs] = useState<Set<string>>(new Set());
    const [depthMin, setDepthMin] = useState<string>("");
    const [depthMax, setDepthMax] = useState<string>("");
    const [visibilityLevel, setVisibilityLevel] = useState<string>("");
    const [tideOptions, setTideOptions] = useState<Set<string>>(new Set());
    const [salinityMin, setSalinityMin] = useState<string>("");
    const [salinityMax, setSalinityMax] = useState<string>("");
    const [precipLevel, setPrecipLevel] = useState<string>("");
    const [dateFocus, setDateFocus] = useState<string>("");
    const [hazardZones, setHazardZones] = useState<Set<string>>(new Set());
    const [uvLevel, setUvLevel] = useState<string>("");

    return (
        <DefaultLayout activeItem={NavItems.MAP}>
            <div className="h-[calc(100vh-65px)] relative">
                <iframe
                    title="OpenStreetMap"
                    className="w-full h-full"
                    loading="lazy"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.1}%2C${lat - 0.05}%2C${lon + 0.1}%2C${lat + 0.05}&layer=mapnik&marker=${lat}%2C${lon}`}
                />


                <Button className={"absolute bottom-10 right-5"} onPress={onOpen} size={"lg"} variant={"shadow"}
                        color={"secondary"} radius={"full"}
                        isIconOnly>
                    <FilterIcon size={25}/>
                </Button>

                <Drawer isOpen={isOpen} size={"xl"} className={"bg-content2"} onOpenChange={onOpenChange}>
                    <DrawerContent className="overflow-visible">
                        {(onClose) => (
                            <>
                                <DrawerHeader
                                    className=" top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50 justify-between  backdrop-blur-lg">
                                    <Tooltip content="Schließen">
                                        <Button
                                            isIconOnly
                                            className="text-default-400"
                                            size="sm"
                                            variant="bordered"
                                            radius="full"
                                            onPress={onClose}
                                        >
                                            <svg
                                                fill="none"
                                                height="20"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className={"text-secondary dark:text-primary"}
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                                width="20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="m13 17 5-5-5-5M6 17l5-5-5-5"/>
                                            </svg>
                                        </Button>
                                    </Tooltip>
                                </DrawerHeader>
                                <DrawerBody className="space-y-4 p-4 overflow-visible">
                                    <div className="flex gap-2">
                                        <Input
                                            label="Wellenhöhe von (m)"
                                            type="number"
                                            value={waveMin}
                                            onChange={(e) => setWaveMin(e.target.value)}
                                            className="w-24"
                                        />
                                        <Input
                                            label="bis (m)"
                                            type="number"
                                            value={waveMax}
                                            onChange={(e) => setWaveMax(e.target.value)}
                                            className="w-24"
                                        />
                                    </div>

                                    <Select
                                        label="Windrichtung"
                                        placeholder="Richtungen auswählen"
                                        isMultiline
                                        selectionMode="multiple"
                                        selectedKeys={windDirs}
                                        onSelectionChange={(keys) => setWindDirs(new Set(keys as unknown as string[]))}
                                    >
                                        <SelectItem key="N">N</SelectItem>
                                        <SelectItem key="S">S</SelectItem>
                                        <SelectItem key="E">E</SelectItem>
                                        <SelectItem key="W">W</SelectItem>
                                    </Select>

                                    <div className="flex gap-2">
                                        <Input
                                            label="Tiefe mind. (m)"
                                            type="number"
                                            value={depthMin}
                                            onChange={(e) => setDepthMin(e.target.value)}
                                            className="w-24"
                                        />
                                        <Input
                                            label="max. (m)"
                                            type="number"
                                            value={depthMax}
                                            onChange={(e) => setDepthMax(e.target.value)}
                                            className="w-24"
                                        />
                                    </div>

                                    <Select
                                        label="Sichtweite"
                                        placeholder="Auswählen"
                                        selectedKeys={new Set([visibilityLevel])}
                                        onSelectionChange={(keys) => setVisibilityLevel(Array.from(keys)[0] as string)}
                                    >
                                        <SelectItem key="<5">&lt; 5 m</SelectItem>
                                        <SelectItem key="5-10">5–10 m</SelectItem>
                                        <SelectItem key=">10">&gt; 10 m</SelectItem>
                                    </Select>

                                    <div className="flex flex-wrap gap-2">
                                        {["Hochwasser", "Niedrigwasser", "Flut", "Ebbe"].map((t) => (
                                            <Checkbox
                                                key={t}
                                                checked={tideOptions.has(t)}
                                                onChange={() => {
                                                    const s = new Set(tideOptions);
                                                    s.has(t) ? s.delete(t) : s.add(t);
                                                    setTideOptions(s);
                                                }}
                                            >
                                                {t}
                                            </Checkbox>
                                        ))}
                                    </div>

                                    <div className="flex gap-2">
                                        <Input
                                            label="Salzgehalt min (‰)"
                                            type="number"
                                            value={salinityMin}
                                            onChange={(e) => setSalinityMin(e.target.value)}
                                            className="w-24"
                                        />
                                        <Input
                                            label="max (‰)"
                                            type="number"
                                            value={salinityMax}
                                            onChange={(e) => setSalinityMax(e.target.value)}
                                            className="w-24"
                                        />
                                    </div>

                                    <Select
                                        label="Regen-Wahrscheinlichkeit"
                                        placeholder="Auswählen"
                                        selectedKeys={new Set([precipLevel])}
                                        onSelectionChange={(keys) => setPrecipLevel(Array.from(keys)[0] as string)}
                                    >
                                        <SelectItem key="<20">&lt; 20 %</SelectItem>
                                        <SelectItem key="20-50">20–50 %</SelectItem>
                                        <SelectItem key=">50">&gt; 50 %</SelectItem>
                                    </Select>

                                    <Input
                                        label="Datum"
                                        type="date"
                                        value={dateFocus}
                                        onChange={(e) => setDateFocus(e.target.value)}
                                    />

                                    <div className="flex flex-wrap gap-2">
                                        {[
                                            {key: "quallen", label: "Quallen"},
                                            {key: "stroemung", label: "Strömung"},
                                            {key: "riff", label: "Riff"},
                                        ].map((hz) => {
                                            const sel = hazardZones.has(hz.key);
                                            return (
                                                <Button
                                                    key={hz.key}
                                                    variant={sel ? "shadow" : "bordered"}
                                                    onPress={() => {
                                                        const s = new Set(hazardZones);
                                                        s.has(hz.key) ? s.delete(hz.key) : s.add(hz.key);
                                                        setHazardZones(s);
                                                    }}
                                                >
                                                    {hz.label}
                                                </Button>
                                            );
                                        })}
                                    </div>

                                    <Select
                                        label="UV-Index"
                                        placeholder="Auswählen"
                                        selectedKeys={new Set([uvLevel])}
                                        onSelectionChange={(keys) => setUvLevel(Array.from(keys)[0] as string)}
                                    >
                                        <SelectItem key="niedrig">Niedrig</SelectItem>
                                        <SelectItem key="mittel">Mittel</SelectItem>
                                        <SelectItem key="hoch">Hoch</SelectItem>
                                    </Select>
                                </DrawerBody>
                                <DrawerFooter>
                                    <Button color="danger" variant="light" onPress={onClose}>
                                        Abbrechen
                                    </Button>
                                    <Button color="primary" onPress={onClose}>
                                        Speichern
                                    </Button>
                                </DrawerFooter>
                            </>
                        )}
                    </DrawerContent>
                </Drawer>
            </div>
        </DefaultLayout>
    );
}