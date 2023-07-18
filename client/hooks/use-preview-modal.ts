import { ProductType } from '@/types'
import { create } from 'zustand'

type ModalProps = {
	isOpen: boolean
	onOpen: (data: ProductType) => void
	onClose: () => void
	data?: ProductType
}
const usePreviewModal = create<ModalProps>((set) => ({
	isOpen: false,
	data: undefined,
	onOpen: (data: ProductType) => set({ data, isOpen: true }),
	onClose: () => set({ isOpen: false }),
}))

export default usePreviewModal
