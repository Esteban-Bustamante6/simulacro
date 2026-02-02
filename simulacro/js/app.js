import {nameuser,emailuser,buttoncreate,buttonlogin,login1,login2,buttonsingup,notiLogin,
    notiRegister} from './link.js';
import {emaillogin,buttonsingin,passworduser,passwordlogin} from './link.js';



// guardamos en local stora
// local store no guarda objetos solo strin tenemos que convertir nuestro objeto a strin con json.stringitfy

const dBUser = JSON.parse(localStorage.getItem("User_List")) || [
    {
        id:1, name: "Esteban", rol: "admin", email: "A@gmail.com",password:"132"
    }
];
let idCounter = 1;
// hacemos un incremento manual donde preguntamos si el id es = al de dbuser y si lo es incremente 1
if (dBUser.length > 0) {
    idCounter = dBUser[dBUser.length - 1].id + 1;
}

// guardamos los parametros otorgados en el dbuser en userlist
function savelocalstorage(){
    localStorage.setItem("User_List", JSON.stringify(dBUser));
}

// para guardar algo en el localstorage primero se debe de crear un objeto y pasarle los valores proporcionado por cliente, luego inicialiazar con un usuario predeterminado para evitar errores de undefine antes de hacer el parse,,, luego lo delcrado en esa nueva constantee sera guardado mediante setitem en una llave con el valor de la constante anterior.... se debe aclarar que el objeto que crea el usuario con sus respuestas se debe de pusear a la funcion de que parsea el json esto se pushea de la siguiente fomra dBUser.push(newuser); con el .push

// pantalla registro
buttonsingup[0].addEventListener('click', function(){
    login1[0].style.display = "none";
    login2[0].style.display = "block";
})

// pantalla login
buttonlogin[0].addEventListener('click', function(){
    login2[0].style.display = "none";
    login1[0].style.display = "block";
})

buttoncreate[0].addEventListener('click', function (e) {
    e.preventDefault();
    sessiondata();
});
buttonsingin[0].addEventListener('click', sessionlogin);



function sessiondata() {

    if (!Createuser()) return;

    // hacemos un objeto con las repuestas esperadas en el formulario html y se crea el usuario
    notiRegister.textContent = 'Usuario creado correctamente';
    const newuser = {
        id: idCounter ++,
        name: nameuser.value.trim(),
        email: emailuser.value.trim(),
        rol: "user",
        password : passworduser.value.trim()
    };

    // validamos si el email ya ha sido registrado
    const exists = dBUser.some(u => u.email === newuser.email);
    if (exists) {
        notiRegister.textContent = 'Email ya está registrado';
        return;
    }

    // hacemos push a dbuser para si el preterminado ya se añadio que añada este como nuevo
    dBUser.push(newuser);
    savelocalstorage();
    saveUserAPI(newuser); // JSON SERVER

    notiRegister.textContent = 'Usuario creado correctamente';

    nameuser.value = "";
    emailuser.value = "";
    passworduser.value = "";
}


function sessionlogin() {

    // preguntamos si el email y la contraseña a logear es el mismo que esta registrado
    const user = dBUser.find(u => u.email === emaillogin.value.trim());
    const userpas = dBUser.find(e => e.password === passwordlogin.value.trim() )
    if (!user) {
        notiLogin.textContent = 'Usuario no encontrado';
        return;
    }
    if (!emaillogin.value.trim()) {
        notiLogin.textContent = 'Ingrese su email';
        return;
    }
    if(!userpas){
        notiLogin.textContent = 'la contraseña no coincide';
        return;
    }

    notiLogin.textContent = 'Login correcto';


    // 3. Login correcto: Guardamos la sesión
    notiLogin.textContent = 'Login correcto';
    sessionStorage.setItem("userSession", JSON.stringify(user));
    
    // Mensaje de bienvenida
    alert(`Bienvenido ${user.name}`);

    // 4. REDIRECCIÓN SEGÚN ROL
    if (user.rol === "admin") {
        window.location.href = "estadistica.html";
    } else if (user.rol === "user") {
        window.location.href = "interfax.html";
    } else {
        notiLogin.textContent = 'Rol no asignado. Contacte soporte.';
    };
}

function saveUserAPI(user) { 
    // nos conectamos mediante fech
    fetch('http://localhost:3000/Usuario', 
        // hacemos el metodo post para añdir
        { method: 'POST', headers: { 'Content-Type': 'application/json' },
        // guardamos todo lo creado en user en un strint y lo subimos a json server
        body: JSON.stringify(user) })
        .then(res => res.json()) 
        .then(data => console.log('Guardado en API:', data)) 
        .catch(err => console.error(err)); }

function Createuser() {
    // evita que sea caracteres especiales
    const regexName = /^[A-Za-z\s]+$/;
    // evita que sea letras
    const regexNumber = /^[0-9]+$/;

    // Validación nombre
    if (nameuser.value.trim() === "") {
        notiRegister.textContent = 'El nombre no puede estar vacío';
        return false;
    }

    if (!regexName.test(nameuser.value)) {
        notiRegister.textContent = 'El nombre solo puede tener letras y espacios';
        return false;
    }

    // Validación email
    if (emailuser.value.trim() === "") {
        notiRegister.textContent = 'El email no puede estar vacío';
        return false;
    }

    if (!emailuser.value.includes('@')) {
        notiRegister.textContent = 'Falta el @';
        return false;
    }
    if (passworduser.value.trim() === "") {
        notiRegister.textContent = 'La contraseña no puede estar vacía';
        return false;
    }

    if (!regexNumber.test(passworduser.value)) {
        notiRegister.textContent = 'La contraseña solo puede contener números';
        return false;
    }

    if (!emailuser.value.includes('.com')) {
        notiRegister.textContent = 'Falta el .com';
        return false;
    }else{
        // Si todo está bien
    return true;
    }

    
}


