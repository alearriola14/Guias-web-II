import { categories } from "../data/categories"
import { useContext } from "react"
import { BudgetDispatchContext } from "../context/BudgetContext"
import {
    LeadingActions,
    SwipeableList,
    SwipeableListItem,
    SwipeAction,
    TrailingActions,
    } from 'react-swipeable-list';
import 'react-swipeable-list/dist/styles.css';
export const ExpenseDetails = ({ expense }) => {

    const dispatch = useContext(BudgetDispatchContext) // recuperando el dispatch del reducer desde el context

// Define una acción que se mostrará cuando el usuario deslice hacia la izquierda.
const leadingAction = () => (
    <LeadingActions> {/* Contenedor de acciones a la izquierda */}
        <SwipeAction onClick={() => dispatch ({type:"get-expense-by-id", payload: {id: expense.id}})}>{/* Acción de actualización (sin lógica implementada por ahora) */}
            Actualizar
        </SwipeAction>
    </LeadingActions>
);

// Define una acción que se mostrará cuando el usuario deslice hacia la derecha.
const trailingAction = () => (
    <TrailingActions> {/* Contenedor de acciones a la derecha */}
        <SwipeAction destructive={true}
            onClick={() => {dispatch({type:"remove-expense", payload: {id:expense.id}})}}
        >
            Eliminar
        </SwipeAction>
    </TrailingActions>
);


    const categoryInfo = categories.find(cat => cat.id === expense.category) //recuperando el nombre de la categoria
    return (
        <SwipeableList>
            <SwipeableListItem maxSwipe={1} leadingActions={leadingAction()} trailingActions={trailingAction()}>
                <div className="bg-white shadow-lg p-10 w-full border-b border-gray-200 flex gap-5 items-center">
                    <div>
                        <img src={`/icono_${categoryInfo.icon}.svg`} alt="Icono gasto"
                            className="w-20" />
                    </div>
                    <div className="flex-1">
                        <p className="text-sm font-bold uppercase text-slate-500">{categoryInfo.name}</p>
                        <p>{expense.expenseName}</p>
                        <p className="text-slate-600 text-sm">
                            {expense.date ? new Date(expense.date).toLocaleDateString("es-ES", { weekday: "long", day: "numeric", month: "long", year: "numeric" }) : "Fecha no disponible"}
                        </p>
                    </div>
                    <div className="text-2xl text-blue-600 font-bold">
                        <span className="font-black text-black"> ${expense.amount}</span>
                    </div>
                </div>
            </SwipeableListItem>
        </SwipeableList>
    )
}