import * as React from "react";
import {IconSvgProps} from "@/types";
import {AnimatePresence, motion} from "framer-motion";


export const AnimatedIconSwap = (
    isToggled: boolean,
    IconA: React.ComponentType<IconSvgProps>,
    IconB: React.ComponentType<IconSvgProps>
): React.JSX.Element => (
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

export const LOGO: React.FC<IconSvgProps> = ({
                                                 size = 24,
                                                 width,
                                                 height,
                                                 className,
                                                 ...props
                                             }) => (
    <svg
        width={size || width}
        height={size || height}
        viewBox="0 0 144 144"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        className={className}
        {...props}
    >
        <path
            d="M74.5753 16.7531C74.3367 16.8513 73.9439 17.16 73.7053 17.4407C72.9477 18.2966 72.9196 19.5173 73.6212 20.3451C74.1263 20.9484 74.5612 21.1449 75.6978 21.2571C78.4198 21.5237 81.689 22.4217 84.0883 23.5722C89.0273 25.9295 93.2647 30.0967 95.5517 34.8533C96.8847 37.6454 97.5582 40.1851 97.8107 43.4964C97.9931 45.7975 98.1896 46.3728 98.9753 46.8639C99.9435 47.4532 100.996 47.369 101.894 46.6113C102.511 46.0922 102.708 45.5029 102.708 44.212C102.708 40.7603 101.641 36.2844 99.9715 32.7626C95.9306 24.1756 87.8487 18.1843 78.4619 16.7672C76.7922 16.5146 75.1365 16.5006 74.5753 16.7531Z"
            fill="currentColor"/>
        <path
            d="M74.5752 26.7854C73.9018 27.0941 73.6071 27.4028 73.3124 28.1043C73.0318 28.7778 73.0459 29.1146 73.3966 29.8302C73.7755 30.6159 74.3227 30.9386 75.7679 31.2052C80.8612 32.1453 85.0003 35.2742 87.0629 39.7501C87.6662 41.0691 88.0591 42.4722 88.3117 44.3243C88.48 45.545 88.5783 45.8537 88.915 46.2746C89.5183 47.0042 90.1497 47.3129 90.9635 47.2427C91.7212 47.1726 92.2404 46.8639 92.7315 46.1483C93.0401 45.6993 93.0542 45.5871 92.984 44.0577C92.8577 41.4339 92.0299 38.782 90.4865 36.088C87.6943 31.2333 82.6712 27.6834 77.2552 26.7293C75.6697 26.4627 75.2628 26.4627 74.5752 26.7854Z"
            fill="currentColor"/>
        <path
            d="M50.3295 38.1645C48.8843 38.6275 47.7759 39.6097 47.1164 41.0549L46.7937 41.7424V54.5809L46.7937 67.4193L47.2567 68.3594C47.832 69.524 48.9264 70.5763 50.0629 71.0113C50.8487 71.334 50.9469 71.334 56.2366 71.306L61.5965 71.2779L61.5965 82.9939L61.5965 94.7098L60.7406 94.2889C59.5199 93.6715 57.0083 92.6473 55.1562 92.0299C45.1941 88.6765 35.4145 90.4163 26.4486 97.1372C25.2139 98.0633 24.9613 98.3158 24.821 98.7788C24.5965 99.5085 24.8631 100.21 25.5787 100.799C26.7012 101.697 28.7217 101.431 32.8047 99.8452C39.7641 97.1372 44.4365 96.604 49.5438 97.9229C52.3219 98.6385 54.4827 99.6207 60.9931 103.072C70.1414 107.941 76.2169 110.284 82.5028 111.393C84.9021 111.814 86.7402 111.968 89.5324 111.968C93.419 111.968 96.7444 111.435 100.392 110.214C105.991 108.362 110.074 105.865 113.89 101.992C116.023 99.8312 117.693 97.5581 118.857 95.243C119.517 93.9381 119.545 93.447 119.04 93.0401C118.464 92.5911 118.015 92.6753 117.075 93.3909C115.925 94.2889 113.034 96.1831 111.267 97.1933C106.089 100.168 101.262 101.978 96.1831 102.876C94.1486 103.227 88.7186 103.367 86.193 103.143C80.9033 102.651 74.3507 100.729 68.2332 97.8668L66.788 97.1933L66.788 84.3128L66.788 71.4463L72.0216 71.3901C76.6097 71.334 77.3253 71.306 77.9567 71.0815C79.4861 70.5483 80.7209 69.2293 81.1979 67.6438C81.4084 66.9282 81.4364 65.7356 81.4224 54.5107C81.4084 42.4019 81.4084 42.1493 81.1137 41.3355C80.5946 39.8342 79.43 38.6836 77.9567 38.1505C77.2131 37.8979 76.6799 37.8839 64.1642 37.8979C51.8729 37.8979 51.1012 37.9119 50.3295 38.1645ZM66.1847 48.7159C68.5138 49.5858 70.0993 51.5081 70.4361 53.8934C70.7027 55.7876 70.0432 57.6818 68.6261 59.0708C66.4232 61.2176 63.2241 61.4842 60.6283 59.7584C58.0466 58.0325 57.1627 54.5668 58.6079 51.7185C59.3094 50.3435 61.1335 48.8983 62.6208 48.5475C63.5889 48.309 65.3428 48.3932 66.1847 48.7159Z"
            fill="currentColor"/>
        <path
            d="M39.9886 105.163C36.8737 105.612 32.3417 107.099 31.7524 107.885C31.6541 108.011 31.5699 108.334 31.5699 108.629C31.5699 109.022 31.6682 109.218 31.9768 109.485C32.3276 109.779 32.6082 109.835 34.292 109.99C39.8764 110.495 44.3523 112.179 52.1956 116.739C58.1869 120.218 61.9473 122.042 66.0443 123.417C75.1645 126.476 84.1725 126.462 92.7315 123.389C95.9446 122.225 100.14 119.98 101.206 118.829C101.697 118.296 101.711 117.693 101.234 117.23C101.052 117.033 100.771 116.879 100.603 116.879C100.449 116.879 99.5786 117.103 98.6806 117.37C90.262 119.924 81.8714 119.348 72.218 115.56C68.7944 114.213 66.2408 113.034 60.6845 110.228C54.2442 106.973 51.6765 105.977 48.0284 105.303C46.3447 104.981 41.7705 104.91 39.9886 105.163Z"
            fill="currentColor"/>
    </svg>
);

export const CloudIcon: React.FC<IconSvgProps> = ({
                                                      size = 24,
                                                      width,
                                                      height,
                                                      className,
                                                      ...props
                                                  }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        width={size || width}
        height={size || height}
        className={className}
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 15a4.5 4.5 0 0 0 4.5 4.5H18a3.75 3.75 0 0 0 1.332-7.257 3 3 0 0 0-3.758-3.848 5.25 5.25 0 0 0-10.233 2.33A4.502 4.502 0 0 0 2.25 15Z"
        />
    </svg>
);

export const ChevronDown: React.FC<IconSvgProps> = ({
                                                        fill,
                                                        size = 24,
                                                        height,
                                                        width,
                                                        className,
                                                        ...props
                                                    }) => {
    return (
        <svg
            fill="none"
            height={size || height}
            viewBox="0 0 24 24"
            width={size || width}
            xmlns="http://www.w3.org/2000/svg"
            className={className}
            {...props}
        >
            <path
                d="m19.92 8.95-6.52 6.52c-.77.77-2.03.77-2.8 0L4.08 8.95"
                stroke={fill}
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeMiterlimit={10}
                strokeWidth={1.5}
            />
        </svg>
    );
};

export const InfoIcon: React.FC<IconSvgProps> = ({
                                                     size = 24,
                                                     width,
                                                     height,
                                                     className,
                                                     ...props
                                                 }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        width={size || width}
        height={size || height}
        className={className}
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 17v-6m0-4h.01M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z"
        />
    </svg>
);

export const MapIcon: React.FC<IconSvgProps> = ({
                                                    size = 24,
                                                    width,
                                                    height,
                                                    className,
                                                    ...props
                                                }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke={"currentColor"}
        width={size || width}
        height={size || height}
        className={className}
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9 6.75V15m6-6v8.25m.503 3.498 4.875-2.437c.381-.19.622-.58.622-1.006V4.82c0-.836-.88-1.38-1.628-1.006l-3.869 1.934c-.317.159-.69.159-1.006 0L9.503 3.252a1.125 1.125 0 0 0-1.006 0L3.622 5.689C3.24 5.88 3 6.27 3 6.695V19.18c0 .836.88 1.38 1.628 1.006l3.869-1.934c.317-.159.69-.159 1.006 0l4.994 2.497c.317.158.69.158 1.006 0Z"
        />
    </svg>
);


export const QuestionMarkIcon: React.FC<IconSvgProps> = ({
                                                             size = 24,
                                                             width,
                                                             height,
                                                             className,
                                                             ...props
                                                         }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke={"currentColor"}
        width={size || width}
        height={size || height}
        className={className}
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.879 7.519c1.171-1.025 3.071-1.025 4.242 0 1.172 1.025 1.172 2.687 0 3.712-.203.179-.43.326-.67.442-.745.361-1.45.999-1.45 1.827v.75M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Zm-9 5.25h.008v.008H12v-.008Z"
        />
    </svg>
);


export const MoonFilledIcon: React.FC<IconSvgProps> = ({
                                                           size = 24,
                                                           width,
                                                           height,
                                                           ...props
                                                       }: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <path
            d="M21.53 15.93c-.16-.27-.61-.69-1.73-.49a8.46 8.46 0 01-1.88.13 8.409 8.409 0 01-5.91-2.82 8.068 8.068 0 01-1.44-8.66c.44-1.01.13-1.54-.09-1.76s-.77-.55-1.83-.11a10.318 10.318 0 00-6.32 10.21 10.475 10.475 0 007.04 8.99 10 10 0 002.89.55c.16.01.32.02.48.02a10.5 10.5 0 008.47-4.27c.67-.93.49-1.519.32-1.79z"
            fill="currentColor"
        />
    </svg>
);

export const SunFilledIcon: React.FC<IconSvgProps> = ({
                                                          size = 24,
                                                          width,
                                                          height,
                                                          ...props
                                                      }: IconSvgProps) => (
    <svg
        aria-hidden="true"
        focusable="false"
        height={size || height}
        role="presentation"
        viewBox="0 0 24 24"
        width={size || width}
        {...props}
    >
        <g fill="currentColor">
            <path d="M19 12a7 7 0 11-7-7 7 7 0 017 7z"/>
            <path
                d="M12 22.96a.969.969 0 01-1-.96v-.08a1 1 0 012 0 1.038 1.038 0 01-1 1.04zm7.14-2.82a1.024 1.024 0 01-.71-.29l-.13-.13a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.984.984 0 01-.7.29zm-14.28 0a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a1 1 0 01-.7.29zM22 13h-.08a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zM2.08 13H2a1 1 0 010-2 1.038 1.038 0 011.04 1 .969.969 0 01-.96 1zm16.93-7.01a1.024 1.024 0 01-.71-.29 1 1 0 010-1.41l.13-.13a1 1 0 011.41 1.41l-.13.13a.984.984 0 01-.7.29zm-14.02 0a1.024 1.024 0 01-.71-.29l-.13-.14a1 1 0 011.41-1.41l.13.13a1 1 0 010 1.41.97.97 0 01-.7.3zM12 3.04a.969.969 0 01-1-.96V2a1 1 0 012 0 1.038 1.038 0 01-1 1.04z"/>
        </g>
    </svg>
);

export const FilterIcon: React.FC<IconSvgProps> = ({
                                                       size = 24,
                                                       width,
                                                       height,
                                                       className,
                                                       ...props
                                                   }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        width={size || width}
        height={size || height}
        className={className}
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3c2.755 0 5.455.232 8.083.678.533.09.917.556.917 1.096v1.044a2.25 2.25 0 0 1-.659 1.591l-5.432 5.432a2.25 2.25 0 0 0-.659 1.591v2.927a2.25 2.25 0 0 1-1.244 2.013L9.75 21v-6.568a2.25 2.25 0 0 0-.659-1.591L3.659 7.409A2.25 2.25 0 0 1 3 5.818V4.774c0-.54.384-1.006.917-1.096A48.32 48.32 0 0 1 12 3Z"
        />
    </svg>
);

export const GoogleIcon: React.FC<IconSvgProps> = ({
                                                       size = 24,
                                                       width,
                                                       height,
                                                       className,
                                                       ...props
                                                   }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 256 262"
        width={width ?? size}
        height={height ?? size}
        className={className}
        {...props}
    >
        <path
            d="M255.89 133.52c0-9.24-.83-18.08-2.4-26.63H130.38v50.46h70.57c-3.05 16.48-12.18 30.42-25.88 39.78v33.04h41.85c24.49-22.55 38.97-55.78 38.97-96.65z"
            fill="#4285F4"
        />
        <path
            d="M130.38 262c35.21 0 64.76-11.58 86.34-31.45l-41.85-33.04c-11.63 7.8-26.54 12.4-44.49 12.4-34.19 0-63.14-23.07-73.52-54.07H14.18v33.94C35.65 234.26 80.18 262 130.38 262z"
            fill="#34A853"
        />
        <path
            d="M56.86 155.84a78.47 78.47 0 0 1 0-49.68V72.22H14.18a130.22 130.22 0 0 0 0 117.56l42.68-33.94z"
            fill="#FBBC05"
        />
        <path
            d="M130.38 51.34c19.12 0 36.32 6.58 49.87 19.47l37.45-37.45C193.41 11.58 163.86 0 130.38 0 80.18 0 35.65 27.74 14.18 72.22l42.68 33.94c10.38-31 39.33-54.82 73.52-54.82z"
            fill="#EA4335"
        />
    </svg>
);

export const MagicLinkIcon: React.FC<IconSvgProps> = ({
                                                          size = 24,
                                                          width,
                                                          height,
                                                          className,
                                                          ...props
                                                      }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width={width ?? size}
        height={height ?? size}
        fill="none"
        stroke="currentColor"
        strokeWidth={0.5}
        strokeLinecap="round"
        strokeLinejoin="round"
        vectorEffect="non-scaling-stroke"
        shapeRendering="geometricPrecision"
        className={className}
        {...props}
    >
        <g transform="translate(0 2)">
            <path d="M9 5l.75 2.25 2.25.75-2.25.75L9 11l-.75-2.25-2.25-.75 2.25-.75L9 5Z"/>
            <path d="M17 6l.56 1.69 1.69.56-1.69.56L17 10.5l-.56-1.69-1.69-.56 1.69-.56L17 6Z"/>
            <path d="M14 11.5l.6 1.8 1.8.6-1.8.6-.6 1.8-.6-1.8-1.8-.6 1.8-.6.6-1.8Z"/>
        </g>
    </svg>
);

export const EyeIcon: React.FC<IconSvgProps> = ({
                                                    size = 24,
                                                    width,
                                                    height,
                                                    className,
                                                    ...props
                                                }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        width={size || width}
        height={size || height}
        className={className}
        {...props}
    >
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M2.25 12s3.75-6.75 9.75-6.75S21.75 12 21.75 12 18 18.75 12 18.75 2.25 12 2.25 12Z"
        />
        <circle cx="12" cy="12" r="3.75" strokeLinecap="round" strokeLinejoin="round"/>
    </svg>
);

export const EyeSlashIcon: React.FC<IconSvgProps> = ({
                                                         size = 24,
                                                         width,
                                                         height,
                                                         className,
                                                         ...props
                                                     }) => (
    <svg
        xmlns="http://www.w3.org/2000/svg"
        fill="none"
        viewBox="0 0 24 24"
        strokeWidth={1.5}
        stroke="currentColor"
        width={size || width}
        height={size || height}
        className={className}
        {...props}
    >
        <path strokeLinecap="round" strokeLinejoin="round" d="M3 3l18 18"/>
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M10.605 5.645A10.463 10.463 0 0112 5.25c6 0 9.75 6.75 9.75 6.75a17.96 17.96 0 01-4.183 4.555M6.604 6.604C3.967 8.302 2.25 12 2.25 12s3.75 6.75 9.75 6.75c1.414 0 2.758-.306 4.01-.864"
        />
        <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M9.424 9.424a3.75 3.75 0 005.151 5.151"
        />
    </svg>
);