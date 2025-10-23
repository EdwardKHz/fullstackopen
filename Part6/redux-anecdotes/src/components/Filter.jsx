import {useDispatch} from "react-redux";
import {setFilter} from "../reducers/filterReducer.js";

const Filter = () => {
    const dispatch = useDispatch()

    const handleChange = (event) => {
        event.preventDefault()
        console.log("zzz")
        const filter = event.target.value
        dispatch(setFilter(filter))
    }
    const style = {
        marginBottom: 10
    }
    return (
        <div style={style}>
            filter <input name="filter" onChange={handleChange}/>
        </div>
    )
}

export default Filter