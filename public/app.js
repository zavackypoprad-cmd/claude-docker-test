// API Base URL
const API_URL = '/api/todos';

// DOM Elements
const todoForm = document.getElementById('todo-form');
const todoInput = document.getElementById('todo-input');
const addButton = document.getElementById('add-button');
const todosList = document.getElementById('todos-list');
const emptyState = document.getElementById('empty-state');
const loading = document.getElementById('loading');
const errorMessage = document.getElementById('error-message');
const errorText = document.getElementById('error-text');
const successMessage = document.getElementById('success-message');
const successText = document.getElementById('success-text');
const totalCount = document.getElementById('total-count');
const activeCount = document.getElementById('active-count');
const completedCount = document.getElementById('completed-count');

// State
let todos = [];
let isLoading = false;

// Initialize app
document.addEventListener('DOMContentLoaded', () => {
    loadTodos();
    setupEventListeners();
});

// Setup event listeners
function setupEventListeners() {
    todoForm.addEventListener('submit', handleAddTodo);
}

// Show/hide loading state
function setLoading(loading) {
    isLoading = loading;
    document.getElementById('loading').classList.toggle('hidden', !loading);
    addButton.disabled = loading;
}

// Show error message
function showError(message) {
    errorText.textContent = message;
    errorMessage.classList.remove('hidden');
    setTimeout(() => {
        errorMessage.classList.add('hidden');
    }, 5000);
}

// Show success message
function showSuccess(message) {
    successText.textContent = message;
    successMessage.classList.remove('hidden');
    setTimeout(() => {
        successMessage.classList.add('hidden');
    }, 3000);
}

// Load todos from API
async function loadTodos() {
    setLoading(true);
    try {
        const response = await fetch(API_URL);

        if (!response.ok) {
            throw new Error('Nepodařilo se načíst úkoly');
        }

        const result = await response.json();
        todos = result.data;
        renderTodos();
        updateStats();
    } catch (error) {
        console.error('Error loading todos:', error);
        showError(error.message);
    } finally {
        setLoading(false);
    }
}

// Add new todo
async function handleAddTodo(e) {
    e.preventDefault();

    const title = todoInput.value.trim();

    if (!title) {
        showError('Název úkolu nemůže být prázdný');
        return;
    }

    if (title.length > 255) {
        showError('Název úkolu je příliš dlouhý (max 255 znaků)');
        return;
    }

    setLoading(true);
    try {
        const response = await fetch(API_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ title }),
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Nepodařilo se přidat úkol');
        }

        const result = await response.json();
        todos.unshift(result.data); // Add to beginning of array
        todoInput.value = '';
        renderTodos();
        updateStats();
        showSuccess('Úkol byl úspěšně přidán!');
    } catch (error) {
        console.error('Error adding todo:', error);
        showError(error.message);
    } finally {
        setLoading(false);
    }
}

// Toggle todo completed status
async function toggleTodo(id) {
    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'PATCH',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Nepodařilo se aktualizovat úkol');
        }

        const result = await response.json();
        const index = todos.findIndex(todo => todo.id === id);
        if (index !== -1) {
            todos[index] = result.data;
        }
        renderTodos();
        updateStats();
    } catch (error) {
        console.error('Error toggling todo:', error);
        showError(error.message);
    }
}

// Delete todo
async function deleteTodo(id) {
    if (!confirm('Opravdu chcete smazat tento úkol?')) {
        return;
    }

    try {
        const response = await fetch(`${API_URL}/${id}`, {
            method: 'DELETE',
        });

        if (!response.ok) {
            const error = await response.json();
            throw new Error(error.message || 'Nepodařilo se smazat úkol');
        }

        todos = todos.filter(todo => todo.id !== id);
        renderTodos();
        updateStats();
        showSuccess('Úkol byl smazán');
    } catch (error) {
        console.error('Error deleting todo:', error);
        showError(error.message);
    }
}

// Render todos to DOM
function renderTodos() {
    if (todos.length === 0) {
        emptyState.classList.remove('hidden');
        todosList.classList.add('hidden');
    } else {
        emptyState.classList.add('hidden');
        todosList.classList.remove('hidden');

        todosList.innerHTML = todos.map(todo => `
            <li class="fade-in">
                <div class="flex items-center gap-3 px-6 py-4 hover:bg-gray-50 transition-colors">
                    <!-- Checkbox -->
                    <input
                        type="checkbox"
                        ${todo.completed ? 'checked' : ''}
                        onchange="toggleTodo(${todo.id})"
                        class="w-5 h-5 text-indigo-600 rounded focus:ring-2 focus:ring-indigo-500 cursor-pointer"
                    />

                    <!-- Todo Text -->
                    <div class="flex-1 ${todo.completed ? 'completed-text' : ''}">
                        <p class="text-gray-800 ${todo.completed ? 'text-gray-500' : ''}">${escapeHtml(todo.title)}</p>
                        <p class="text-xs text-gray-400 mt-1">${formatDate(todo.created_at)}</p>
                    </div>

                    <!-- Delete Button -->
                    <button
                        onclick="deleteTodo(${todo.id})"
                        class="px-3 py-1.5 text-red-600 hover:bg-red-50 rounded-lg transition-colors focus:outline-none focus:ring-2 focus:ring-red-500"
                        title="Smazat úkol"
                    >
                        🗑️ Smazat
                    </button>
                </div>
            </li>
        `).join('');
    }
}

// Update statistics
function updateStats() {
    const total = todos.length;
    const completed = todos.filter(todo => todo.completed).length;
    const active = total - completed;

    totalCount.textContent = total;
    activeCount.textContent = active;
    completedCount.textContent = completed;
}

// Format date
function formatDate(dateString) {
    const date = new Date(dateString);
    const now = new Date();
    const diffMs = now - date;
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMs / 3600000);
    const diffDays = Math.floor(diffMs / 86400000);

    if (diffMins < 1) return 'Právě teď';
    if (diffMins < 60) return `Před ${diffMins} min`;
    if (diffHours < 24) return `Před ${diffHours} h`;
    if (diffDays < 7) return `Před ${diffDays} dny`;

    return date.toLocaleDateString('cs-CZ', {
        day: 'numeric',
        month: 'short',
        year: date.getFullYear() !== now.getFullYear() ? 'numeric' : undefined
    });
}

// Escape HTML to prevent XSS
function escapeHtml(text) {
    const map = {
        '&': '&amp;',
        '<': '&lt;',
        '>': '&gt;',
        '"': '&quot;',
        "'": '&#039;'
    };
    return text.replace(/[&<>"']/g, m => map[m]);
}
