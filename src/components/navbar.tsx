import {Link} from "@heroui/link";
import {
    Navbar as DefaultNavbar,
    NavbarBrand,
    NavbarContent,
    NavbarItem,
    NavbarMenu,
    NavbarMenuItem,
    NavbarMenuToggle,
} from "@heroui/navbar";


import {ThemeSwitch} from "@/components/theme-switch.tsx";
import {LOGO, MapIcon, QuestionMarkIcon} from "@/components/icons.tsx";
import {useState} from "react";
import {Button} from "@heroui/button";
import {NavItems} from "@/types";

export interface NavbarProps {
    activeItem: NavItems;
}

export const Navbar: React.FC<NavbarProps> = ({activeItem}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);

    const itemClasses = [
        "flex relative h-full items-center px-4 hover:text-primary",
        "data-[active=true]:after:absolute",
        "data-[active=true]:after:bottom-0",
        "data-[active=true]:after:left-0",
        "data-[active=true]:after:right-0",
        "data-[active=true]:after:h-[2px]",
        "data-[active=true]:after:bg-primary"
    ].join(" ");

    const navLinks = [
        {label: "Karte", href: NavItems.MAP, isActive: activeItem === NavItems.MAP, icon: <MapIcon size={20}/>},
        {
            label: "Nav2",
            href: NavItems.NAV2,
            isActive: activeItem === NavItems.NAV2,
            icon: <QuestionMarkIcon size={20}/>
        },
        {
            label: "Nav3",
            href: NavItems.NAV3,
            isActive: activeItem === NavItems.NAV3,
            icon: <QuestionMarkIcon size={20}/>
        },
        {
            label: "Nav4",
            href: NavItems.NAV4,
            isActive: activeItem === NavItems.NAV4,
            icon: <QuestionMarkIcon size={20}/>
        },
        {
            label: "Nav5",
            href: NavItems.NAV5,
            isActive: activeItem === NavItems.NAV5,
            icon: <QuestionMarkIcon size={20}/>
        },
    ];

    console.log(activeItem);

    const menuItems = [
        "Karte",
        "Nav2",
        "Nav3",
        "Nav4",
        "Nav5",
    ];

    return (
        <DefaultNavbar isBordered maxWidth={"2xl"} position={"sticky"} classNames={{item: itemClasses}}
                       onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <LOGO size={40}/>
                    <p className="font-bold text-2xl font-oswald text-primary text-inherit">Marlin</p>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="hidden sm:flex gap-4" justify="center">
                {navLinks.map(({label, href, isActive, icon}) => (
                    <NavbarItem key={label} isActive={isActive} className="flex items-center p-0 gap-2">
                        {icon}
                        <Link href={href} color={isActive ? "primary" : "foreground"} className="text-medium">
                            {label}
                        </Link>
                    </NavbarItem>
                ))}
            </NavbarContent>
            <NavbarContent justify="end">
                <NavbarItem>
                    <ThemeSwitch/>
                </NavbarItem>
                <NavbarItem>
                    <Button as={Link} color="primary" href="#" variant="flat">
                        Anmelden
                    </Button>
                </NavbarItem>
            </NavbarContent>
            <NavbarMenu>
                {menuItems.map((item, index) => (
                    <NavbarMenuItem key={`${item}-${index}`}>
                        <Link
                            className="w-full"
                            color={
                                index === 2 ? "primary" : index === menuItems.length - 1 ? "danger" : "foreground"
                            }
                            href="#"
                            size="lg"
                        >
                            {item}
                        </Link>
                    </NavbarMenuItem>
                ))}
            </NavbarMenu>
        </DefaultNavbar>
    );
};

