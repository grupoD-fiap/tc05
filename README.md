# Gestão de Tarefas e Colaboradores
Este é um projeto de gestão de tarefas e colaboradores desenvolvido como parte de um desafio técnico. O sistema permite gerenciar colaboradores e suas tarefas associadas, com funcionalidades para criar, editar e excluir tanto colaboradores quanto tarefas. O projeto utiliza Firebase para autenticação e Firestore como banco de dados.

## Funcionalidades Principais
- **Autenticação de Usuários**: O sistema utiliza Firebase Authentication para gerenciar o login dos usuários.
- **Gestão de Colaboradores**: Possibilidade de criar, editar e excluir colaboradores. Cada colaborador tem um nome, função, e-mail e um somatório de horas de tarefas pendentes.
- **Gestão de Tarefas**: Possibilidade de criar, editar e excluir tarefas. Cada tarefa tem uma descrição, data de entrega, prioridade, status e está atribuída a um colaborador.
- **Cálculo de Horas Pendentes**: O sistema calcula automaticamente as horas totais de tarefas não concluídas para cada colaborador.
- **Filtros de Tarefas**: Permite filtrar tarefas por status, prioridade e colaborador.

## Tecnologias Utilizadas
- **HTML5**
- **CSS3**
- **JavaScript (ES6+)**
- **Firebase Authentication**
- **Firestore (Firebase Database)**
- **Firebase Functions**

## Estrutura do Projeto
- `index.html`: Tela de login do sistema.
- `gestao_colaboradores.html`: Página de gestão de colaboradores.
- `tarefas.html`: Página de gestão de tarefas.
- `index.js`: Arquivo principal para configuração do Firebase.
- `gestao_colaboradores_script.js`: Script JavaScript para gerenciar colaboradores.
- `tarefas_script.js`: Script JavaScript para gerenciar tarefas.
- `gestao_colaboradores_styles.css`: Estilos CSS para a página de colaboradores.
- `tarefas_styles.css`: Estilos CSS para a página de tarefas.
- `notification.js`: Logica para receber a notificação na pag web.
- `firebase-messaging-sw.ks`: Logica para receber a notificação no dispositivo.
- `funcition/index.html`: logica de envio de notificação via firebase function
- `package.json`: Gerenciamento de dependências do projeto.

## pacotes via node
    npm init -y
    npm i -D firebase-tools
    npx firebase login
    npx firebase experiments:enable webframeworks
    npx firebase init hosting
    npm install firebase


## Credenciais do Firebase
    apiKey: "AIzaSyC8evOJBLJ7g4lpW5CBL3WKn_rBg83m4Gk",
    authDomain: "techchallenge05-e62ab.firebaseapp.com",
    projectId: "techchallenge05-e62ab",
    storageBucket: "techchallenge05-e62ab.appspot.com",
    messagingSenderId: "570578984807",
    appId: "1:570578984807:web:cf7ebb881a39978c2599c2",
    measurementId: "G-8HW7CJLMJP"

## Estrutura do Firebase
**Coleção colaboradores:**
name: Nome do colaborador.
role: Função do colaborador.
email: E-mail do colaborador.

**Coleção task:**
description: Descrição da tarefa.
dueDate: Data de entrega da tarefa.
estimatedTime: Tempo estimado para conclusão da tarefa.
priority: Prioridade da tarefa.
status: Status da tarefa (Pendente, Em Progresso, Concluída, etc.).
assignedTo: Nome do colaborador responsável pela tarefa.
