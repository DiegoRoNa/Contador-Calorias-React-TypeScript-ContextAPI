import { Activity } from "../types"

// types para las acciones del reducer que modificaran el state
/**
 * Las acciones nos ayudan a describir que es lo que está pasando y que información
 * va a modificar en el state
 * 
 * El "type", es la accion que se va a ejecutar
 * El "payload", es la información que se va a guardar
 */
export type ActivityAction = 
    { type: 'save-activity', payload: {newActivity : Activity} } | // guardar actividad nueva
    { type: 'set-activeId', payload: {id : Activity['id']} } | // tomar id de actividad a editar
    { type: 'delete-activeId', payload: {id : Activity['id']} } | // tomar id de actividad a eliminar
    { type: 'restart-app' } // tomar id de actividad a eliminar

// type del state del reducer
export type ActivityState = {
    activities: Activity[]
    activeId: Activity['id']
}

// valor inicial del reducer
// leer primero si hay algo en local storage
const localStorageActivies = () : Activity[] => {
    const activities = localStorage.getItem('activities')
    return activities ? JSON.parse(activities) : []
}
export const initialState : ActivityState = {
    activities: localStorageActivies(),
    activeId: '' // para saber cual es la actividad a editar
}

// reducer
/**
 * Maneja la logica del state
 */
export const ActivityReducer = (state : ActivityState = initialState, action : ActivityAction) => {
    
    // guardar actividad nueva
    if (action.type === 'save-activity') {
        
        let updatedActivities : Activity[] = []

        // antes de guardar los datos del form, saber si se está editando o creando
        if (state.activeId) { // editando
            updatedActivities = state.activities.map( activity => activity.id === state.activeId ? action.payload.newActivity : activity )
        } else { // creando
            updatedActivities = [...state.activities, action.payload.newActivity] // se agrega la nueva actividad al array de actividades
        }


        return {
            ...state, // la copia siempre debe estar por defecto en el return
            activities: updatedActivities,
            activeId: ''
        }
    }

    // tomar id de actividad a editar
    if (action.type === 'set-activeId') {

        return {
            ...state, // la copia siempre debe estar por defecto en el return
            activeId: action.payload.id
        }
    }

    // tomar id de actividad a eliminar
    if (action.type === 'delete-activeId') {

        return {
            ...state, // la copia siempre debe estar por defecto en el return
            activities: state.activities.filter( activity => activity.id !== action.payload.id ) // eliminar del array
        }
    }

    // reiniciar app
    if (action.type === 'restart-app') {

        return {
            activeId: '',
            activities: []
        }
    }

    return state
}

