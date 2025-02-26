// Animación inicial del login-container
gsap.from(".login-container", {
    opacity: 0,
    y: 20,
    duration: 1,
    ease: "power2.out",
    delay: 0.5
});

// Abrir modal de registro
document.getElementById('registerLink').addEventListener('click', function(event) {
    event.preventDefault();
    const modal = document.getElementById('registerModal');
    modal.style.display = 'block';
    gsap.to(modal, { opacity: 1, duration: 0.3 });
    gsap.to('.modal-content', { opacity: 1, y: 0, duration: 0.3 });
});

// Cerrar modales
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        gsap.to('.modal-content', { opacity: 0, y: -20, duration: 0.3 });
        gsap.to(modal, { opacity: 0, duration: 0.3, onComplete: () => modal.style.display = 'none' });
    });
});

// Enviar formulario de registro
document.getElementById('registerForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const email = document.getElementById('regEmail').value;
    const password = document.getElementById('regPassword').value;

    // Simular envío al servidor
    fetch('https://natmarket-1.onrender.com/register', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, password }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Cerrar modal de registro
            const registerModal = document.getElementById('registerModal');
            gsap.to('.modal-content', { opacity: 0, y: -20, duration: 0.3 });
            gsap.to(registerModal, { opacity: 0, duration: 0.3, onComplete: () => registerModal.style.display = 'none' });

            // Mostrar modal de verificación
            const verificationModal = document.getElementById('verificationModal');
            verificationModal.style.display = 'block';
            gsap.to(verificationModal, { opacity: 1, duration: 0.3 });
            gsap.to('.modal-content', { opacity: 1, y: 0, duration: 0.3 });

            // Animación del círculo de verificación
            gsap.to('.circle', {
                opacity: 1,
                scale: 1,
                duration: 0.5,
                ease: "elastic.out(1, 0.5)",
                delay: 0.5
            });
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

document.getElementById('goToNatMarket').addEventListener('click', function(event) {
    event.preventDefault(); // Evitar la acción predeterminada del enlace

    window.location.href = 'https://www.appcreator24.com/app3472125-xbw9ar'; // Redirigir a página de descarga
});




let versionDesarrollo = 1.2; // Versión de desarrollo inicial

// Insertar la información de la versión en el contenedor
document.getElementById('version-info').textContent = `Versión de Desarrollo: ${versionDesarrollo.toFixed(1)}`;


 // Selecciona el botón
 const button = document.getElementById('animatedButton');

 // Efecto de Hover con GSAP
 button.addEventListener('mouseenter', () => {
     gsap.to(button, {
         scale: 1.05, // Escala ligeramente el botón
         duration: 0.3,
         ease: "power2.out"
     });
 });

 button.addEventListener('mouseleave', () => {
     gsap.to(button, {
         scale: 1, // Vuelve al tamaño original
         duration: 0.3,
         ease: "power2.out"
     });
 });

 // Efecto de Click con GSAP
 button.addEventListener('click', () => {
     gsap.to(button, {
         scale: 0.95, // Comprime el botón
         duration: 0.1,
         ease: "power2.out",
         onComplete: () => {
             gsap.to(button, {
                 scale: 1, // Vuelve al tamaño original
                 duration: 0.2,
                 ease: "elastic.out(1, 0.5)"
             });
         }
     });
 });

 // Efecto de Pulso (opcional)
 gsap.to(button, {
     scale: 1.05, // Escala ligeramente
     repeat: -1, // Repite infinitamente
     yoyo: true, // Alterna entre los valores inicial y final
     duration: 1,
     ease: "power1.inOut"
 });

  // Selecciona el enlace "Regístrate aquí"
  const registerLink = document.getElementById('registerLink');

  // Efecto de rebote al hacer clic
  registerLink.addEventListener('click', (e) => {
      e.preventDefault(); // Evita el comportamiento predeterminado del enlace
      gsap.to(registerLink, {
          scale: 0.9, // Comprime el enlace
          duration: 0.1,
          ease: "power2.out",
          onComplete: () => {
              gsap.to(registerLink, {
                  scale: 1, // Vuelve al tamaño original
                  duration: 0.2,
                  ease: "elastic.out(1, 0.5)"
              });
          }
      });
  });

// Variables globales
const canvas = document.getElementById('lionCanvas');
const ctx = canvas.getContext('2d');
const loginForm = document.getElementById('loginForm');
const passwordInput = document.getElementById('password');
const submitButton = document.getElementById('animatedButton');
const finalMessage = document.getElementById('final-message');
const finalSubmessage = document.getElementById('final-submessage');
const loadingCircle = document.getElementById('loadingCircle');
const loginMessage = document.getElementById('loginMessage');
const loginContainer = document.querySelector('.login-container');
const finalContainer = document.getElementById('final-container');

// Tamaño del canvas
canvas.width = 400;
canvas.height = 200;

// Posición y estado del león
let lion = {
    x: canvas.width / 2 - 50,
    y: 50,
    width: 100,
    height: 100,
    eyesClosed: false,
    celebrating: false,
    sad: false,
    pawsUp: false // Estado para las patas arriba
};

// Dibujar el león
function drawLion() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Melena
    ctx.fillStyle = '#d2691e'; // Color marrón para la melena
    ctx.beginPath();
    ctx.arc(lion.x + 50, lion.y + 50, 60, 0, Math.PI * 2); // Melena más grande que el cuerpo
    ctx.fill();

    // Cuerpo del león
    ctx.fillStyle = '#ffcc00'; // Color amarillo para el cuerpo
    ctx.beginPath();
    ctx.arc(lion.x + 50, lion.y + 50, 50, 0, Math.PI * 2);
    ctx.fill();

    // Ojos
    ctx.fillStyle = '#000';
    if (lion.eyesClosed) {
        // Ojos cerrados (tapados por las patas)
        ctx.fillStyle = '#ffcc00'; // Color del cuerpo para tapar los ojos
        ctx.fillRect(lion.x + 30, lion.y + 30, 20, 20); // Tapar ojo izquierdo
        ctx.fillRect(lion.x + 60, lion.y + 30, 20, 20); // Tapar ojo derecho
    } else {
        // Ojos abiertos
        ctx.beginPath();
        ctx.arc(lion.x + 40, lion.y + 30, 5, 0, Math.PI * 2); // Ojo izquierdo
        ctx.arc(lion.x + 70, lion.y + 30, 5, 0, Math.PI * 2); // Ojo derecho
        ctx.fill();
    }

    // Patas delanteras
    ctx.fillStyle = '#d2691e'; // Color marrón para las patas
    ctx.strokeStyle = '#000'; // Borde negro para las patas
    ctx.lineWidth = 2; // Grosor del borde
    if (lion.pawsUp) {
        // Patas arriba (tapando los ojos)
        ctx.fillRect(lion.x + 20, lion.y + 20, 20, 40); // Pata izquierda
        ctx.strokeRect(lion.x + 20, lion.y + 20, 20, 40); // Borde pata izquierda
        ctx.fillRect(lion.x + 70, lion.y + 20, 20, 40); // Pata derecha
        ctx.strokeRect(lion.x + 70, lion.y + 20, 20, 40); // Borde pata derecha
    } else {
        // Patas abajo
        ctx.fillRect(lion.x + 20, lion.y + 80, 20, 40); // Pata izquierda
        ctx.strokeRect(lion.x + 20, lion.y + 80, 20, 40); // Borde pata izquierda
        ctx.fillRect(lion.x + 70, lion.y + 80, 20, 40); // Pata derecha
        ctx.strokeRect(lion.x + 70, lion.y + 80, 20, 40); // Borde pata derecha
    }

    // Bigotes (superpuestos sobre las patas)
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    // Bigotes izquierdos
    ctx.moveTo(lion.x + 30, lion.y + 50);
    ctx.lineTo(lion.x + 10, lion.y + 50);
    ctx.moveTo(lion.x + 30, lion.y + 55);
    ctx.lineTo(lion.x + 10, lion.y + 60);
    ctx.moveTo(lion.x + 30, lion.y + 45);
    ctx.lineTo(lion.x + 10, lion.y + 40);
    // Bigotes derechos
    ctx.moveTo(lion.x + 70, lion.y + 50);
    ctx.lineTo(lion.x + 90, lion.y + 50);
    ctx.moveTo(lion.x + 70, lion.y + 55);
    ctx.lineTo(lion.x + 90, lion.y + 60);
    ctx.moveTo(lion.x + 70, lion.y + 45);
    ctx.lineTo(lion.x + 90, lion.y + 40);
    ctx.stroke();

    // Uñas de las patas
    ctx.fillStyle = '#fff';
    ctx.beginPath();
    if (lion.pawsUp) {
        // Uñas patas arriba
        ctx.arc(lion.x + 25, lion.y + 55, 3, 0, Math.PI * 2); // Uñas pata izquierda
        ctx.arc(lion.x + 30, lion.y + 55, 3, 0, Math.PI * 2);
        ctx.arc(lion.x + 35, lion.y + 55, 3, 0, Math.PI * 2);
        ctx.arc(lion.x + 75, lion.y + 55, 3, 0, Math.PI * 2); // Uñas pata derecha
        ctx.arc(lion.x + 80, lion.y + 55, 3, 0, Math.PI * 2);
        ctx.arc(lion.x + 85, lion.y + 55, 3, 0, Math.PI * 2);
    } else {
        // Uñas patas abajo
        ctx.arc(lion.x + 25, lion.y + 115, 3, 0, Math.PI * 2); // Uñas pata izquierda
        ctx.arc(lion.x + 30, lion.y + 115, 3, 0, Math.PI * 2);
        ctx.arc(lion.x + 35, lion.y + 115, 3, 0, Math.PI * 2);
        ctx.arc(lion.x + 75, lion.y + 115, 3, 0, Math.PI * 2); // Uñas pata derecha
        ctx.arc(lion.x + 80, lion.y + 115, 3, 0, Math.PI * 2);
        ctx.arc(lion.x + 85, lion.y + 115, 3, 0, Math.PI * 2);
    }
    ctx.fill();

    // Expresión seria (boca)
    if (!lion.sad) {
        ctx.strokeStyle = '#000';
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(lion.x + 40, lion.y + 70);
        ctx.lineTo(lion.x + 70, lion.y + 70);
        ctx.stroke();
    }

// Expresión triste (si está triste)
if (lion.sad) {
    ctx.strokeStyle = '#000';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.moveTo(lion.x + 45, lion.y + 85);
    ctx.quadraticCurveTo(lion.x + 55, lion.y + 80, lion.x + 65, lion.y + 85); // Punto de control más arriba
    ctx.stroke();
}



    // Confeti (si está celebrando)
    if (lion.celebrating) {
        for (let i = 0; i < 50; i++) {
            ctx.fillStyle = `hsl(${Math.random() * 360}, 100%, 50%)`;
            ctx.fillRect(
                Math.random() * canvas.width,
                Math.random() * canvas.height,
                5, 5
            );
        }
    }
}

