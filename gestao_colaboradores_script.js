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
    const membersGrid = document.getElementById('membersGrid');
    const memberModal = document.getElementById('memberModal');
    const closeModal = document.getElementsByClassName('close')[0];
    const createMemberBtn = document.getElementById('createMemberBtn');
    const saveMemberBtn = document.getElementById('saveMemberBtn');
    const memberForm = document.getElementById('memberForm');

    if (!membersGrid || !memberModal || !closeModal || !createMemberBtn || !saveMemberBtn || !memberForm) {
        console.error("Um ou mais elementos do DOM não foram encontrados. Verifique o HTML.");
        return;

    }

    const logoutBtn = document.getElementById('logoutBtn');

    if (logoutBtn) {
        logoutBtn.addEventListener('click', () => {
            window.location.href = 'index.html';
        });
    }

    let members = [];

    async function loadMembersFromFirestore() {
        const querySnapshot = await db.collection("colaboradores").get();
        members = await Promise.all(querySnapshot.docs.map(async doc => {
            const member = { id: doc.id, ...doc.data() };
            
            // Buscar as tarefas não concluídas do colaborador
            const tasksSnapshot = await db.collection("task")
                .where("assignedTo", "==", member.name)
                .where("status", "in", ["Em Andamento", "Pendente"])
                .get();
            
            // Somar o tempo estimado das tarefas não concluídas
            const totalHours = tasksSnapshot.docs.reduce((sum, taskDoc) => {
                return sum + (parseFloat(taskDoc.data().estimatedTime) || 0);
            }, 0);
            
            member.totalHours = totalHours;
            return member;
        }));
        
        renderMembers();
    }
    
    function openModal(member = null) {
        if (member) {
            document.getElementById('modalTitle').innerText = 'Editar Colaborador';
            document.getElementById('memberId').value = member.id;
            document.getElementById('name').value = member.name;
            document.getElementById('role').value = member.role;
            document.getElementById('email').value = member.email;
        } else {
            document.getElementById('modalTitle').innerText = 'Criar Colaborador';
            memberForm.reset();
        }
        memberModal.style.display = 'block';
    }

    function closeModalFunc() {
        memberModal.style.display = 'none';
    }

    async function saveMember(e) {
        e.preventDefault();
        const id = document.getElementById('memberId').value;
        const name = document.getElementById('name').value;
        const role = document.getElementById('role').value;
        const email = document.getElementById('email').value;
    
        // Verificação de campos obrigatórios
        if (!name || !role || !email) {
            alert("Todos os campos são obrigatórios. Por favor, preencha todos os campos.");
            return;
        }
    
        // Validação de formato de e-mail
        const emailPattern = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
        if (!emailPattern.test(email)) {
            alert("Por favor, insira um endereço de e-mail válido.");
            return;
        }
    
        if (id) {
            // Editar colaborador existente
            await db.collection("colaboradores").doc(id).set({
                name,
                role,
                email
            });
        } else {
            // Criar novo colaborador
            await db.collection("colaboradores").add({
                name,
                role,
                email
            });
        }
    
        closeModalFunc();
        loadMembersFromFirestore();
    }

    async function deleteMember(id) {
        // Exibir uma caixa de confirmação antes de deletar
        const confirmation = confirm("Tem certeza de que deseja deletar este colaborador?");
        
        if (confirmation) {
            try {
                await db.collection("colaboradores").doc(id).delete();
                loadMembersFromFirestore();
            } catch (error) {
                console.error("Erro ao deletar colaborador: ", error);
                alert("Ocorreu um erro ao tentar deletar o colaborador. Tente novamente.");
            }
        } else {
            // Caso o usuário cancele, a deleção não será realizada
            alert("A deleção foi cancelada.");
        }
    }

    function renderMembers() {
        membersGrid.innerHTML = '';
        members.forEach(member => {
            const memberCard = document.createElement('div');
            memberCard.className = 'member-card';
            memberCard.innerHTML = `
                <h3>${member.name}</h3>
                <p><strong>Função:</strong> ${member.role}</p>
                <p><strong>Email:</strong> ${member.email}</p>
                <p><strong>Horas Totais:</strong> ${member.totalHours} horas</p>
                <div class="actions">
                    <button class="edit"><i class="fas fa-edit"></i> Editar</button>
                    <button class="delete"><i class="fas fa-trash"></i> Deletar</button>
                </div>
            `;
            memberCard.querySelector('.edit').addEventListener('click', () => openModal(member));
            memberCard.querySelector('.delete').addEventListener('click', () => deleteMember(member.id));
            membersGrid.appendChild(memberCard);
        });
    }    

    createMemberBtn.addEventListener('click', () => openModal());
    saveMemberBtn.addEventListener('click', saveMember);
    closeModal.addEventListener('click', closeModalFunc);

    // Inicializa a lista de colaboradores
    loadMembersFromFirestore();
});