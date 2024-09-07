// Configurações do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC8evOJBLJ7g4lpW5CBL3WKn_rBg83m4Gk",
    authDomain: "techchallenge05-e62ab.firebaseapp.com",
    projectId: "techchallenge05-e62ab",
    storageBucket: "techchallenge05-e62ab.appspot.com",
    messagingSenderId: "570578984807",
    appId: "1:570578984807:web:cf7ebb881a39978c2599c2",
    measurementId: "G-8HW7CJLMJP"
};

// Inicializa o Firebase
const app = firebase.initializeApp(firebaseConfig);
const auth = firebase.auth();

document.getElementById('loginForm').addEventListener('submit', function(event) {
    event.preventDefault();

    const email = document.getElementById('email').value;
    const password = document.getElementById('password').value;

    // Autenticação com o Firebase
    auth.signInWithEmailAndPassword(email, password)
        .then((userCredential) => {
            // Login bem-sucedido
            const user = userCredential.user;
            console.log('Usuário logado:', user);
            // Redirecionar para a página "tarefas.html"
            window.location.href = 'tarefas.html';
        })
        .catch((error) => {
            // Tratamento de erros
            const errorCode = error.code;
            const errorMessage = error.message;
            console.error('Erro no login:', errorCode, errorMessage);
            // Exibir mensagem de erro
            alert('Dados inválidos, tente novamente');
        });
});

