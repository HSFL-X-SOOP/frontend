// src/pages/Profile.tsx
import {useState} from "react";
import DefaultLayout from "@/layouts/DefaultLayout";
import {NavItems} from "@/types";
import ProfilePic from "@/assets/profile.jpg";

import {Card, CardHeader, CardBody} from "@heroui/card";
import {Input} from "@heroui/input";
import {Button} from "@heroui/button";
import {Select, SelectItem, Avatar, Chip, Selection, SelectedItems} from "@heroui/react";
import {Tabs, Tab} from "@heroui/tabs";

// Filter-Optionen für die Karte
interface FilterOption {
    key: string;
    label: string;
}

const filterOptions: FilterOption[] = [
    {key: "windStrength", label: "Windstärke"},
    {key: "windDirection", label: "Windrichtung"},
    {key: "waveHeight", label: "Wellenhöhe"},
    {key: "waterDepth", label: "Wassertiefe"},
    {key: "waterTemp", label: "Wassertemperatur"},
    {key: "waterLevel", label: "Wasserstand"},
    {key: "visibility", label: "Sichtweite"},
    {key: "tide", label: "Gezeiten"},
    {key: "salinity", label: "Salzgehalt"},
    {key: "precipitation", label: "Niederschlagswahrscheinlichkeit"},
    {key: "dateFocus", label: "Zeitfokus"},
    {key: "hazardZones", label: "Gefahrenzonen"},
    {key: "uvIndex", label: "UV-Index"},
];


