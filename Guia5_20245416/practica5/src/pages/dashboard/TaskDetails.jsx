import { useEffect, useState } from 'react';
import { useParams, useNavigate, Link } from 'react-router-dom';
import { updateTask, deleteTask, getTaskById } from '../../services/taskService';
import { CATEGORIES, PRIORITIES } from '../../utils/constants';
import { formatDateTime, getDueDateLabel, isOverdue } from '../../utils/dateHelpers';
import { showSuccessToast, showErrorToast } from '../../utils/toastHelpers';
import LoadingSpinner from "../../components/common/LoadingSpinner";
import TaskForm from "../../components/tasks/TaskForm";

export default function TaskDetails() {
  const { taskId } = useParams(); // Obtener ID de la URL
  const navigate = useNavigate();
  const [task, setTask] = useState(null);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState(false);

  useEffect(() => {
    const loadTask = async () => {
      setLoading(true);
      const result = await getTaskById(taskId);

      if (result.success) {
        setTask(result.task);
      } else {
        // Si no existe la tarea, volver al dashboard
        showErrorToast('Tarea no encontrada');
        navigate('/dashboard');
      }

      setLoading(false);
    };
    loadTask();
  }, [taskId]);

  const handleToggleComplete = async () => {
    const result = await updateTask(taskId, {
      completed: !task.completed
    });

    if (result.success) {
      // Actualizar estado local
      setTask({ ...task, completed: !task.completed });
      showSuccessToast(
        !task.completed ? '✓ Tarea completada' : '✓ Tarea marcada como pendiente'
      );
    } else {
      showErrorToast('Error al actualizar tarea');
    }
  };

  const handleDelete = async () => {
    if (window.confirm('¿Estás seguro de eliminar esta tarea?')) {
      const result = await deleteTask(taskId);

      if (result.success) {
        showSuccessToast('✓ Tarea eliminada');
        navigate('/dashboard');
      } else {
        showErrorToast('Error al eliminar tarea');
      }
    }
  };

  if (loading) {
    return <LoadingSpinner />;
  }

  // Mostrar formulario de edición si editing es true
  if (editing) {
    return (
      <div className="max-w-4xl mx-auto p-6">
        <TaskForm
          taskToEdit={task}
          onClose={() => {
            setEditing(false);
            // Recargar tarea actualizada
          }}
        />
      </div>
    );
  }

  const category = CATEGORIES.find(c => c.id === task.category);
  const priority = PRIORITIES.find(p => p.id === task.priority);

  return (
    <div className="max-w-4xl mx-auto p-6">
      {/* Breadcrumb */}
      <div className="mb-6">
        <Link
          to="/dashboard"
          className="text-blue-600 hover:underline flex items-center gap-2"
        >
          ← Volver al Dashboard
        </Link>
      </div>

      <div className="card">
        {/* Header título y botones */}
        <div className="flex justify-between items-start mb-6">
          <div className="flex-1">
            <h1 className="text-3xl font-bold text-gray-800">
              {task.title}
            </h1>
          </div>

          {/* Botones de acción */}
          <div className="flex gap-2">
            <button
              onClick={() => setEditing(true)}
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
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-2">Descripción</h2>
          <p className="text-gray-600 whitespace-pre-wrap">
            {task.description || 'Sin descripción'}
          </p>
        </div>

        {/* Información adicional */}
        <div className="border-t pt-6">
          <h2 className="text-lg font-semibold text-gray-700 mb-4">Información</h2>
          <dl className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <dt className="text-sm font-medium text-gray-500">Creada</dt>
              <dd className="text-gray-900">{formatDateTime(task.createdAt)}</dd>
            </div>

            {task.dueDate && (
              <div>
                <dt className="text-sm font-medium text-gray-500">Fecha de vencimiento</dt>
                <dd className="text-gray-900">{formatDateTime(task.dueDate)}</dd>
              </div>
            )}
          </dl>
        </div>

        {/* Badges de categoría, prioridad y estado */}
        <div className="flex flex-wrap gap-2 mt-4">
          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${category.color}-100 text-${category.color}-800`}>
            {category.label}
          </span>

          <span className={`px-3 py-1 rounded-full text-sm font-medium bg-${priority.color}-100 text-${priority.color}-800`}>
            {priority.label}
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
    </div>
  );
}
