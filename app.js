// Configuración: cambia BASE_URL si tu API usa otro puerto/ruta
const BASE_URL = 'http://localhost:5000/api';

// Helpers
const $ = (sel) => document.querySelector(sel);
const qs = (sel) => document.querySelectorAll(sel);

const showMsg = (text, timeout = 2500) => {
  const m = document.createElement('div');
  m.className = 'msg';
  m.textContent = text;
  $('#messages').appendChild(m);
  setTimeout(() => m.remove(), timeout);
};

const authFetch = (url, opts = {}) => {
  const token = localStorage.getItem('token');
  const headers = opts.headers || {};
  headers['Content-Type'] = 'application/json';
  if (token) headers['Authorization'] = `Bearer ${token}`;
  return fetch(url, { ...opts, headers });
};

// DOM elements
const loginForm = $('#loginForm');
const registerForm = $('#registerForm');
const createForm = $('#createForm');
const todosList = $('#todosList');
const authSection = $('#auth-section');
const appSection = $('#app-section');
const userInfo = $('#user-info');
const usernameEl = $('#username');
const logoutBtn = $('#logoutBtn');

// Estado simple
let currentUser = null;

// Views
function showApp() {
  authSection.classList.add('hidden');
  appSection.classList.remove('hidden');
  userInfo.classList.remove('hidden');
  usernameEl.textContent = currentUser?.username || '';
  loadTodos();
}
function showAuth() {
  authSection.classList.remove('hidden');
  appSection.classList.add('hidden');
  userInfo.classList.add('hidden');
}

// Auth actions
registerForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const username = $('#regUsername').value.trim();
  const email = $('#regEmail').value.trim();
  const password = $('#regPassword').value;
  try {
    const res = await fetch(`${BASE_URL}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error de registro');
    showMsg('Registro exitoso. Puedes iniciar sesión.');
    registerForm.reset();
  } catch (err) {
    showMsg(err.message || 'Error');
  }
});

loginForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const email = $('#loginEmail').value.trim();
  const password = $('#loginPassword').value;
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error de login');

    localStorage.setItem('token', data.token);
    localStorage.setItem('user', JSON.stringify(data.user));
    currentUser = data.user;
    showApp();
    loginForm.reset();
    showMsg('Inicio de sesión correcto');
  } catch (err) {
    showMsg(err.message || 'Error');
  }
});

logoutBtn.addEventListener('click', () => {
  localStorage.removeItem('token');
  localStorage.removeItem('user');
  currentUser = null;
  showAuth();
});

// Todos actions
createForm.addEventListener('submit', async (e) => {
  e.preventDefault();
  const title = $('#title').value.trim();
  const description = $('#description').value.trim();
  try {
    const res = await authFetch(`${BASE_URL}/todos`, {
      method: 'POST',
      body: JSON.stringify({ title, description })
    });
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error creando tarea');
    createForm.reset();
    showMsg('Tarea creada');
    loadTodos();
  } catch (err) {
    showMsg(err.message || 'Error');
  }
});

async function loadTodos() {
  todosList.innerHTML = '<li>Cargando...</li>';
  try {
    const res = await authFetch(`${BASE_URL}/todos`);
    const data = await res.json();
    if (!res.ok) throw new Error(data.error || 'Error cargando tareas');
    renderTodos(data);
  } catch (err) {
    todosList.innerHTML = '';
    showMsg(err.message || 'Error');
  }
}

function renderTodos(todos) {
  todosList.innerHTML = '';
  if (!todos.length) {
    todosList.innerHTML = '<li>No tienes tareas aún.</li>';
    return;
  }
  todos.forEach(t => {
    const li = document.createElement('li');
    li.className = 'todo' + (t.completed ? ' completed' : '');

    li.innerHTML = `
      <div class="meta">
        <input type="checkbox" data-id="${t._id}" class="toggle" ${t.completed ? 'checked' : ''} />
        <div>
          <strong>${escapeHtml(t.title)}</strong><br/>
          <small>${escapeHtml(t.description || '')}</small>
        </div>
      </div>
      <div class="controls">
        <button data-id="${t._id}" class="edit">Editar</button>
        <button data-id="${t._id}" class="delete secondary">Eliminar</button>
      </div>
    `;

    // handlers
    li.querySelector('.toggle').addEventListener('change', async (e) => {
      const id = e.target.dataset.id;
      try {
        const res = await authFetch(`${BASE_URL}/todos/${id}`, {
          method: 'PUT',
          body: JSON.stringify({ completed: e.target.checked })
        });
        if (!res.ok) {
          const d = await res.json();
          throw new Error(d.error || 'Error actualizando');
        }
        loadTodos();
      } catch (err) { showMsg(err.message); }
    });

    li.querySelector('.delete').addEventListener('click', async (e) => {
      const id = e.target.dataset.id;
      if (!confirm('¿Eliminar esta tarea?')) return;
      try {
        const res = await authFetch(`${BASE_URL}/todos/${id}`, { method: 'DELETE' });
        const d = await res.json();
        if (!res.ok) throw new Error(d.error || 'Error eliminando');
        showMsg('Tarea eliminada');
        loadTodos();
      } catch (err) { showMsg(err.message); }
    });

    li.querySelector('.edit').addEventListener('click', () => {
      const newTitle = prompt('Nuevo título', t.title);
      if (newTitle == null) return; // cancel
      const newDesc = prompt('Nueva descripción', t.description || '');
      updateTodo(t._id, { title: newTitle.trim(), description: newDesc.trim() });
    });

    todosList.appendChild(li);
  });
}

async function updateTodo(id, payload) {
  try {
    const res = await authFetch(`${BASE_URL}/todos/${id}`, {
      method: 'PUT',
      body: JSON.stringify(payload)
    });
    const d = await res.json();
    if (!res.ok) throw new Error(d.error || 'Error actualizando');
    showMsg('Tarea actualizada');
    loadTodos();
  } catch (err) { showMsg(err.message); }
}

function escapeHtml(unsafe) {
  return unsafe
       .replace(/&/g, "&amp;")
       .replace(/</g, "&lt;")
       .replace(/>/g, "&gt;")
       .replace(/\"/g, "&quot;")
       .replace(/\'/g, "&#039;");
}

// Inicialización
(function init(){
  const user = localStorage.getItem('user');
  const token = localStorage.getItem('token');
  if (user && token) {
    try { currentUser = JSON.parse(user); showApp(); } catch(e){ localStorage.removeItem('user'); localStorage.removeItem('token'); showAuth(); }
  } else showAuth();
})();
