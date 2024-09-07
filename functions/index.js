const functions = require('firebase-functions');
const admin = require('firebase-admin');
admin.initializeApp();

exports.checkDueDates = functions.pubsub.schedule('every 24 hours').onRun(async (context) => {
  // Obtém a data atual
  const today = new Date();
  
  // Calcula a data de 3 dias a partir de hoje
  const threeDaysFromNow = new Date(today);
  threeDaysFromNow.setDate(today.getDate() + 3);

  // Formata a data de 3 dias a partir de hoje para o formato YYYY-MM-DD
  const formattedThreeDaysFromNow = threeDaysFromNow.toISOString().split('T')[0];

  // Obtém a referência para a coleção 'task' no Firestore
  const tasksRef = admin.firestore().collection('task');

  // Consulta o Firestore para obter as tarefas com a data de entrega igual a 3 dias a partir de hoje
  const snapshot = await tasksRef
    .where('dueDate', '==', formattedThreeDaysFromNow)
    .where('status', 'in', ['Pendente', 'Em Andamento'])
    .get();

  // Verifica se a consulta retornou resultados
  if (snapshot.empty) {
    console.log('No tasks found due in 3 days with status Pendente or Em Andamento.');
    return null; // Retorna null se não houver tarefas para notificar
  }

  // Cria uma lista para armazenar as mensagens a serem enviadas
  const messages = [];
  
  // Itera sobre os documentos encontrados na consulta
  snapshot.forEach(doc => {
    const task = doc.data(); // Obtém os dados da tarefa

    // Cria uma mensagem para a notificação
    const message = {
      notification: {
        title: 'Tarefa Pendentes!',
        body: `A tarefa "${task.description}" está a 3 dias da data de entrega.`,
      },
      topic: 'tasks', // Define o tópico para enviar a notificação
    };

    // Adiciona a mensagem à lista de mensagens
    messages.push(message);
  });

  // Envia todas as mensagens para o Firebase Cloud Messaging
  const response = await admin.messaging().sendAll(messages);
  console.log('Successfully sent messages:', response);

  return null; // Retorna null após o envio das mensagens
});
