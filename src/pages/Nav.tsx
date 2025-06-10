import DefaultLayout from "@/layouts/default.tsx";
import {NavItems} from "@/types";

export function Nav() {
    return (
        <DefaultLayout activeItem={NavItems.NAV2}>
            <div className={"w-full h-screen items-center justify-center"}>Navigation 2</div>
        </DefaultLayout>
    );
}