// Importa e configura o Firebase
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-app.js');
importScripts('https://www.gstatic.com/firebasejs/8.10.0/firebase-messaging.js');

// Configuração do Firebase
const firebaseConfig = {
    apiKey: "AIzaSyC8evOJBLJ7g4lpW5CBL3WKn_rBg83m4Gk",
    authDomain: "techchallenge05-e62ab.firebaseapp.com",
    projectId: "techchallenge05-e62ab",
    storageBucket: "techchallenge05-e62ab.appspot.com",
    messagingSenderId: "570578984807",
    appId: "1:570578984807:web:cf7ebb881a39978c2599c2",
    measurementId: "G-8HW7CJLMJP"
};

firebase.initializeApp(firebaseConfig);
const messaging = firebase.messaging();

// Handle background messages
messaging.onBackgroundMessage((payload) => {
    console.log('Received background message ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon
    };

    self.registration.showNotification(notificationTitle, notificationOptions);
});
