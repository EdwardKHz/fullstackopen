const PersonForm = (props) => {
   return (
       <form onSubmit={props.handleSubmit}>
           <h2>add a new</h2>
           <div>
               name: <input value={props.newName} required={true} onChange={(e) => props.setNewName(e.target.value)}/>
           </div>
           <div>
               number: <input value={props.newNumber} required={true} onChange={(e) => props.setNewNumber(e.target.value)}/>
           </div>
           <div>
               <button type="submit">add</button>
           </div>
       </form>
   )
}

export default PersonForm;