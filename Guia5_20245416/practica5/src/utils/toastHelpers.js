import toast from 'react-hot-toast';

/**
 * Mostrar notificación de éxito
 */
export const showSuccessToast = (message) => {
  toast.success(message, {
    duration: 3000,
    position: 'top-right'
  });
};

/**
 * Mostrar notificación de error
 */
export const showErrorToast = (message) => {
  toast.error(message, {
    duration: 4000,
    position: 'top-right'
  });
};

/**
 * Mostrar notificación de carga
 */
export const showLoadingToast = (message) => {
  return toast.loading(message, {
    position: 'top-right'
  });
};

/**
 * Mostrar notificación personalizada
 */
export const showToast = (message, type = 'blank') => {
  toast(message, {
    duration: 3000,
    position: 'top-right',
    icon: '✓'
  });
};

/**
 * Actualizar una notificación existente
 */
export const updateToast = (toastId, message, type = 'success') => {
  if (type === 'success') {
    toast.success(message, { id: toastId });
  } else if (type === 'error') {
    toast.error(message, { id: toastId });
  } else {
    toast(message, { id: toastId });
  }
};
