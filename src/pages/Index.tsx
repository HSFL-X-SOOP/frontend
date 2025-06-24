import DefaultLayout from "@/layouts/DefaultLayout.tsx";
import {NavItems} from "@/types";
import {Image} from "@heroui/react";
import Map from "@/assets/Map.png";

export default function IndexPage() {
    return (
        <DefaultLayout activeItem={NavItems.MAP}>
            <div className="h-[calc(100vh-65px)] w-screen flex items-center justify-center">
                <Image
                    alt={"Map"}
                    src={Map}
                    radius={"none"}
                    className="object-fill h-[calc(100vh-65px)] w-screen"
                />
            </div>
        </DefaultLayout>
    );
}
