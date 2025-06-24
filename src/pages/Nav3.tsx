import DefaultLayout from "@/layouts/DefaultLayout.tsx";
import {NavItems} from "@/types";

export function Nav3() {
    return (
        <DefaultLayout activeItem={NavItems.NAV3}>
            <div className={"w-full h-screen items-center justify-center"}>Navigation 3</div>
        </DefaultLayout>
    );
}