// Animación del león
function animate() {
    drawLion();
    requestAnimationFrame(animate);
}

// Evento al seleccionar el input de contraseña
passwordInput.addEventListener('focus', () => {
    lion.eyesClosed = true;
    lion.pawsUp = true; // Levantar patas para tapar los ojos
});

passwordInput.addEventListener('blur', () => {
    lion.eyesClosed = false;
    lion.pawsUp = false; // Bajar patas
});

const users = [
    { email: 'hachiyt001@gmail.com', password: '59901647' },
    { email: 'karatedojor@gmail.com', password: '@#&Jorge1976' },
    { email: 'marytinaluna@gmail.com', password: 'mary1986' }
];

const policyContainer = document.getElementById("policyContainer");
const continueButton = document.getElementById("continueButton");
const countdownText = document.getElementById("countdown");
const loadingCircle2 = document.getElementById("loadingCircle");

let countdown = 10; // Iniciar el contador en 60 segundos

// Estado inicial
continueButton.disabled = true; // Deshabilitar el botón al inicio
countdownText.style.display = "inline"; // Mostrar el contador


// Función para actualizar el contador
const updateCountdown = () => {
    countdownText.textContent = `${countdown}`; // Actualiza el texto del contador

    // Si el contador llega a cero
    if (countdown <= 0) {
        clearInterval(timer); // Detiene el intervalo
        countdownText.style.display = "none"; // Oculta el texto del contador
        loadingCircle2.style.display = "none"; // Oculta el círculo de carga
        continueButton.disabled = false; // Habilita el botón "Continuar"
        continueButton.textContent = "Continuar"; // Cambia el texto del botón
    } else {
        countdown--; // Decrementa el contador solo si no ha llegado a cero
    }
};

