const Person = ({name, number, id, handleDelete}) => {
    return (
        <div>
            {name} {number}
            <button onClick={() => handleDelete(id)}>delete</button>
        </div>
    )
}

export default Person;