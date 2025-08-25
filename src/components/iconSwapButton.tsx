import {IconSvgProps} from "@/types";
import {AnimatePresence, motion} from "framer-motion";
import {ComponentType, ReactElement} from "react";


export const AnimatedIconSwap = (
    isToggled: boolean,
    IconA: ComponentType<IconSvgProps>,
    IconB: ComponentType<IconSvgProps>
): ReactElement => (
    <AnimatePresence mode="wait" initial={false}>
        {isToggled ? (
            <motion.span
                key="iconA"
                initial={{opacity: 0, scale: 0.8}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.8}}
                transition={{duration: 0.12}}
            >
                <IconA/>
            </motion.span>
        ) : (
            <motion.span
                key="iconB"
                initial={{opacity: 0, scale: 0.8}}
                animate={{opacity: 1, scale: 1}}
                exit={{opacity: 0, scale: 0.8}}
                transition={{duration: 0.12}}
            >
                <IconB/>
            </motion.span>
        )}
    </AnimatePresence>
);