export function Profile() {
    const [name, setName] = useState<string>("");
    const [email, setEmail] = useState<string>("");
    const [profileType, setProfileType] = useState<"Schwimmer" | "Segler">("Schwimmer");

    // Segler-spezifische States
    const [boatName, setBoatName] = useState<string>("");
    const [boatModel, setBoatModel] = useState<string>("");
    const [boatSize, setBoatSize] = useState<string>("");
    const [boatCapacity, setBoatCapacity] = useState<string>("");
    const [dockingFrequency, setDockingFrequency] = useState<string>("");
    const [standardHarbor, setStandardHarbor] = useState<string>("");

    const [selectedFilters, setSelectedFilters] = useState<Selection>(new Set());

    const handleSave = () => {
        const payload: Record<string, any> = {name, email, profileType};
        if (profileType === "Segler") {
            Object.assign(payload, {boatName, boatModel, boatSize, boatCapacity, dockingFrequency, standardHarbor});
        }
        payload.filters = Array.from(selectedFilters);
        console.log(payload);
        alert("Profil gespeichert! (Konsole prüfen)");
    };

    return (
        <DefaultLayout activeItem={NavItems.NAV2}>
            <div className="w-screen h-[calc(100vh-65px)] flex items-start justify-center bg-content1 p-4">
                <Card className="w-full dark:bg-content2 h-full">
                    <CardHeader>
                        <h2 className="text-2xl font-bold">Mein Profil</h2>
                    </CardHeader>
                    <CardBody>
                        <Tabs defaultSelectedKey="general" variant={"solid"} color={"secondary"}
                              classNames={{base: 'w-full'}}>

                            <Tab key="general" title="Allgemeine Daten">
                                <div className="space-y-4">
                                    <div className="flex justify-center">
                                        <Avatar
                                            src={ProfilePic}
                                            size="lg"
                                            isBordered
                                            className="transition-transform hover:scale-105"
                                        />
                                    </div>
                                    <Input
                                        label="Name"
                                        placeholder="Dein Name"
                                        value={name}
                                        onChange={(e) => setName(e.target.value)}
                                    />
                                    <Input
                                        label="E-Mail"
                                        type="email"
                                        placeholder="beispiel@domain.de"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                    />
                                    <Select
                                        label="Profil-Typ"
                                        placeholder="Typ auswählen"
                                        selectedKeys={new Set([profileType])}
                                        onSelectionChange={(keys) => {
                                            const [key] = Array.from(keys) as ["Schwimmer" | "Segler"];
                                            setProfileType(key);
                                        }}
                                    >
                                        <SelectItem key="Schwimmer">Schwimmer</SelectItem>
                                        <SelectItem key="Segler">Segler</SelectItem>
                                    </Select>
                                </div>
                            </Tab>

                            <Tab key="boat" title="Boot">
                                <div className="space-y-4">
                                    {profileType === "Segler" ? (
                                        <>
                                            <Input
                                                label="Boot-Name"
                                                placeholder="Dein Boot-Name"
                                                value={boatName}
                                                onChange={(e) => setBoatName(e.target.value)}
                                            />
                                            <Input
                                                label="Boot-Modell"
                                                placeholder="z. B. Bavaria Cruiser"
                                                value={boatModel}
                                                onChange={(e) => setBoatModel(e.target.value)}
                                            />
                                            <Input
                                                label="Boot-Größe (m)"
                                                placeholder="Länge in Metern"
                                                value={boatSize}
                                                onChange={(e) => setBoatSize(e.target.value)}
                                            />
                                            <Input
                                                label="Kapazität (Personen)"
                                                placeholder="Anzahl Personen"
                                                value={boatCapacity}
                                                onChange={(e) => setBoatCapacity(e.target.value)}
                                            />
                                            <Select
                                                label="Liege-Häufigkeit"
                                                placeholder="Häufigkeit auswählen"
                                                selectedKeys={new Set([dockingFrequency])}
                                                onSelectionChange={(keys) => {
                                                    const [key] = Array.from(keys) as [string];
                                                    setDockingFrequency(key);
                                                }}
                                            >
                                                <SelectItem key="täglich">Täglich</SelectItem>
                                                <SelectItem key="wöchentlich">Wöchentlich</SelectItem>
                                                <SelectItem key="monatlich">Monatlich</SelectItem>
                                                <SelectItem key="saisonal">Saisonal</SelectItem>
                                            </Select>
                                            <Select
                                                label="Standard-Hafen"
                                                placeholder="Hafen auswählen"
                                                selectedKeys={new Set([standardHarbor])}
                                                onSelectionChange={(keys) => {
                                                    const [key] = Array.from(keys) as [string];
                                                    setStandardHarbor(key);
                                                }}
                                            >
                                                <SelectItem key="Hamburg">Hamburg</SelectItem>
                                                <SelectItem key="Kiel">Kiel</SelectItem>
                                                <SelectItem key="Rostock">Rostock</SelectItem>
                                                <SelectItem key="Lübeck">Lübeck</SelectItem>
                                            </Select>
                                        </>
                                    ) : (
                                        <p className="text-sm text-gray-500">
                                            Zusätzliche Boot-Daten nur für Segler verfügbar.
                                        </p>
                                    )}
                                </div>
                            </Tab>

                            <Tab key="settings" title="Einstellungen">
                                <div className="space-y-4">
                                    <p>Hier kannst du deine Kontoeinstellungen ändern.</p>
                                </div>
                            </Tab>

                            <Tab key="filters" title="Filtereinstellungen">
                                <div className="space-y-4">
                                    <p>Wähle aus, welche Parameter auf der Karte angezeigt werden sollen:</p>
                                    <Select
                                        classNames={{trigger: "min-h-12 py-2"}}
                                        isMultiline
                                        selectionMode="multiple"
                                        label="Anzuzeigende Filter"
                                        placeholder="Filter wählen"
                                        items={filterOptions}
                                        selectedKeys={selectedFilters}
                                        onSelectionChange={setSelectedFilters}
                                        variant="flat"
                                        renderValue={(items: SelectedItems<FilterOption>) => (
                                            <div className="flex flex-wrap gap-2">
                                                {items.map(item => (
                                                    <Chip color={"secondary"} variant={"dot"}
                                                          key={item.key}>{item.data?.label}</Chip>
                                                ))}
                                            </div>
                                        )}
                                    >
                                        {(option) => (
                                            <SelectItem key={option.key} textValue={option.label}>
                                                {option.label}
                                            </SelectItem>
                                        )}
                                    </Select>
                                </div>
                            </Tab>
                        </Tabs>

                        <div className="flex justify-end mt-4">
                            <Button color="primary" variant={"flat"} onPress={handleSave}>
                                Speichern
                            </Button>
                        </div>
                    </CardBody>
                </Card>
            </div>
        </DefaultLayout>
    );
}
