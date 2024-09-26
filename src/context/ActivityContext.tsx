import { createContext, ReactNode, useReducer, Dispatch, useMemo } from "react";
import { ActivityAction, ActivityState, ActivityReducer, initialState } from "../reducers/activityReducer";
import { Activity } from "../types";
import { categories } from "../data/categories";

type ActivityProviderProps = {
    children: ReactNode
}

type ActivityContextProps = {
    state: ActivityState
    dispatch: Dispatch<ActivityAction>
    caloriesConsumed: number 
    caloriesBurned: number 
    netCalories: number
    categoryName: (categoty: Activity["category"]) => string[]

}

export const ActivityContext = createContext<ActivityContextProps>(null!)

export const ActivityProvider = ({children} : ActivityProviderProps) => {

    const [state, dispatch] = useReducer(ActivityReducer, initialState)

    // contadores, tomar la categoria de comida y sumar sus calorias
    const caloriesConsumed = useMemo(() => state.activities.reduce((total, activity) => activity.category === 1 ? 
                            total + activity.calories : total, 0), [state.activities])

    // contadores, tomar la categoria de comida y sumar sus calorias
    const caloriesBurned = useMemo(() => state.activities.reduce((total, activity) => activity.category === 2 ? 
                            total + activity.calories : total, 0), [state.activities])

    const netCalories = useMemo(() => caloriesConsumed - caloriesBurned, [state.activities])

    // obtener el nombre de la actividad desde data
    // con useMemo mantendremos el array de actividades actualizado, en caso de ser modificado
    // en su callback le pasamos un parametro, que es el id de la categoría
    // hiteramos el array y tomamos los id iguales
    const categoryName = useMemo(
        () => (categoty: Activity['category']) => categories.map( cat => cat.id === categoty ? cat.name : '')
    , [state.activities])

    return (
        <ActivityContext.Provider value={{state, dispatch, caloriesConsumed, caloriesBurned, netCalories, categoryName}}>{children}</ActivityContext.Provider>
    )
}