// Mostrar el header después de completar el proceso de inicio de sesión
function showAppHeader() {
    const appHeader = document.getElementById('appHeader');
    gsap.from(appHeader, {
        y: -100,
        opacity: 0,
        duration: 1,
        ease: "power2.out",
        onComplete: () => {
            appHeader.style.display = 'flex';
        }
    });
}

// Ocultar el final-container y mostrar el header
function hideFinalContainer() {
    const finalContainer = document.getElementById('final-container');
    finalContainer.style.display = 'none';
    showAppHeader();
}


// Iniciar el contador de 60 segundos
const timer = setInterval(updateCountdown, 1000);
// Modificar el evento de envío del formulario de inicio de sesión
loginForm.addEventListener('submit', (e) => {
    e.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;
    const userExists = users.some(user => user.email === email && user.password === password);

    // Mostrar círculo de carga por 3 segundos
    loginMessage.style.display = "none";
    loadingCircle.style.display = "block";

    setTimeout(() => {
        loadingCircle.style.display = "none";
        
        if (userExists) {
            // Usuario encontrado
            loginMessage.textContent = "Inicio de sesión exitoso";
            loginMessage.className = "message celebration";
            loginMessage.style.display = "block";
            lion.celebrating = true;
            lion.sad = false;

            setTimeout(() => {
                lion.celebrating = false;
                loginMessage.style.display = "none";
                loadingCircle.style.display = "block";

                setTimeout(() => {
                    // Ocultar el contenedor de inicio de sesión y mostrar el de políticas
                    gsap.to(loginContainer, { opacity: 0, duration: 1, onComplete: () => {
                        loginContainer.style.display = "none";
                        canvas.style.display = "none";
                        policyContainer.style.display = "block";
                        gsap.from(policyContainer, { opacity: 0, y: -50, duration: 1.5, ease: "bounce" });
                    }});
                }, 1000);
            }, 3000);
        } else {
            // Usuario no encontrado
            loginMessage.textContent = "Usuario no encontrado";
            loginMessage.className = "message error";
            loginMessage.style.display = "block";
            lion.sad = true;
        }
    }, 3000);
});

