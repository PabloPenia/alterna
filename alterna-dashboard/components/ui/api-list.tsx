'use client'

import useOrigin from '@/hooks/useOrigin'
import { useParams } from 'next/navigation'
import ApiAlert from './api-alert'

type ComponentProps = {
	entityName: string
	entityId: string
}

export default function ApiList({ entityId, entityName }: ComponentProps) {
	const params = useParams()
	const origin = useOrigin()

	const baseUrl = `${origin}/api/${params.storeId}`
	return (
		<>
			<ApiAlert
				title='GET'
				description={`${baseUrl}/${entityName}`}
				variant='public'
			/>
			<ApiAlert
				title='GET'
				description={`${baseUrl}/${entityName}/{${entityId}}`}
				variant='public'
			/>
			<ApiAlert
				title='POST'
				description={`${baseUrl}/${entityName}`}
				variant='admin'
			/>
			<ApiAlert
				title='PATCH'
				description={`${baseUrl}/${entityName}/{${entityId}}`}
				variant='admin'
			/>
			<ApiAlert
				title='DELETE'
				description={`${baseUrl}/${entityName}/{${entityId}}`}
				variant='admin'
			/>
		</>
	)
}
