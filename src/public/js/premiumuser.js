const socket = io();

document.getElementById('productForm').addEventListener('submit', async (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);
    const productData = {};
    formData.forEach((value, key) => {
        productData[key] = value;
    });
    const response = await fetch('/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(productData)
    });
    if (response.ok) {
        event.target.reset();
    }
});

socket.on('productos', async () => {
    try {
        const userDataResponse = await fetch('/session/current');
        if (!userDataResponse.ok) {
            throw new Error("Error fetching user data");
        }
        const userData = await userDataResponse.json();
        const userEmail = userData.email;

        const response = await fetch(`/api/userProducts?email=${userEmail}`);
        if (!response.ok) {
            throw new Error("Error fetching user products");
        }
        const { userProducts } = await response.json();

        const productList = document.getElementById('userProductsList');
        productList.innerHTML = '';
        userProducts.forEach(product => {
            const newItem = document.createElement('li');
            newItem.innerHTML = `
                <h3>${product.title}</h3>
                <p>${product.description}</p>
                <p>Precio: $${product.price}</p>
                <form class="deleteForm" data-product-id="${product._id}">
                    <button type="button" class="deleteButton">Eliminar</button>
                </form>
            `;
            productList.appendChild(newItem);
        });
    } catch (error) {
        console.error("Error updating user products list:", error);
    }
});

document.getElementById('userProductsList').addEventListener('click', async (event) => {
    if (event.target.classList.contains('deleteButton')) {
        const productId = event.target.parentElement.dataset.productId;
        try {
            const userDataResponse = await fetch('/session/current');
            if (!userDataResponse.ok) {
                throw new Error("Error fetching user data");
            }
            const userData = await userDataResponse.json();
            const userEmail = userData.email;

            const response = await fetch(`/api/products/${productId}`, {
                method: 'DELETE',
                headers: {
                    'Content-Type': 'application/json'
                },
                body: JSON.stringify({ email: userEmail })
            });

            if (response.ok) {
                event.target.parentElement.parentElement.remove();
            } else {
                throw new Error("Error deleting product");
            }
        } catch (error) {
            console.error("Error deleting product:", error);
        }
    }
});
