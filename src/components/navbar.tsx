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
import {CloudIcon, InfoIcon, LOGO, MapIcon} from "@/components/Icons.tsx";
import React, {useState} from "react";
import {Button} from "@heroui/button";
import {NavItems} from "@/types";
import {Avatar} from "@heroui/avatar";
import Profile from "@/assets/profile.jpg"

import {useNavigate} from "react-router-dom";
import {useSession} from "@/context/SessionContext.tsx";
import {Dropdown, DropdownTrigger, DropdownMenu, DropdownItem} from "@heroui/react";
import {ChevronDown} from "@/components/Icons.tsx";

export interface NavbarProps {
    activeItem: NavItems;
}

export const Navbar: React.FC<NavbarProps> = ({activeItem}) => {
    const [isMenuOpen, setIsMenuOpen] = useState(false);
    const navigate = useNavigate()
    const {session} = useSession()

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
    ];

    const menuItems = [
        {label: "Karte", to: NavItems.MAP, isActive: activeItem === NavItems.MAP, icon: <MapIcon size={25}/>},
        {label: "Sensoren", to: "/sensoren", isActive: activeItem === NavItems.SENSOR, icon: <LOGO size={25}/>},
        {label: "API", to: "/api", isActive: activeItem === NavItems.API, icon: <CloudIcon size={25}/>},
        {label: "Über uns", to: NavItems.ABOUT, isActive: activeItem === NavItems.ABOUT, icon: <InfoIcon size={25}/>},
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
                {/* Über uns Dropdown */}
                <Dropdown>
                    <NavbarItem>
                        <DropdownTrigger>
                            <Button
                                disableRipple
                                className="p-0 bg-transparent data-[hover=true]:bg-transparent flex items-center gap-2"
                                endContent={<ChevronDown fill="currentColor" size={16}/>}
                                radius="sm"
                                variant="light"
                            >
                                <InfoIcon size={20}
                                          className={activeItem === NavItems.ABOUT ? "text-primary" : undefined}/>
                                <span
                                    className={`text-medium ${activeItem === NavItems.ABOUT ? "text-primary" : "text-foreground"}`}>Über uns</span>
                            </Button>
                        </DropdownTrigger>
                    </NavbarItem>
                    <DropdownMenu
                        aria-label="Über uns"
                        itemClasses={{
                            base: "gap-4",
                        }}
                    >
                        <DropdownItem key="about" startContent={<InfoIcon/>} onClick={() => navigate(NavItems.ABOUT)}>
                            Über uns
                        </DropdownItem>
                        <DropdownItem key="sensoren" startContent={<LOGO/>} onClick={() => navigate('/sensoren')}>
                            Sensoren
                        </DropdownItem>
                        <DropdownItem key="api" startContent={<CloudIcon/>} onClick={() => navigate('/api')}>
                            API
                        </DropdownItem>
                    </DropdownMenu>
                </Dropdown>
            </NavbarContent>
            <NavbarContent justify="end" className={"gap-0"}>
                <NavbarItem>
                    <ThemeSwitch/>
                </NavbarItem>
                {!session && (
                    <NavbarItem>
                        <Button onPress={() => {
                            navigate("/login")
                        }} color="primary" variant="flat">
                            Anmelden
                        </Button>
                    </NavbarItem>
                )}

                {session && (
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
                {menuItems.map((item) => {
                    return (
                        <NavbarMenuItem className={"flex flex-row justify-center gap-2 items-center"} key={item.label}>
                            {React.cloneElement(item.icon, {
                                className: item.isActive ? "text-primary" : undefined
                            })}
                            <Link
                                className="w-full"
                                color={item.isActive ? "primary" : "foreground"}
                                onPress={() => navigate(item.to)}
                                size="lg"
                            >
                                {item.label}
                            </Link>
                        </NavbarMenuItem>
                    );
                })}
            </NavbarMenu>
        </DefaultNavbar>
    );
};