// Evento para el botón "Continuar" después de las políticas
continueButton.addEventListener('click', () => {
    gsap.to(policyContainer, { opacity: 0, duration: 1, onComplete: () => {
        policyContainer.style.display = "none";
        const policyQuestionsModal = document.getElementById('policyQuestionsModal');
        policyQuestionsModal.style.display = 'block';
        gsap.to(policyQuestionsModal, { opacity: 1, duration: 0.3 });
        gsap.to('.modal-content', { opacity: 1, y: 0, duration: 0.3 });
        showQuestion();
    }});
});



// Cerrar el modal de advertencia
document.querySelectorAll('.close').forEach(closeBtn => {
    closeBtn.addEventListener('click', function() {
        const modal = this.closest('.modal');
        gsap.to('.modal-content', { opacity: 0, y: -20, duration: 0.3 });
        gsap.to(modal, { opacity: 0, duration: 0.3, onComplete: () => modal.style.display = 'none' });
    });
});

// Variables globales para las preguntas y respuestas
const policyQuestions = [
    {
        question: "¿Qué sucede si un producto rompe las normas?",
        answer: "cerraremos tu cuenta"
    },
    {
        question: "¿Qué debes hacer si te denuncian?",
        answer: "revisar las politicas"
    }
];

let currentQuestionIndex = 0;

// Función para mostrar la pregunta actual
function showQuestion() {
    // Verificar si el índice está dentro de los límites del array
    if (currentQuestionIndex >= policyQuestions.length) {
        console.error("No hay más preguntas disponibles.");
        return; // Salir de la función si no hay más preguntas
    }

    const questionContainer = document.getElementById('questionContainer');
    questionContainer.innerHTML = `<p>${policyQuestions[currentQuestionIndex].question}</p>`; // Mostrar la pregunta actual
    document.getElementById('policyAnswer').value = ''; // Limpiar el campo de respuesta
    document.getElementById('policyMessage').style.display = 'none'; // Ocultar el mensaje de respuesta
}


// Función para validar la respuesta
function validateAnswer(answer) {
    return answer.toLowerCase() === policyQuestions[currentQuestionIndex].answer.toLowerCase();
}




