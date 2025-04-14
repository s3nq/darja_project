// components/ui/tooltip.tsx
'use client'

import { cn } from '@/lib/utils'
import * as TooltipPrimitive from '@radix-ui/react-tooltip'

const TooltipProvider = TooltipPrimitive.Provider

const Tooltip = TooltipPrimitive.Root

const TooltipTrigger = TooltipPrimitive.Trigger

const TooltipContent = ({
	className,
	...props
}: React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>) => (
	<TooltipPrimitive.Content
		sideOffset={4}
		className={cn(
			'z-50 rounded-md bg-black px-3 py-2 text-white shadow-md',
			className
		)}
		{...props}
	/>
)

export { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger }
