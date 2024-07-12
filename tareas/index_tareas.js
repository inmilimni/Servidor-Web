const formulario = document.querySelector('#form-todos');
const lista = document.querySelector('#todos-list');
const inputF = document.querySelector('#form-input');
const cerrarBtn = document.querySelector('#cerrar-btn');
const user = JSON.parse(localStorage.getItem('username'));

if(!user){
    window.location.href = "../home/index.html"
}

cerrarBtn.addEventListener('click', e=>{
    localStorage.removeItem('username')
    window.location.href = '../home/index.html'
})

const obtenerUsuarios = async () =>{
    const respuesta = await fetch('http://localhost:3000/tareas',{method:'GET'})
    const listado = await respuesta.json()
    console.log(listado)
    //realizar busqueda
    const listadoUsuarios = listado.filter(i=>i.username === user.username)
    listadoUsuarios.forEach(i => {
        const listado = document.createElement('li');
        listado.innerHTML =`
            <li id=${i.id} class="todo-item">
                <button class="delete-btn">&#10006;</button>
                <p class = "${i.checked ? 'check-todo' : ''}"> ${i.text}</p>
                <button class="check-btn">&#10003;</button>
            </li>`
        lista.appendChild(listado);
        console.log(lista)
        
    });
}

formulario.addEventListener('submit', async e =>{
    e.preventDefault;
    await fetch('http://localhost:3000/tareas', {
        method: 'POST',
        headers:{
            "Content-Type":"application/json"
        },
        body:JSON.stringify({text:inputF.value, idU:user.id, username:user.username})
    })
    obtenerUsuarios();

}) 

obtenerUsuarios();

lista.addEventListener('click', async e=>{
    if(e.target.classList.contains('delete-btn')){
        const id = e.target.parentElement.id
        await fetch(`http://localhost:3000/tareas/${id}`,{
            method: 'DELETE'
        })
        e.target.parentElement.remove()
    }else if(e.target.classList.contains('check-btn')){
        const id = e.target.parentElement.id
        const res = await fetch(`http://localhost:3000/tareas/${id}`,{
            method: 'PATCH',
            headers:{ 
                "Content-Type":"application/json"
            },
            body:JSON.stringify({checked:e.target.parentElement.classList.contains('check-todo') ? false : true})
        })
        const response = await res.json()
        e.target.parentElement.classList('check-todo')
    }
})