// Evento para el formulario de preguntas de políticas
document.getElementById('policyQuestionsForm').addEventListener('submit', function(event) {
    event.preventDefault();
    const answer = document.getElementById('policyAnswer').value;
    const policyMessage = document.getElementById('policyMessage');

    if (validateAnswer(answer)) {
        policyMessage.textContent = "¡Respuesta correcta!";
        policyMessage.className = "message celebration";
        policyMessage.style.display = "block";

        // Mostrar el loadingCircle inmediatamente
        const loadingCircle = document.getElementById('loadingCircle3');
        loadingCircle.style.display = "block";

        if (currentQuestionIndex < policyQuestions.length - 1) {
            // Para preguntas anteriores a la última
            setTimeout(() => {
                loadingCircle.style.display = "none"; // Ocultar el loadingCircle después de 1 segundo
                currentQuestionIndex++;
                gsap.to('.modal-content', { opacity: 0, y: -20, duration: 0.3, onComplete: () => {
                    showQuestion(); // Mostrar la siguiente pregunta
                    gsap.to('.modal-content', { opacity: 1, y: 0, duration: 0.3 });
                }});
            }, 1000); // Esperar 1 segundo antes de pasar a la siguiente pregunta
        } else {
            // Para la última pregunta
            setTimeout(() => {
                loadingCircle.style.display = "none"; // Ocultar el loadingCircle después de 2 segundos

                // Ocultar el modal después de 2 segundos
                gsap.to(policyQuestionsModal, { opacity: 0, duration: 0.3, onComplete: () => {
                    policyQuestionsModal.style.display = 'none';

                    // Mostrar el header en lugar del final-container
                    showAppHeader();
                }});
            }, 2000); // Esperar 2 segundos antes de cerrar el modal
        }
    } else {
        policyMessage.textContent = "Respuesta incorrecta. Intenta de nuevo.";
        policyMessage.className = "message error";
        policyMessage.style.display = "block";
    }
});
// Iniciar animación
animate();

// Evento para detectar la tecla Enter en los campos de correo y contraseña
document.getElementById('email').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Evitar el comportamiento predeterminado del formulario
        document.getElementById('loginForm').dispatchEvent(new Event('submit')); // Enviar el formulario
    }
});

document.getElementById('password').addEventListener('keydown', function(event) {
    if (event.key === 'Enter') {
        event.preventDefault(); // Evitar el comportamiento predeterminado del formulario
        document.getElementById('loginForm').dispatchEvent(new Event('submit')); // Enviar el formulario
    }
});

// Variables globales
let currentStep = 1;
const totalSteps = 4;

// Abrir modal de crear producto
document.getElementById('createProductButton').addEventListener('click', function(event) {
    event.preventDefault();
    const modal = document.getElementById('createProductModal');
    modal.style.display = 'block';
    gsap.to(modal, { opacity: 1, duration: 0.3 });
    gsap.to('.modal-content', { opacity: 1, y: 0, duration: 0.3 });
    currentStep = 1;
    updateFormStep();
});

// Función para actualizar el paso del formulario
function updateFormStep() {
    const formSteps = document.querySelectorAll('.form-step');
    formSteps.forEach(step => {
        step.style.transform = `translateX(-${(currentStep - 1) * 100}%)`;
    });
}

// Navegar entre los pasos del formulario
document.getElementById('formSlider').addEventListener('click', function(event) {
    if (event.target.classList.contains('next-step')) {
        if (currentStep < totalSteps) {
            currentStep++;
            updateFormStep();
        }
    } else if (event.target.classList.contains('prev-step')) {
        if (currentStep > 1) {
            currentStep--;
            updateFormStep();
        }
    }
});

// Enviar formulario de crear producto
document.getElementById('submitProductButton').addEventListener('click', function(event) {
    event.preventDefault();

    const productName = document.getElementById('productName').value;
    const productDescription = document.getElementById('productDescription').value;
    const productPrice = document.getElementById('productPrice').value;
    const userEmail = document.getElementById('userEmail').value;

    // Mostrar círculo de carga
    const submitText = document.getElementById('submitText');
    const loadingCircle = document.getElementById('submitLoadingCircle');
    submitText.style.display = 'none';
    loadingCircle.style.display = 'block';

    // Simular envío al servidor
    fetch('https://localhost:3291/createProduct', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify({ productName, productDescription, productPrice, userEmail }),
    })
    .then(response => response.json())
    .then(data => {
        if (data.success) {
            // Ocultar el modal después de 2 segundos
            setTimeout(() => {
                const modal = document.getElementById('createProductModal');
                gsap.to('.modal-content', { opacity: 0, y: -20, duration: 0.3 });
                gsap.to(modal, { opacity: 0, duration: 0.3, onComplete: () => modal.style.display = 'none' });
            }, 2000);
        }
    })
    .catch(error => {
        console.error('Error:', error);
    });
});

