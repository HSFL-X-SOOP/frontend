import {SVGProps} from "react";

export type IconSvgProps = SVGProps<SVGSVGElement> & {
    size?: number;
};


export enum NavItems {
    MAP = "/",
    NAV2 = "/nav2",
    NAV3 = "/nav3",
    NAV4 = "/nav4",
    NAV5 = "/nav5",
    PROFILE = "/profile",
    ABOUT = "/about",
    API = "/api",
    SENSOR = "/sensoren",
}