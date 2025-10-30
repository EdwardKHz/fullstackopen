const Message = ({message}) => {

    const notificationStyle = {
        background: 'lightgrey',
        fontSize: 20,
        borderStyle: 'solid',
        borderRadius: 5,
        padding: 10,
        marginBottom: 10,
    }

    return (
        <div style={notificationStyle}>
            <h2>{message}</h2>
        </div>
    )
}

export default Message