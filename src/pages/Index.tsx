// src/pages/IndexPage.tsx
import DefaultLayout from "@/layouts/DefaultLayout";
import {NavItems} from "@/types";
import {
    Drawer,
    DrawerContent,
    DrawerHeader,
    DrawerBody,
    Button,
    useDisclosure,
    Tooltip,
    Checkbox
} from "@heroui/react";
import {FilterIcon} from "@/components/Icons.tsx";
import {useState} from "react";
import MapWrapper from "@/components/MapWrapper.tsx";

export default function IndexPage() {
    const {isOpen, onOpen, onOpenChange} = useDisclosure();

    // State für die Overlays
    const [temperatureVisible, setTemperatureVisible] = useState(false);
    const [windDirectionVisible, setWindDirectionVisible] = useState(false);
    const [module1Visible, setModule1Visible] = useState(false);
    const [module2Visible, setModule2Visible] = useState(false);
    const [module3Visible, setModule3Visible] = useState(false);

    return (
        <DefaultLayout activeItem={NavItems.MAP}>
            <div className="h-[calc(100vh-65px)] relative">

                <MapWrapper
                    module1Visible={module1Visible}
                    module2Visible={module2Visible}
                    module3Visible={module3Visible}
                    temperatureVisible={temperatureVisible}
                    windDirectionVisible={windDirectionVisible}
                />
                <Button className={"absolute bottom-10 right-5"} onPress={onOpen} size={"lg"} variant={"shadow"}
                        color={"secondary"} radius={"full"}
                        isIconOnly>
                    <FilterIcon size={25}/>
                </Button>
                <Drawer isOpen={isOpen} size={"xl"} className={"bg-content2"} onOpenChange={onOpenChange}>
                    <DrawerContent className="overflow-visible">
                        {(onClose) => (
                            <>
                                <DrawerHeader
                                    className=" top-0 inset-x-0 z-50 flex flex-row gap-2 px-2 py-2 border-b border-default-200/50  backdrop-blur-lg">
                                    <Tooltip content="Schließen">
                                        <Button
                                            isIconOnly
                                            className="text-default-400"
                                            size="sm"
                                            variant="bordered"
                                            radius="full"
                                            onPress={onClose}
                                        >
                                            <svg
                                                fill="none"
                                                height="20"
                                                stroke="currentColor"
                                                strokeLinecap="round"
                                                strokeLinejoin="round"
                                                className={"text-secondary dark:text-primary"}
                                                strokeWidth="2"
                                                viewBox="0 0 24 24"
                                                width="20"
                                                xmlns="http://www.w3.org/2000/svg"
                                            >
                                                <path d="m13 17 5-5-5-5M6 17l5-5-5-5"/>
                                            </svg>
                                        </Button>
                                    </Tooltip>

                                    <h1 className="text-lg font-semibold text-default-800">
                                        Filtereinstellungen
                                    </h1>

                                </DrawerHeader>
                                <DrawerBody className="space-y-4 p-4 overflow-visible drawer">
                                    <div className="flex flex-col gap-4">
                                        <Checkbox
                                            isSelected={module1Visible}
                                            onValueChange={setModule1Visible}
                                        >
                                            Module 1: Water Level Temperature
                                        </Checkbox>
                                        <Checkbox
                                            isSelected={module2Visible}
                                            onValueChange={setModule2Visible}
                                        >
                                            Module 2: Air Properties
                                        </Checkbox>
                                        <Checkbox
                                            isSelected={module3Visible}
                                            onValueChange={setModule3Visible}
                                        >
                                            Module 3: Air Quality
                                        </Checkbox>
                                        <Checkbox
                                            isSelected={temperatureVisible}
                                            onValueChange={setTemperatureVisible}
                                        >
                                            Temperatur-Overlay
                                        </Checkbox>
                                        <Checkbox
                                            isSelected={windDirectionVisible}
                                            onValueChange={setWindDirectionVisible}
                                        >
                                            Windrichtung-Overlay
                                        </Checkbox>
                                    </div>
                                </DrawerBody>
                            </>
                        )}
                    </DrawerContent>
                </Drawer>
            </div>
        </DefaultLayout>
    );
}