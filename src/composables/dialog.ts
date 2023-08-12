import ConfirmCancelModal from '@/modals/ConfirmCancelModal.vue';
import { useModalController } from './modal';

interface ConfirmCancelOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
}

const modalController = useModalController();

const confirmCancel = async (options: ConfirmCancelOptions) => {
  return await modalController.show<'confirm' | 'cancel'>({
    component: ConfirmCancelModal,
    options: { persistent: true, maxWidth: '500px' },
    props: options,
  });
};

export const useDialog = () => {
  return { confirmCancel };
};
