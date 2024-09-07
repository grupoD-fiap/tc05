// Inicializar o Firebase
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
const db = firebase.firestore();

document.addEventListener('DOMContentLoaded', function () {
    const taskGrid = document.getElementById('taskGrid');
    const taskModal = document.getElementById('taskModal');
    const closeModal = document.getElementsByClassName('close')[0];
    const createTaskBtn = document.getElementById('createTaskBtn');
    const saveTaskBtn = document.getElementById('saveTaskBtn');
    const taskForm = document.getElementById('taskForm');
    
    const statusFilter = document.getElementById('statusFilter');
    const priorityFilter = document.getElementById('priorityFilter');
    const memberFilter = document.getElementById('memberFilter');
    
    if (!taskGrid || !taskModal || !closeModal || !createTaskBtn || !saveTaskBtn || !taskForm || !statusFilter || !priorityFilter || !memberFilter) {
        console.error("Um ou mais elementos do DOM não foram encontrados. Verifique o HTML.");
        return;
    }

    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    let tasks = [];
    let members = [];

    async function loadMembersFromFirestore() {
        const querySnapshot = await db.collection("colaboradores").get();
        members = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        populateMemberDropdown();
    }

    async function loadTasksFromFirestore() {
        const querySnapshot = await db.collection("task").get();
        tasks = querySnapshot.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
        }));
        loadTasks();
    }

    function openModal(task = null) {
        taskForm.reset();

        if (task) {
            document.getElementById('modalTitle').innerText = 'Editar Tarefa';
            document.getElementById('taskId').value = task.id;
            document.getElementById('description').value = task.description;
            document.getElementById('dueDate').value = task.dueDate;
            document.querySelector(`input[name="priority"][value="${task.priority}"]`).checked = true;
            document.getElementById('estimatedTime').value = task.estimatedTime;
            document.getElementById('status').value = task.status;
            setTimeout(() => {
                document.getElementById('assignedTo').value = task.assignedTo;
            }, 0);
            } else {
                document.getElementById('modalTitle').innerText = 'Criar Tarefa';
            }
        populateMemberDropdown();
        taskModal.style.display = 'block';
    }

    function closeModalFunc() {
        taskModal.style.display = 'none';
    }

    function populateMemberDropdown() {
        const assignedTo = document.getElementById('assignedTo');
        assignedTo.innerHTML = members.map(member => `<option value="${member.name}">${member.name}</option>`).join('');
        memberFilter.innerHTML = `<option value="">Todos os Colaboradores</option>` + members.map(member => `<option value="${member.name}">${member.name}</option>`).join('');
    }

    function formatDate(dateString) {
        const date = new Date(dateString);
        const day = String(date.getDate()).padStart(2, '0');
        const month = String(date.getMonth() + 1).padStart(2, '0');
        const year = date.getFullYear();
        return `${day}/${month}/${year}`;
    }

    function addTaskToGrid(task) {
        const taskCard = document.createElement('div');
        taskCard.className = 'task-card';
        taskCard.innerHTML = `
            <h3>${task.description}</h3>
            <p><strong>Status:</strong> ${task.status}</p>
            <p><strong>Prioridade:</strong> ${task.priority}</p>
            <p><strong>Atribuído a:</strong> ${task.assignedTo}</p>
            <p><strong>Prazo:</strong> ${formatDate(task.dueDate)}</p>
            <p><strong>Tempo Estimado:</strong> ${task.estimatedTime} horas</p>
            <div class="actions">
                <button class="edit"><i class="fas fa-edit"></i> Editar</button>
                <button class="delete"><i class="fas fa-trash"></i> Deletar</button>
            </div>
        `;
        taskCard.querySelector('.edit').addEventListener('click', () => openModal(task));
        taskCard.querySelector('.delete').addEventListener('click', () => deleteTaskHandler(task.id));
        taskGrid.appendChild(taskCard);
    }

    async function saveTask(e) {
        e.preventDefault();
        const id = document.getElementById('taskId').value;
        const description = document.getElementById('description').value;
        const dueDate = document.getElementById('dueDate').value;
        const priority = document.querySelector('input[name="priority"]:checked').value;
        const assignedTo = document.getElementById('assignedTo').value;
        const estimatedTime = document.getElementById('estimatedTime').value;
        const status = document.getElementById('status').value;

        // Verificação de campos obrigatórios
        if (!description || !dueDate || !priority || !assignedTo || !estimatedTime || !status) {
            alert("Todos os campos são obrigatórios. Por favor, preencha todos os campos.");
            return;
        }

        if (id) {
            // Editar tarefa existente
            await db.collection("task").doc(id).set({
                description,
                dueDate,
                priority,
                assignedTo,
                estimatedTime,
                status
            });
        } else {
            // Criar nova tarefa
            await db.collection("task").add({
                description,
                dueDate,
                priority,
                assignedTo,
                estimatedTime,
                status
            });
        }

        closeModalFunc();
        loadTasksFromFirestore();
    }

    async function deleteTaskHandler(id) {
        // Exibir uma caixa de confirmação antes de deletar
        const confirmation = confirm("Tem certeza de que deseja deletar esta tarefa?");
        
        if (confirmation) {
            try {
                await db.collection("task").doc(id).delete();
                loadTasksFromFirestore();
            } catch (error) {
                console.error("Erro ao deletar tarefa: ", error);
                alert("Ocorreu um erro ao tentar deletar a tarefa. Tente novamente.");
            }
        } else {
            // Caso o usuário cancele, a deleção não será realizada
            alert("A deleção foi cancelada.");
        }
    }
    
    function loadTasks() {
        taskGrid.innerHTML = '';
        const filteredTasks = tasks.filter(task => {
            const statusMatches = !statusFilter.value || task.status === statusFilter.value;
            const priorityMatches = !priorityFilter.value || task.priority === priorityFilter.value;
            const memberMatches = !memberFilter.value || task.assignedTo === memberFilter.value;
            return statusMatches && priorityMatches && memberMatches;
        });
        filteredTasks.forEach(addTaskToGrid);
    }
    
    createTaskBtn.addEventListener('click', () => openModal());
    saveTaskBtn.addEventListener('click', saveTask);
    closeModal.addEventListener('click', closeModalFunc);

    statusFilter.addEventListener('change', loadTasks);
    priorityFilter.addEventListener('change', loadTasks);
    memberFilter.addEventListener('change', loadTasks);

    // Inicializa a lista de colaboradores e tarefas
    loadMembersFromFirestore();
    loadTasksFromFirestore();
});
