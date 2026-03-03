import { create } from 'zustand';
import { auth } from '../services/firebase';
import { onAuthStateChanged } from 'firebase/auth';

export const useAuthStore = create((set) => ({
  // Estado
  user: null,
  loading: true,
  error: null,

  // Actualizar el usuario autenticado
  setUser: (user) => set({ user, loading: false, error: null }),

  // Limpiar usuario al cerrar sesión
  clearUser: () => set({ user: null, loading: false, error: null }),

  // Actualizar estado de carga
  setLoading: (loading) => set({ loading }),

  // Establecer error
  setError: (error) => set({ error }),

  // Escuchar cambios de autenticación de Firebase
  // Se ejecuta cuando el usuario inicia sesión, cierra sesión o recarga la página
  initializeAuth: () => {
    onAuthStateChanged(auth, (user) => {
      if (user) {
        set({
          user: {
            uid: user.uid,
            email: user.email,
            displayName: user.displayName
          },
          loading: false
        });
      } else {
        set({ user: null, loading: false });
      }
    });
  }
}));
