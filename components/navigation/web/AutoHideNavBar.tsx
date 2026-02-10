import {YStack} from 'tamagui';
import {useState, useEffect} from 'react';


type AutoHideNavBarProps = {
  enabled: boolean
  navHeight?: number
  children: React.ReactNode
}

export function AutoHideNavBar({ enabled, navHeight = 60, children }: AutoHideNavBarProps) {
    const [open, setOpen] = useState(true)

    const visible = enabled ? open : true

    const onMouseMove = (e: any) => {
        if (!enabled) return
        setOpen(e?.clientY < navHeight)
    }

    useEffect(() => {
        setOpen(!(enabled))
    }, [enabled])

  return (
    <div onMouseMove={onMouseMove} style={{position: 'relative', top: 0, left: 0, right: 0, zIndex: 999, width: '100%'}}>
        <YStack
        position="relative"
        top={0}
        left={0}
        right={0}
        height={visible ? 60 : 0}
        animation="quick"
        opacity={visible ? 1 : 0}
        zIndex={999}
        backgroundColor="$background"
        >
        {children}
        </YStack>
    </div>
  );
}
