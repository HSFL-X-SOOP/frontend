import DefaultLayout from "@/layouts/default.tsx";
import {NavItems} from "@/types";

export function Nav4() {
    return (
        <DefaultLayout activeItem={NavItems.NAV4}>
            <div className={"w-full h-screen items-center justify-center"}>Navigation 4</div>
        </DefaultLayout>
    );
}