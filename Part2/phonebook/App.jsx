import {useEffect, useState} from 'react'
import Filter from "./components/Filter.jsx";
import PersonForm from "./components/PersonForm.jsx";
import Person from "./components/Person.jsx";
import {addPerson, deletePerson, getAll, updatePerson} from "./services/persons.js";
import Notification from "./components/Notification.jsx";

const App = () => {
    const [persons, setPersons] = useState([]);
    const [newName, setNewName] = useState('');
    const [newNumber, setNewNumber] = useState('');
    const [filter, setFilter] = useState('');
    const [notification, setNotification] = useState({message: null, color: "", background: ""});

    useEffect(() => {
        getAll().then(persons => {
            setPersons(persons);
        })
    }, []);

    const handleSubmit = (event) => {
        event.preventDefault();
        const newPerson = {name: newName, number: newNumber};
        const existingPerson = persons.find(person => (
            person.name === newName
        ));
        if (existingPerson) {
            if (window.confirm(`${existingPerson.name} is already in the phonebook, replace the old number with the new one?`)) {
                updatePerson(existingPerson.id, newPerson).then(returnedPerson => {
                        setPersons(persons.map(person => person.id !== existingPerson.id ? person : returnedPerson));
                    }
                ).catch(error => {
                    showNotification(`Information of ${existingPerson.name} has been deleted from the server`, "red", "#f5d4d4")
                    setPersons(persons.filter(person => person.id !== existingPerson.id))
                });
            }
        } else {
            addPerson(newPerson).then(createdPerson => {
                setPersons(persons.concat(createdPerson));
                showNotification(`${createdPerson.name} has been added successfully.`, "green", "#d4f5d4");
            })
        }
        setNewName("");
        setNewNumber("");
    }

    const handleDelete = (id) => {
        const person = persons.find(p => p.id === id);

        if (window.confirm(`Delete ${person.name}?`)) {
            deletePerson(id).then(() => {
                setPersons(persons.filter(p => p.id !== id));
            });
        }
    };

    const showNotification = (message, color, background) => {
        setNotification({message, color, background});
        setTimeout(() => {
            setNotification({message: null, color: "", background: ""});
        }, 5000);
    };


    const personFilter = persons.filter(person =>
        person.name.toLowerCase().includes(filter.toLowerCase())
    )

    return (
        <div>
            <h2>Phonebook</h2>
            <Notification message={notification.message} color={notification.color} background={notification.background}/>
            <Filter filter={filter} setFilter={setFilter}/>
            <PersonForm handleSubmit={handleSubmit} newName={newName} newNumber={newNumber} setNewName={setNewName}
                        setNewNumber={setNewNumber}/>
            <h2>Numbers</h2>
            {personFilter.map(person => (
                <Person name={person.name} number={person.number} key={person.id} id={person.id}
                        handleDelete={handleDelete}/>
            ))}
        </div>
    )
}

export default App