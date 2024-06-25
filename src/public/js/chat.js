document.addEventListener("DOMContentLoaded", () => {
    const socket = io();
    let user;

    fetch('/api/sessions/current')
    .then(response => {
      if (!response.ok) {
        throw new Error('Failed to fetch session data');
      }
      return response.json();
    })
    .then(sessionData => {
      user = `${sessionData.user.first_name} ${sessionData.user.last_name}`;
      console.log('Obtuvimos la informacion:', sessionData);
      console.log('Usuario logeado:', user);
    })
    .catch(error => {
      console.error('Error al hacer fetch la data:', error);
    });
  
        fetch('/api/messages')
        .then(response => {
          if (!response.ok) {
            throw new Error('Fallo al hacer fetch los mensajes');
          }
          return response.json();
        })
        .then(messages => {
          messages.forEach(message => {
            displayMessage(message);
          });
        })
        .catch(error => {
          console.error('Fallo al hacer fetch los mensajes:', error);
        });




    const chatBox = document.getElementById("messageInput");
    chatBox.addEventListener("keyup", (event) => {
        if (event.key === "Enter") {
            if (chatBox.value.trim().length > 0) {
                socket.emit("message", { user: user, message: chatBox.value });
                chatBox.value = "";
            }
        }
    });

   socket.on("message", data => {
        data.forEach(message => {
            displayMessage(message);
        });
    });

    function displayMessage(message) {
        let log = document.getElementById("messagesLogs");
        let messageElement = document.createElement("div");
        messageElement.textContent = `${message.user} dice: ${message.message}`;
        log.appendChild(messageElement);
    }
});
