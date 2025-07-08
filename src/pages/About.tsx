import DefaultLayout from "@/layouts/DefaultLayout.tsx";
import {NavItems} from "@/types";
import {Link} from "@heroui/link";


export function About() {
    return (
        <DefaultLayout activeItem={NavItems.ABOUT}>
            <div className="w-screen h-[calc(100vh-65px)] flex items-center justify-center bg-content1 overflow-auto">
                <div className="max-w-3xl h-[calc(100vh-65px)] mx-auto px-4 py-10 text-foreground">
                    <h1 className="text-4xl font-bold mb-6">Über uns</h1>
                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-2">Was bietet diese Webseite?</h2>
                        <p className="mb-2">
                            Auf dieser Webseite können aktuelle, lokale Daten zu Wetter und Meeresbedingungen abgerufen werden. Die Daten werden von Sensorkits in verschiedenen Marinas erhoben.
                        </p>
                        <p className="mb-2">
                            Auf der <Link href="/" className="italic text-primary hover:underline">Karte</Link> werden alle Sensoren angezeigt, sowie eine Approximation der Werte an den Zwischenstellen ohne eigenen Sensor.
                        </p>
                        <p className="mb-2">
                            Im <Link href="/dashboard" className="italic text-primary hover:underline">Dashboard</Link> werden die Daten eines Sensors dargestellt und unter <Link href="/vergangene-daten" className="italic text-primary hover:underline">Vergangene Daten</Link> wird die Historie einzelner Werte dargestellt.
                        </p>
                        <p className="mb-2">
                            Zum besseren Verständnis für Laien stellen wir eine <Link href="/daten-erklaerung" className="italic text-primary hover:underline">einfache Erklärung der Daten</Link> bereit.
                        </p>
                        <p className="mb-2">
                            Außerdem stellen wir eine kostenpflichtige <Link href="/api" className="italic text-primary hover:underline">API</Link> bereit, über die die Daten zur Verfügung gestellt werden.
                        </p>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-4">Projekt MARLIN</h2>
                        <p className="mb-4">
                            Diese Webseite ist im Rahmen des Masterprojekts <strong>MARLIN</strong> (<a href="http://46.252.195.123" target="_blank" rel="noopener noreferrer" className="italic text-primary hover:underline">Projektwebseite</a>) von Studierenden im Master Angewandte Informatik erstellt worden.
                        </p>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <div className="flex items-center gap-4 bg-content2 rounded-lg p-4">
                                <div className="w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center text-2xl font-bold">D</div>
                                <div>
                                    <h3 className="font-semibold text-lg">Daniel</h3>
                                    <p className="text-sm text-default-500">(Aufgaben, Vorerfahrung, etc.)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-content2 rounded-lg p-4">
                                <div className="w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center text-2xl font-bold">F</div>
                                <div>
                                    <h3 className="font-semibold text-lg">Fatih</h3>
                                    <p className="text-sm text-default-500">(Aufgaben, Vorerfahrung, etc.)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-content2 rounded-lg p-4">
                                <div className="w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center text-2xl font-bold">J</div>
                                <div>
                                    <h3 className="font-semibold text-lg">Julian</h3>
                                    <p className="text-sm text-default-500">(Aufgaben, Vorerfahrung, etc.)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-content2 rounded-lg p-4">
                                <div className="w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center text-2xl font-bold">K</div>
                                <div>
                                    <h3 className="font-semibold text-lg">Krister</h3>
                                    <p className="text-sm text-default-500">(Aufgaben, Vorerfahrung, etc.)</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 bg-content2 rounded-lg p-4">
                                <div className="w-16 h-16 bg-secondary-200 rounded-full flex items-center justify-center text-2xl font-bold">T</div>
                                <div>
                                    <h3 className="font-semibold text-lg">Tarek</h3>
                                    <p className="text-sm text-default-500">(Aufgaben, Vorerfahrung, etc.)</p>
                                </div>
                            </div>
                        </div>
                    </section>

                    <section className="mb-10">
                        <h2 className="text-2xl font-semibold mb-2">SOOP</h2>
                        <p className="mb-2">
                            Beschreibung von SOOP (hier bitte noch ergänzen, was SOOP ist und warum es für das Projekt relevant ist).
                        </p>
                    </section>
                </div>
            </div>
        </DefaultLayout>
    );
}