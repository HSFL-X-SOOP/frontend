import DefaultLayout from "@/layouts/DefaultLayout.tsx";
import {NavItems} from "@/types";

export function Nav5() {
    return (
        <DefaultLayout activeItem={NavItems.NAV5}>
            <div className={"w-full h-screen items-center justify-center"}>Navigation 5</div>
        </DefaultLayout>
    );
}