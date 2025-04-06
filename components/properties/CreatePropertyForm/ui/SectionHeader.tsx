'use client'

export const SectionHeader = ({
	title,
	description,
}: {
	title: string
	description: string
}) => (
	<div className='space-y-1'>
		<h3 className='text-lg font-semibold'>{title}</h3>
		<p className='text-sm text-muted-foreground'>{description}</p>
	</div>
)