// Efecto de olas en el botón
const waveCanvas = document.getElementById('waveCanvas');
const waveCtx = waveCanvas.getContext('2d');

function drawWaves() {
    waveCtx.clearRect(0, 0, waveCanvas.width, waveCanvas.height);
    waveCtx.fillStyle = '#1e90ff';
    waveCtx.beginPath();
    waveCtx.moveTo(0, waveCanvas.height / 2);
    for (let i = 0; i < waveCanvas.width; i += 10) {
        waveCtx.lineTo(i, waveCanvas.height / 2 + Math.sin(i / 20 + Date.now() / 500) * 10);
    }
    waveCtx.lineTo(waveCanvas.width, waveCanvas.height);
    waveCtx.lineTo(0, waveCanvas.height);
    waveCtx.closePath();
    waveCtx.fill();
    requestAnimationFrame(drawWaves);
}

waveCanvas.width = document.getElementById('submitProductButton').offsetWidth;
waveCanvas.height = document.getElementById('submitProductButton').offsetHeight;
drawWaves();

const desertCanvas = document.getElementById('desertCanvas');
const desertCtx = desertCanvas.getContext('2d'); // Usa un contexto separado para el desierto

// Ajustar el tamaño del canvas al tamaño de la ventana
function resizeCanvas() {
    desertCanvas.width = window.innerWidth;
    desertCanvas.height = window.innerHeight;
}
window.addEventListener('resize', resizeCanvas);
resizeCanvas();

// Colores del desierto
const skyColor = '#87CEEB'; // Color del cielo
const sandColor = '#F4A460'; // Color de la arena
const duneColor = '#DEB887'; // Color de las dunas
const pyramidColor = '#CD853F'; // Color de las pirámides (marrón arena)
const cactusColor = '#228B22'; // Color de los cactus (verde oscuro)
const spineColor = '#8B4513'; // Color de las espinas (marrón oscuro)

// Función para dibujar una pirámide
function drawPyramid(x, baseWidth, height) {
    desertCtx.fillStyle = pyramidColor;
    desertCtx.beginPath();
    desertCtx.moveTo(x, desertCanvas.height * 0.6); // Base izquierda
    desertCtx.lineTo(x + baseWidth / 2, desertCanvas.height * 0.6 - height); // Pico de la pirámide
    desertCtx.lineTo(x + baseWidth, desertCanvas.height * 0.6); // Base derecha
    desertCtx.closePath();
    desertCtx.fill();

    // Detalles de los bloques de la pirámide
    desertCtx.strokeStyle = '#8B4513'; // Color más oscuro para los detalles
    desertCtx.lineWidth = 2;
    for (let i = 1; i <= 5; i++) {
        const y = desertCanvas.height * 0.6 - (height / 5) * i;
        const width = baseWidth * (1 - (i / 5));
        desertCtx.beginPath();
        desertCtx.moveTo(x + (baseWidth - width) / 2, y);
        desertCtx.lineTo(x + (baseWidth - width) / 2 + width, y);
        desertCtx.stroke();
    }
}

