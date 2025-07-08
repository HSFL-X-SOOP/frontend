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
import {InfoIcon, LOGO, MapIcon} from "@/components/Icons.tsx";
import React, {useState} from "react";
import {Button} from "@heroui/button";
import {NavItems} from "@/types";
import {Avatar} from "@heroui/avatar";
import Profile from "@/assets/profile.jpg"

import {useNavigate} from "react-router-dom";

export interface NavbarProps {
    activeItem: NavItems;
}

export const Navbar: React.FC<NavbarProps> = ({activeItem}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate()
    const [login, setLogin] = useState(false);

    const itemClasses = [
        "flex relative h-full items-center px-4 font-normal",
        "data-[active=true]:!font-normal data-[active=true]:text-primary",
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
            label: "Über uns",
            href: NavItems.ABOUT,
            isActive: activeItem === NavItems.NAV2,
            icon: <InfoIcon size={20}/>
        }
    ];

    const menuItems = [
        "Karte",
        "Nav2",
        "Nav3",
        "Nav4",
        "Nav5",
    ];

    return (
        <DefaultNavbar isBordered maxWidth={"2xl"} position={"sticky"} className={"dark:bg-secondary"}
                       classNames={{item: itemClasses}}
                       onMenuOpenChange={setIsMenuOpen}>
            <NavbarContent>
                <NavbarMenuToggle
                    aria-label={isMenuOpen ? "Close menu" : "Open menu"}
                    className="sm:hidden"
                />
                <NavbarBrand>
                    <LOGO size={50} className="text-secondary dark:text-primary"/>
                    <p className="font-bold text-2xl font-oswald text-secondary dark:text-primary text-inherit">Marlin</p>
                </NavbarBrand>
            </NavbarContent>
            <NavbarContent className="hidden sm:flex gap-6" justify="center">
                {navLinks.map(({label, href, isActive, icon}) => (
                    <NavbarItem
                        key={label}
                        isActive={isActive}
                        onClick={() => {
                            navigate(href)
                        }}
                        className="flex items-center p-1 gap-2 cursor-pointer"
                    >
                        {React.cloneElement(icon, {
                            className: isActive ? "text-primary" : undefined
                        })}

                        <span className={`text-medium ${isActive ? "text-primary" : "text-foreground"}`}>
                            {label}
                        </span>
                    </NavbarItem>
                ))}
            </NavbarContent>
            <NavbarContent justify="end" className={"gap-0"}>
                <NavbarItem>
                    <ThemeSwitch/>
                </NavbarItem>
                {!login && (
                    <NavbarItem>
                        <Button onPress={() => {
                            setLogin(true)
                        }} color="primary" variant="flat">
                            Anmelden
                        </Button>
                    </NavbarItem>
                )}

                {login && (
                    <NavbarItem>
                        <Avatar
                            isBordered
                            className="transition-transform"
                            color="primary"
                            size="sm"
                            as={Link}
                            href={"/profile"}
                            src={Profile}
                        />
                    </NavbarItem>
                )}

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

