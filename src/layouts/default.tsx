import {Navbar} from "@/components/navbar.tsx";
import {ReactNode} from "react";
import {NavItems} from "@/types";

export default function DefaultLayout({
                                          children,
                                          activeItem
                                      }: {
    children: ReactNode;
    activeItem: NavItems;
}) {
    return (
        <div className="relative flex flex-col w-screen h-screen">
            <Navbar activeItem={activeItem}/>
            <main className="w-screen h-screen">
                {children}
            </main>
        </div>
    );
}