// Función para dibujar un cactus con puntas laterales que se doblan hacia arriba
function drawCactus(x, y, width, height) {
    // Tallo principal (línea vertical gruesa)
    desertCtx.strokeStyle = cactusColor;
    desertCtx.lineWidth = width; // Grosor del tallo
    desertCtx.beginPath();
    desertCtx.moveTo(x + width / 2, y); // Base del tallo
    desertCtx.lineTo(x + width / 2, y - height); // Parte superior del tallo
    desertCtx.stroke();

    // Puntas laterales (se extienden horizontalmente y luego se doblan hacia arriba)
    const armWidth = width / 2; // Ancho de las puntas
    const armLength = height / 2; // Longitud de las puntas antes de doblarse
    const bendHeight = height / 4; // Altura de la curva hacia arriba

    // Punta izquierda
    desertCtx.beginPath();
    desertCtx.moveTo(x + width / 2, y - height / 2); // Inicio de la punta izquierda
    desertCtx.lineTo(x - armLength, y - height / 2); // Extensión horizontal
    desertCtx.quadraticCurveTo(
        x - armLength, y - height / 2 - bendHeight, // Punto de control para la curva
        x - armLength / 2, y - height / 2 - bendHeight // Fin de la curva hacia arriba
    );
    desertCtx.strokeStyle = cactusColor;
    desertCtx.lineWidth = armWidth;
    desertCtx.stroke();

    // Punta derecha
    desertCtx.beginPath();
    desertCtx.moveTo(x + width / 2, y - height / 2); // Inicio de la punta derecha
    desertCtx.lineTo(x + width / 2 + armLength, y - height / 2); // Extensión horizontal
    desertCtx.quadraticCurveTo(
        x + width / 2 + armLength, y - height / 2 - bendHeight, // Punto de control para la curva
        x + width / 2 + armLength / 2, y - height / 2 - bendHeight // Fin de la curva hacia arriba
    );
    desertCtx.stroke();

    // Dibujar espinas (más realistas)
    desertCtx.fillStyle = spineColor;
    const spineDensity = 20; // Número de espinas por sección
    for (let i = 0; i < spineDensity; i++) {
        // Espinas en el tallo principal
        const spineX = x + width / 2 + (Math.random() - 0.5) * (width / 2);
        const spineY = y - height + Math.random() * height;
        desertCtx.beginPath();
        desertCtx.arc(spineX, spineY, 2, 0, Math.PI * 2); // Espina como un círculo pequeño
        desertCtx.fill();

        // Espinas en las puntas
        const armSpineX = x + width / 2 + (Math.random() - 0.5) * width * 1.5;
        const armSpineY = y - height / 2 - bendHeight + Math.random() * bendHeight;
        desertCtx.beginPath();
        desertCtx.arc(armSpineX, armSpineY, 2, 0, Math.PI * 2);
        desertCtx.fill();
    }
}

// Función para dibujar el fondo
function drawDesert() {
    // Dibujar el cielo
    desertCtx.fillStyle = skyColor;
    desertCtx.fillRect(0, 0, desertCanvas.width, desertCanvas.height * 0.6);

    // Dibujar la arena
    desertCtx.fillStyle = sandColor;
    desertCtx.fillRect(0, desertCanvas.height * 0.6, desertCanvas.width, desertCanvas.height * 0.4);

    // Dibujar dunas
    desertCtx.fillStyle = duneColor;
    desertCtx.beginPath();
    desertCtx.moveTo(0, desertCanvas.height * 0.6);
    desertCtx.bezierCurveTo(
        desertCanvas.width * 0.3, desertCanvas.height * 0.5,
        desertCanvas.width * 0.7, desertCanvas.height * 0.7,
        desertCanvas.width, desertCanvas.height * 0.6
    );
    desertCtx.lineTo(desertCanvas.width, desertCanvas.height);
    desertCtx.lineTo(0, desertCanvas.height);
    desertCtx.closePath();
    desertCtx.fill();

    // Dibujar pirámide izquierda (más grande)
    const pyramidBaseWidth = 300; // Ancho de la base de la pirámide
    const pyramidHeight = 200; // Altura de la pirámide
    drawPyramid(50, pyramidBaseWidth, pyramidHeight); // Pirámide izquierda

    // Dibujar pirámide derecha (más grande)
    drawPyramid(desertCanvas.width - 350, pyramidBaseWidth, pyramidHeight); // Pirámide derecha

    // Dibujar cactus
    drawCactus(desertCanvas.width * 0.2, desertCanvas.height * 0.7, 20, 120); // Cactus izquierdo
    drawCactus(desertCanvas.width * 0.8, desertCanvas.height * 0.7, 20, 120); // Cactus derecho
}

// Dibujar el fondo inicial
drawDesert();

// Animación opcional: mover las dunas
function animateDunes() {
    desertCtx.clearRect(0, 0, desertCanvas.width, desertCanvas.height); // Limpiar el canvas
    drawDesert();

    // Mover las dunas (efecto de animación)
    desertCtx.save();
    desertCtx.translate(Math.sin(Date.now() / 1000) * 10, 0); // Movimiento horizontal
    drawDesert();
    desertCtx.restore();

    requestAnimationFrame(animateDunes); // Repetir la animación
}

// Iniciar la animación (opcional)
animateDunes();