import { createContext, useReducer } from 'react'


const NotificationContext = createContext()


function notificationReducer(state, action) {
  switch (action.type) {
    case 'SET':
      return action.payload
    case 'CLEAR':
      return ''
    default:
      throw new Error(`Unhandled action type: ${action.type}`)
  }
}

export const NotificationContextProvider = ({ children }) => {
  const [notification, notificationDispatch] = useReducer(notificationReducer, '')

  const showNotification = (message) => {
    notificationDispatch({ type: 'SET', payload: message })
  }

  const clearNotification = () => {
    notificationDispatch({ type: 'CLEAR' })
  }

  const setNotification = (message, duration) => {
    showNotification(message)
    setTimeout(() => {
      clearNotification()
    }, duration * 1000)
  }

  return (
    <NotificationContext.Provider value={{ notification, setNotification }}>
      {children}
    </NotificationContext.Provider>
  )

}

export default NotificationContext