import { useState, ChangeEvent, FormEvent, useEffect } from "react"
import { v4 as uuidv4 } from "uuid"
import { categories } from "../data/categories"
import { Activity } from "../types"
import { useActivity } from "../hooks/useActivity"


export default function Form() {

    const { state, dispatch } = useActivity()

    const initialState : Activity = {
        id: uuidv4(),
        category: 1,
        name: '',
        calories: 0
    }

    const [activity, setActivity] = useState<Activity>(initialState)

    // cuando pulsen el boton de editar, tomar el state de la actividad
    useEffect(() => {
        if (state.activeId) {
            // filter, retorna un array, con [0] al final, retorna un objeto
            const selectedActivity = state.activities.filter( stateActivity => stateActivity.id === state.activeId )[0]
            setActivity(selectedActivity) // setear state y mostrar en el form
        }
    }, [state.activeId])

    // el type de e, VSC lo proporciona
    const handleChange = (e: ChangeEvent<HTMLSelectElement> | ChangeEvent<HTMLInputElement>) => {

        // detectar el input
        const isNumberField = ['category', 'calories'].includes(e.target.id)
        setActivity({
            ...activity,
            [e.target.id]: isNumberField ? +e.target.value : e.target.value.toUpperCase() // cambiar a number o no
        })
    }

    // funcion para deshabilitar el boton submit
    const isValidActivity = () => {
        const { name, calories } = activity
        return name.trim() !== '' && calories > 0
    }

    // el type de e, VSC lo proporciona
    const handleSubmit = (e: FormEvent<HTMLFormElement>) => {
        e.preventDefault()
        
        // con la funcion dispatch se ejecutan los reducers creados
        dispatch({ type: 'save-activity', payload: {newActivity: activity} })

        setActivity({
            ...initialState,
            id: uuidv4()
        }) // reiniciar state y form
    }

    return (
        <form className="space-y-5 bg-white shadow p-10 rounded-lg" onSubmit={handleSubmit}>
            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="category">Categoría:</label>
                <select name="category" id="category" value={activity.category}
                        className="border border-slate-300 p-2 rounded-lg w-full bg-white"
                        onChange={handleChange} >
                    {categories.map(category => (
                        <option value={category.id} key={category.id}>{category.name}</option>
                    ))}
                </select>
            </div>

            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="name">Actividad:</label>
                <input type="text" name="name" id="name" 
                        placeholder="Ej. Comida, jugo de naranja, ejercicio, pesas, bicicleta" 
                        className="border border-slate-300 p-2 rounded-lg" 
                        value={activity.name} 
                        onChange={handleChange} />
            </div>

            <div className="grid grid-cols-1 gap-3">
                <label htmlFor="calories">Calorías:</label>
                <input type="number" name="calories" id="calories" 
                        placeholder="Ej. 300 o 500" 
                        className="border border-slate-300 p-2 rounded-lg" 
                        value={activity.calories} 
                        onChange={handleChange} />
            </div>

            <input type="submit" value={activity.category === 1 ? 'Guardar comida' : 'Guardar calorías'} 
                disabled={!isValidActivity()}
                className="bg-gray-800 hover:bg-gray-900 w-full p-2 disabled:opacity-10 font-bold uppercase text-white cursor-pointer" />
        </form>
    )
}
