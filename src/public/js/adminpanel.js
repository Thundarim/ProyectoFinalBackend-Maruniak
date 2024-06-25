async function deleteInactiveUsers() {
    try {
        const response = await fetch('/api/users', {
            method: 'DELETE'
        });

        if (response.ok) {
            Swal.fire({
                icon: 'success',
                title: 'Usuarios inactivos eliminados correctamente',
            }).then(() => {
                fetchUsers();
            });
        } else {
            throw new Error('Error al eliminar usuarios inactivos');
        }
    } catch (error) {
        console.error(error);
        Swal.fire({
            icon: 'error',
            title: 'Error al eliminar usuarios inactivos',
            text: 'Por favor, inténtelo de nuevo más tarde'
        });
    }
}

async function fetchUsers() {
    const response = await fetch('/api/users');
    const users = await response.json();

    const usersTableBody = document.getElementById('usersTableBody');
    usersTableBody.innerHTML = '';

    users.forEach(user => {
        const row = document.createElement('tr');
        
        row.innerHTML = `
            <td>${user._id}</td>
            <td>${user.first_name}</td>
            <td>${user.last_name}</td>
            <td>${user.email}</td>
            <td>${user.age}</td>
            <td>${user.role}</td>
            <td>
                <button class="btn btn-primary btn-sm" onclick="viewUserDetails('${user._id}')">Ver</button>
                <button class="btn btn-secondary btn-sm" onclick="promoteUser('${user._id}')">Promover/Quitar Premium</button>
            </td>
        `;

        usersTableBody.appendChild(row);
    });
}

async function viewUserDetails(userId) {
    const response = await fetch(`/api/users/${userId}`);
    const user = await response.json();

    document.getElementById('userId').innerText = user._id;
    document.getElementById('userFirstName').innerText = user.first_name;
    document.getElementById('userLastName').innerText = user.last_name;
    document.getElementById('userEmail').innerText = user.email;
    document.getElementById('userAge').innerText = user.age;
    document.getElementById('userRole').innerText = user.role;

    document.getElementById('userList').style.display = 'none';
    document.getElementById('userDetails').style.display = 'block';
}

async function promoteUser(userId) {
    const response = await fetch(`/api/users/premium/${userId}`, {
        method: 'PUT'
    });

    if (response.ok) {
        Swal.fire({
            icon: 'success',
            title: 'Se ha Añadido/Quitado el premium',
        }).then(() => {
            fetchUsers();
        });
    } else {
        Swal.fire({
            icon: 'error',
            title: 'Fallo al promover usuario',
        });
    }
}

document.addEventListener('DOMContentLoaded', fetchUsers);