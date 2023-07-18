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
	size: SizeType
	color: ColorType
	images: ImageType[]
}

export interface ImageType {
	id: string
	url: string
}

export interface SizeType {
	id: string
	name: string
	value: string
}

export interface ColorType {
	id: string
	name: string
	value: string
}
