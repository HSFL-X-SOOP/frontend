import DefaultLayout from "@/layouts/DefaultLayout.tsx";
import {NavItems} from "@/types";

export function Api() {
  return (
    <DefaultLayout activeItem={NavItems.API}>
      <div className="w-screen h-[calc(100vh-65px)] flex items-center justify-center bg-content1 overflow-auto">
        <div className="max-w-2xl h-[calc(100vh-65px)] mx-auto px-4 py-10 text-foreground">
          <h1 className="text-4xl font-bold mb-6">API</h1>
          <section className="mb-8">
            <p className="mb-4 text-lg">
              Die Daten werden auch über eine kostenpflichtige API angeboten. Für Zugänge dazu siehe <span className="italic text-primary">Preise</span>.
            </p>
            <h2 className="text-2xl font-semibold mb-2">Abfragemöglichkeiten</h2>
            <ul className="list-disc ml-6 mt-2 space-y-1">
              <li><strong>Location:</strong> Auswahl des Standorts</li>
              <li><strong>Zeit:</strong> Auswahl des Zeitpunkts oder Zeitraums</li>
              <li><strong>Art der Messung:</strong> Auswahl der gewünschten Messgröße (z.B. Temperatur, Wasserstand, etc.)</li>
              <li><strong>Besondere Events:</strong> Filterung nach Ereignissen wie Stürmen, Sturmfluten etc.</li>
            </ul>
          </section>
          <section className="mb-8">
            <h2 className="text-2xl font-semibold mb-2">Struktur</h2>
            <p className="mb-2">Hier folgt eine Beschreibung der API-Struktur und Beispielanfragen (bitte ergänzen).</p>
          </section>
        </div>
      </div>
    </DefaultLayout>
  );
}