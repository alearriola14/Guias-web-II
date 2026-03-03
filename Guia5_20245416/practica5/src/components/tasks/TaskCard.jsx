import { Link } from 'react-router-dom';
import { updateTask, deleteTask } from '../../services/taskService';
import { CATEGORIES } from '../../utils/constants';
import { getDueDateLabel, isOverdue } from '../../utils/dateHelpers';
import { showSuccessToast, showErrorToast } from '../../utils/toastHelpers';

export default function TaskCard({ task }) {
  const category = CATEGORIES.find(c => c.id === task.category);

  const handleToggleComplete = async (e) => {
    e.preventDefault(); // Evitar que el link navegue
    const result = await updateTask(task.id, { completed: !task.completed });
    
    if (result.success) {
      showSuccessToast(
        !task.completed ? '✓ Tarea completada' : '✓ Tarea marcada como pendiente'
      );
    } else {
      showErrorToast('Error al actualizar tarea');
    }
  };

  const handleDelete = async (e) => {
    e.preventDefault();
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      const result = await deleteTask(task.id);
      
      if (result.success) {
        showSuccessToast('✓ Tarea eliminada');
      } else {
        showErrorToast('Error al eliminar tarea');
      }
    }
  };

  return (
    <Link to={`/tasks/${task.id}`} className="block">
      <div className="card hover:shadow-lg transition-shadow">
        {/* Header con títulos y botones */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h3 className="text-xl font-bold text-gray-800">
              {task.title}
            </h3>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <button
              onClick={() => {}}
              className="btn-secondary"
            >
              Editar
            </button>
            <button
              onClick={handleDelete}
              className="btn-danger"
            >
              Eliminar
            </button>
          </div>
        </div>

        {/* Descripción */}
        {task.description && (
          <div className="border-t pt-6">
            <h2 className="text-lg font-semibold text-gray-700 mb-2">Descripción</h2>
            <p className="text-gray-600 whitespace-pre-wrap">
              {task.description}
            </p>
          </div>
        )}

        {/* Información adicional */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${category.color}-100 text-${category.color}-800`}>
            {category.label}
          </span>

          <span className={`px-3 py-1 rounded-full text-sm font-medium ${task.completed ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'}`}>
            {task.completed ? 'Completada' : 'Pendiente'}
          </span>

          {task.dueDate && (
            <span className={`px-3 py-1 rounded-full text-sm font-medium ${
              isOverdue(task.dueDate, task.completed)
                ? 'bg-red-100 text-red-800'
                : 'bg-blue-100 text-blue-800'
            }`}>
              Vence: {getDueDateLabel(task.dueDate)}
            </span>
          )}
        </div>

        {/* Botón de toggle completado */}
        <div className="border-t pt-6">
          <button
            onClick={handleToggleComplete}
            className={task.completed ? 'btn-secondary w-full' : 'btn-primary w-full'}
          >
            {task.completed ? 'Marcar como pendiente' : 'Marcar como completada'}
          </button>
        </div>
      </div>
    </Link>
  );
}
