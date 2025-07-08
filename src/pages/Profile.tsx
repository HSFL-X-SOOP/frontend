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
import {Switch} from "@heroui/switch";

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
    const [standardHarbor, setStandardHarbor] = useState<string>("");

    const [selectedFilters, setSelectedFilters] = useState<Selection>(new Set());

    const [language, setLanguage] = useState("de");
    const [notifications, setNotifications] = useState(true);
    const [shareLocation, setShareLocation] = useState(false);
    const [darkMode, setDarkMode] = useState(false);
    const [unitSystem, setUnitSystem] = useState("metric");
    const [mapStyle, setMapStyle] = useState("standard");
    const [autoLogout, setAutoLogout] = useState(false);
    const [activityLog, setActivityLog] = useState(false);
    const [highContrast, setHighContrast] = useState(false);
    const [startLocation, setStartLocation] = useState("");

    const [alarms, setAlarms] = useState([
        {id: 1, type: "Windstärke", threshold: 6, enabled: true},
        {id: 2, type: "Wellenhöhe", threshold: 2, enabled: false},
    ]);
    const [devices, setDevices] = useState([
        {id: 1, name: "Sensor 1", type: "Wassertemperatur", location: "Kiel"},
    ]);
    const [apiToken, setApiToken] = useState("1234-5678-ABCD-EFGH");
    const [feedback, setFeedback] = useState("");
    const [calendarEvents, setCalendarEvents] = useState([
        {id: 1, date: "2024-06-20", title: "Segeltörn", location: "Kiel"},
        {id: 2, date: "2024-06-22", title: "Wettkampf", location: "Flensburg"},
    ]);

    const handleSave = () => {
        const payload: Record<string, any> = {name, email, profileType};
        if (profileType === "Segler") {
            Object.assign(payload, {boatName, boatModel, boatSize, boatCapacity, standardHarbor});
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
                                <div className="space-y-6 w-full">
                                    <Select
                                        label="Sprache"
                                        size="sm"
                                        selectedKeys={new Set([language])}
                                        onSelectionChange={keys => setLanguage(Array.from(keys)[0] as string)}
                                        className="w-full"
                                    >
                                        <SelectItem key="de">Deutsch</SelectItem>
                                        <SelectItem key="en">Englisch</SelectItem>
                                    </Select>

                                    <div className="flex items-center justify-between">
                                        <span>Benachrichtigungen</span>
                                        <Switch
                                            isSelected={notifications}
                                            onValueChange={setNotifications}
                                            color="primary"
                                        >
                                            {notifications ? "Aktiviert" : "Deaktiviert"}
                                        </Switch>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span>Standort teilen</span>
                                        <Switch
                                            isSelected={shareLocation}
                                            onValueChange={setShareLocation}
                                            color="primary"
                                        >
                                            {shareLocation ? "Aktiviert" : "Deaktiviert"}
                                        </Switch>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span>Dunkelmodus</span>
                                        <Switch
                                            isSelected={darkMode}
                                            onValueChange={setDarkMode}
                                            color="primary"
                                        >
                                            {darkMode ? "An" : "Aus"}
                                        </Switch>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span>Automatischer Logout</span>
                                        <Switch
                                            isSelected={autoLogout}
                                            onValueChange={setAutoLogout}
                                            color="primary"
                                        >
                                            {autoLogout ? "Aktiviert" : "Deaktiviert"}
                                        </Switch>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span>Aktivitätsprotokollierung</span>
                                        <Switch
                                            isSelected={activityLog}
                                            onValueChange={setActivityLog}
                                            color="primary"
                                        >
                                            {activityLog ? "Erlaubt" : "Nicht erlaubt"}
                                        </Switch>
                                    </div>

                                    <div className="flex items-center justify-between">
                                        <span>Hoher Kontrast</span>
                                        <Switch
                                            isSelected={highContrast}
                                            onValueChange={setHighContrast}
                                            color="primary"
                                        >
                                            {highContrast ? "An" : "Aus"}
                                        </Switch>
                                    </div>

                                    <Input
                                        label="Startort (z.B. Kiel, Koordinaten)"
                                        size="sm"
                                        placeholder="Startort eingeben"
                                        value={startLocation}
                                        onChange={e => setStartLocation(e.target.value)}
                                    />

                                    <div className="pt-4 flex justify-end">
                                        <Button
                                            color="danger"
                                            variant="bordered"
                                            onPress={() => {
                                                if (window.confirm("Bist du sicher, dass du deinen Account löschen möchtest?")) {
                                                    alert("Account gelöscht (Demo)");
                                                }
                                            }}
                                        >
                                            Account löschen
                                        </Button>
                                    </div>
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

                                    {/* Einheitensystem */}
                                    <Select
                                        label="Einheitensystem"
                                        size="sm"
                                        selectedKeys={new Set([unitSystem])}
                                        onSelectionChange={keys => setUnitSystem(Array.from(keys)[0] as string)}
                                        className="w-full"
                                    >
                                        <SelectItem key="metric">Metrisch (°C, m, km/h)</SelectItem>
                                        <SelectItem key="imperial">Imperial (°F, ft, mph)</SelectItem>
                                    </Select>

                                    {/* Kartenstil */}
                                    <Select
                                        label="Kartenstil"
                                        size="sm"
                                        selectedKeys={new Set([mapStyle])}
                                        onSelectionChange={keys => setMapStyle(Array.from(keys)[0] as string)}
                                        className="w-full"
                                    >
                                        <SelectItem key="standard">Standard</SelectItem>
                                        <SelectItem key="satellite">Satellit</SelectItem>
                                        <SelectItem key="night">Nachtmodus</SelectItem>
                                    </Select>
                                </div>
                            </Tab>

                            <Tab key="alarms" title="Alarme & Benachrichtigungen">
                                <div className="space-y-4">
                                    <p>Hier kannst du Warnungen für bestimmte Parameter einstellen:</p>
                                    {alarms.map(alarm => (
                                        <div key={alarm.id} className="flex items-center gap-2">
                                            <Select
                                                label="Typ"
                                                size="sm"
                                                selectedKeys={new Set([alarm.type])}
                                                onSelectionChange={keys => {
                                                    const newType = Array.from(keys)[0] as string;
                                                    setAlarms(alarms.map(a => a.id === alarm.id ? {
                                                        ...a,
                                                        type: newType
                                                    } : a));
                                                }}
                                                className="w-40"
                                            >
                                                <SelectItem key="Windstärke">Windstärke</SelectItem>
                                                <SelectItem key="Wellenhöhe">Wellenhöhe</SelectItem>
                                                <SelectItem key="Wassertemperatur">Wassertemperatur</SelectItem>
                                            </Select>
                                            <Input
                                                label="Schwellwert"
                                                size="sm"
                                                type="number"
                                                value={alarm.threshold.toString()}
                                                onChange={e => setAlarms(alarms.map(a => a.id === alarm.id ? {
                                                    ...a,
                                                    threshold: Number(e.target.value)
                                                } : a))}
                                                className="w-32"
                                            />
                                            <Switch
                                                isSelected={alarm.enabled}
                                                onValueChange={val => setAlarms(alarms.map(a => a.id === alarm.id ? {
                                                    ...a,
                                                    enabled: val
                                                } : a))}
                                                color="primary"
                                                size={"sm"}
                                            >
                                                {alarm.enabled ? "Aktiv" : "Inaktiv"}
                                            </Switch>
                                            <Button color="danger" size="sm" variant="faded"
                                                    onPress={() => setAlarms(alarms.filter(a => a.id !== alarm.id))}>Entfernen</Button>
                                        </div>
                                    ))}
                                    <Button size="sm" color="primary" variant="flat"
                                            onPress={() => setAlarms([...alarms, {
                                                id: Date.now(),
                                                type: "Windstärke",
                                                threshold: 5,
                                                enabled: true
                                            }])}>Alarm hinzufügen</Button>
                                </div>
                            </Tab>

                            <Tab key="devices" title="Geräte & Sensoren">
                                <div className="space-y-4">
                                    <p>Verwalte deine eigenen Sensoren oder Geräte:</p>
                                    {devices.map(device => (
                                        <div key={device.id} className="flex items-center gap-2">
                                            <Input
                                                label="Name"
                                                size="sm"
                                                value={device.name}
                                                onChange={e => setDevices(devices.map(d => d.id === device.id ? {
                                                    ...d,
                                                    name: e.target.value
                                                } : d))}
                                                className="w-40"
                                            />
                                            <Select
                                                label="Typ"
                                                size="sm"
                                                selectedKeys={new Set([device.type])}
                                                onSelectionChange={keys => setDevices(devices.map(d => d.id === device.id ? {
                                                    ...d,
                                                    type: Array.from(keys)[0] as string
                                                } : d))}
                                                className="w-40"
                                            >
                                                <SelectItem key="Wassertemperatur">Wassertemperatur</SelectItem>
                                                <SelectItem key="Luftqualität">Luftqualität</SelectItem>
                                                <SelectItem key="Wasserstand">Wasserstand</SelectItem>
                                            </Select>
                                            <Input
                                                label="Ort"
                                                size="sm"
                                                value={device.location}
                                                onChange={e => setDevices(devices.map(d => d.id === device.id ? {
                                                    ...d,
                                                    location: e.target.value
                                                } : d))}
                                                className="w-40"
                                            />
                                            <Button color="danger" size="sm" variant="faded"
                                                    onPress={() => setDevices(devices.filter(d => d.id !== device.id))}>Entfernen</Button>
                                        </div>
                                    ))}
                                    <Button size="sm" color="primary" variant="flat"
                                            onPress={() => setDevices([...devices, {
                                                id: Date.now(),
                                                name: "",
                                                type: "Wassertemperatur",
                                                location: ""
                                            }])}>Gerät hinzufügen</Button>
                                </div>
                            </Tab>

                            <Tab key="api" title="API-Zugang">
                                <div className="space-y-4 max-w-md mx-auto">
                                    <p>Hier kannst du deinen persönlichen API-Token verwalten:</p>
                                    <Input
                                        label="API-Token"
                                        size="sm"
                                        value={apiToken}
                                        readOnly
                                        className="w-full"
                                    />
                                    <Button size="sm" color="primary" variant="flat"
                                            onPress={() => setApiToken(Math.random().toString(36).substring(2, 18).toUpperCase())}>Neuen
                                        Token generieren</Button>
                                </div>
                            </Tab>

                            <Tab key="feedback" title="Feedback & Support">
                                <div className="space-y-4  mx-auto">
                                    <p>Gib uns Feedback oder stelle eine Support-Anfrage:</p>
                                    <Input
                                        label="Nachricht"
                                        size="sm"
                                        value={feedback}
                                        onChange={e => setFeedback(e.target.value)}
                                        className="w-full"
                                        placeholder="Dein Feedback oder deine Frage..."
                                    />
                                    <Button size="sm" color="primary" variant="flat" onPress={() => {
                                        setFeedback("");
                                        alert("Vielen Dank für dein Feedback!");
                                    }}>Absenden</Button>
                                </div>
                            </Tab>

                            <Tab key="calendar" title="Kalender">
                                <div className="space-y-4 max-w-4xl mx-auto">
                                    <p>Deine persönlichen Termine und Ereignisse:</p>
                                    <ul className="space-y-2">
                                        {calendarEvents.map(event => (
                                            <li key={event.id} className="flex items-center gap-2">
                                                <span className="w-28">{event.date}</span>
                                                <span className="flex-1">{event.title} ({event.location})</span>
                                                <Button color="danger" size="sm" variant="faded"
                                                        onPress={() => setCalendarEvents(calendarEvents.filter(e => e.id !== event.id))}>Entfernen</Button>
                                            </li>
                                        ))}
                                    </ul>
                                    <Button size="sm" color="primary" variant="flat"
                                            onPress={() => setCalendarEvents([...calendarEvents, {
                                                id: Date.now(),
                                                date: new Date().toISOString().slice(0, 10),
                                                title: "Neues Ereignis",
                                                location: ""
                                            }])}>Ereignis hinzufügen</Button>
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
