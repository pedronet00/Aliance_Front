import { Modal } from ".";

interface SimpleModalProps {
  open: boolean;
  message: string;
  onClose: () => void;
}

export function SimpleModal({ open, message, onClose }: SimpleModalProps) {
  return (
    <Modal isOpen={open} onClose={onClose} showCloseButton={false}>
      <div className="p-6 w-[360px] text-center">
        <p className="text-gray-700 dark:text-gray-300 mb-6">{message}</p>

        <button
          onClick={onClose}
          className="px-4 py-2 rounded-lg bg-blue-600 text-white hover:bg-blue-700"
        >
          OK
        </button>
      </div>
    </Modal>
  );
}
