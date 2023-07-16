export interface BillboardType {
	id: string
	label: string
	imageUrl: string
}

export interface CategoryType {
	id: string
	name: string
	billboard: BillboardType
}

export interface ProductType {
	id: string
	name: string
	price: string
	isFeatured: boolean
	category: CategoryType
	size: Size
	color: Color
	images: ImageType[]
}

export interface ImageType {
	id: string
	url: string
}

export interface Size {
	id: string
	name: string
	value: string
}

export interface Color {
	id: string
	name: string
	value: string
}
