import DefaultLayout from "@/layouts/DefaultLayout.tsx";
import {NavItems} from "@/types";

export function Sensor() {
    return (
        <DefaultLayout activeItem={NavItems.SENSOR}>
            <div className="w-screen h-[calc(100vh-65px)] flex items-center justify-center bg-content1 overflow-auto">
                <div className="max-w-2xl h-[calc(100vh-65px)] mx-auto px-4 py-10 text-foreground">
                    <h1 className="text-4xl font-bold mb-6">Erklärung der Daten und Darstellungen</h1>
                    <p className="mb-8 text-lg">Hier findest du eine einfache Erklärung der wichtigsten Messwerte und
                        wie du sie auf unserer Webseite interpretieren kannst.</p>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-2">Wassertemperatur</h2>
                        <p>Die Wassertemperatur zeigt, wie warm oder kalt das Wasser ist.</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li><strong>0&nbsp;°C</strong> – Gefriert</li>
                            <li><strong>8&nbsp;°C</strong> – Getränk direkt aus dem Kühlschrank</li>
                            <li><strong>10&nbsp;°C</strong> – Neoprenanzug empfohlen</li>
                            <li><strong>20&nbsp;°C</strong> – Angenehm zum Schwimmen (Badehose)</li>
                            <li><strong>38&nbsp;°C</strong> – Heiße Dusche</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-2">Wellenhöhe</h2>
                        <p>Die Wellenhöhe beschreibt, wie hoch die Wasseroberfläche schwappt. Je höher die Welle, desto
                            mehr Kraft steckt dahinter.</p>
                        <ul className="list-disc ml-6 mt-2 space-y-1">
                            <li><strong>A4-Blatt (kurze Seite)</strong> – Kann ein Kind umhauen</li>
                            <li><strong>A4-Blatt (lange Seite)</strong> – Kann einen Erwachsenen umhauen</li>
                            <li><strong>Tsunami</strong> – Würde sogar den Eiffelturm umwerfen</li>
                        </ul>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-2">Wasserstand</h2>
                        <p>Der Wasserstand zeigt, wie hoch das Wasser im Vergleich zum Normalwert steht. Ein hoher
                            Wasserstand kann z.B. auf Hochwasser hindeuten.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-2">Standardabweichung</h2>
                        <p>Die Standardabweichung gibt an, wie stark die Messwerte schwanken. Eine kleine Abweichung
                            bedeutet, dass die Werte stabil sind. Große Abweichungen zeigen, dass sich die Bedingungen
                            schnell ändern.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-2">Windgeschwindigkeit</h2>
                        <p>Die Windgeschwindigkeit zeigt, wie schnell der Wind weht. Starker Wind kann Wellen und
                            Strömungen verstärken.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-2">Windrichtung</h2>
                        <p>Die Windrichtung gibt an, aus welcher Richtung der Wind kommt. Sie wird meist als Gradzahl
                            (0° = Norden, 90° = Osten, 180° = Süden, 270° = Westen) angegeben.</p>
                    </section>

                    <section className="mb-8">
                        <h2 className="text-2xl font-semibold mb-2">Luftdruck</h2>
                        <p>Der Luftdruck zeigt, wie schwer die Luft auf die Erde drückt. Ein sinkender Luftdruck kann
                            auf schlechtes Wetter hindeuten, ein steigender auf besseres Wetter.</p>
                    </section>
                </div>
            </div>
        </DefaultLayout>
    );
}