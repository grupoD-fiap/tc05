// Inicializar Messaging
const messaging = firebase.messaging();

// Solicitar permissão para notificações
messaging.requestPermission().then(() => {
    console.log("Permissão concedida para notificações");
    return messaging.getToken();
}).then(token => {
    console.log("Token do dispositivo:", token);
}).catch(error => {
    console.error("Erro ao obter permissão para notificações:", error);
});

// Listener para exibir as notificações enquanto a página está aberta
messaging.onMessage((payload) => {
    console.log('Notificação recebida. ', payload);
    const notificationTitle = payload.notification.title;
    const notificationOptions = {
        body: payload.notification.body,
        icon: payload.notification.icon || '/default-icon.png', // Ícone padrão para notificações
    };

    if (Notification.permission === 'granted') {
        // Exibe a notificação no navegador
        new Notification(notificationTitle, notificationOptions);
    }
});
