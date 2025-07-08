import DefaultLayout from "@/layouts/DefaultLayout.tsx";
import {NavItems} from "@/types";


export function About() {
    return (
        <DefaultLayout activeItem={NavItems.ABOUT}>
            <div className="w-screen h-[calc(100vh-65px)] flex items-center justify-center bg-content1 ">Navigation 2</div>
        </DefaultLayout>
    );
}