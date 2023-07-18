import { ProductType } from '@/types'
import { toast } from 'react-hot-toast'
import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'

type CartProps = {
	items: ProductType[]
	addItem: (data: ProductType) => void
	removeItem: (id: string) => void
	removeAll: () => void
}
const useCart = create(
	persist<CartProps>(
		(set, get) => ({
			items: [],
			addItem: (data: ProductType) => {
				const currentItems = get().items
				const existingItem = currentItems.find((item) => item.id === data.id)

				if (existingItem) {
					return toast('El producto ya existe en el carro')
				}

				set({ items: [...get().items, data] })
				toast.success('Producto agregado al carro')
			},
			removeItem: (id: string) => {
				set({ items: [...get().items.filter((item) => item.id !== id)] })
				toast.success('El producto se ha eliminado del carro.')
			},
			removeAll: () => set({ items: [] }),
		}),
		{
			name: 'cart-storage',
			storage: createJSONStorage(() => localStorage),
		}
	)
)

export default useCart
