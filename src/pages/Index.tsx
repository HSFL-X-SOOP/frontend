// src/pages/IndexPage.tsx
import DefaultLayout from "@/layouts/DefaultLayout";
import { NavItems } from "@/types";
import {Button} from "@heroui/button";

export default function IndexPage() {
    const lat = 54.32829139396176;
    const lon = 10.179455986018528;
    const zoom = 10;

    return (
        <DefaultLayout activeItem={NavItems.MAP}>
            <div className="h-[calc(100vh-65px)] w-screen">
                <iframe
                    title="OpenStreetMap"
                    className="w-full h-full"
                    loading="lazy"
                    frameBorder="0"
                    scrolling="no"
                    src={`https://www.openstreetmap.org/export/embed.html?bbox=${lon - 0.1}%2C${lat - 0.05}%2C${lon + 0.1}%2C${lat + 0.05}&layer=mapnik&marker=${lat}%2C${lon}`}
                />

                <Button>
                    
                </Button>
            </div>
        </DefaultLayout>
    );
}