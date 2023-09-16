import ConfirmCancelModal from '@/modals/ConfirmCancelModal.vue';
import { useModalController } from './modal';

interface ConfirmCancelOptions {
  title: string;
  message?: string;
  confirmText?: string;
  cancelText?: string;
  confirmColor?: string;
  cancelColor?: string;
}

const modalController = useModalController();

const confirmCancel = async (options: ConfirmCancelOptions) => {
  const result = await modalController.show<'confirm' | 'cancel'>({
    component: ConfirmCancelModal,
    options: { persistent: true, maxWidth: '500px' },
    props: options,
  });

  return result?.value;
};

export const useDialog = () => {
  return { confirmCancel };
};
