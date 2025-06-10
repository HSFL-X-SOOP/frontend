import DefaultLayout from "@/layouts/default.tsx";
import {NavItems} from "@/types";

export function Nav3() {
    return (
        <DefaultLayout activeItem={NavItems.NAV3}>
            <div className={"w-full h-screen items-center justify-center"}>Navigation 3</div>
        </DefaultLayout>
    );
}