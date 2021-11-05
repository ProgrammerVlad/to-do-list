const $tasksList = document.getElementById("todoList");
const $textInput = document.getElementById("todoInput");
const $addTodo = document.getElementById("addBtn");
const $filterHeader = document.getElementById("filterHeader");
const $filterBody = document.getElementById("filterBody");
const $currentFilterValue = document.getElementById("filterCurrent");
const $modalText = document.getElementById('modalText');

let todos = [];

const storage = JSON.parse(localStorage.getItem('todo'));

if(storage){
  todos = storage;
  renderHTML();
  todosFilter();
}

$addTodo.addEventListener('click', createTodo);

document.addEventListener('keypress', (event) => {
  if(event.code == 'Enter'){
    createTodo();
  }
});

function createTodo() {
  const isValid = $textInput.value.trim() && $textInput.value.length > 2;

  if(isValid){

    const newTodo = {
      message: $textInput.value,
      status: 'active'
    };

    todos.push(newTodo);
    renderHTML();
    updateTodosStorage();
    $textInput.value = '';
  } else {
    $modalText.innerText = 'Ошибка валидации данных';
    errorModalWindow();
  }
}

function createDOMElement(tagName, className) {
  const $newDOMElement = document.createElement(tagName);
  $newDOMElement.classList.add(className);
  return $newDOMElement;
}

function createTodoElement(task, index) {
  const $todoBody = createDOMElement('li', 'todo__link');
  const $todoText = createDOMElement('div', 'todo__text');
  const $todoButtonsContainer = createDOMElement('div', 'todo__buttons');
  const $todoButtonDone = createDOMElement('button', 'todo__done');
  const $todoButtonDelete = createDOMElement('button', 'todo__close');

  task.status === 'completed' ? $todoBody.classList.add('checked') : '';

  $todoText.innerText = task.message;

  function checkTodoElement() {
    $todoBody.classList.toggle('checked');
      if ($todoBody.classList.contains('checked')) {
            todos[index].status = 'completed';
            updateTodosStorage();
        } else {
            todos[index].status = 'active';
            updateTodosStorage();
        }
  }
  function deleteTodoElement(list = todos) {
      console.log($currentFilterValue.innerText);
      if($currentFilterValue.innerText !== 'All'){
        $modalText.innerText = 'Удаление доступно только в режиме All';
        errorModalWindow();
      }
      else{
        $todoButtonDelete.closest('li').remove();
        todos.splice(index, 1);
        renderHTML();
        updateTodosStorage();
      }
  }

  $todoButtonDone.addEventListener('click', checkTodoElement);
  $todoButtonDelete.addEventListener('click', deleteTodoElement);

  $todoBody.append($todoText, $todoButtonsContainer);
  $todoButtonsContainer.append($todoButtonDone, $todoButtonDelete);

  return $todoBody;
}

function renderHTML(todoList = todos) {
  $tasksList.innerHTML = '';
  todoList.forEach((currentTodo, index) => {
    $tasksList.appendChild(createTodoElement(currentTodo, index));
  });
}

function updateTodosStorage() {
  localStorage.setItem('todo', JSON.stringify(todos));
}



function todosFilter() {
  $filterHeader.addEventListener('click', () => {
    $filterBody.classList.toggle('isActive');

    if($filterBody.classList.contains('isActive')) {
      $filterBody.addEventListener('click', (event) => {
        $currentFilterValue.innerText = event.target.innerText;
        $filterBody.classList.remove('isActive');

        if($currentFilterValue.innerText == 'All') {
          renderHTML();


          $addTodo.removeEventListener('click', errorModalWindow);
          $addTodo.addEventListener('click', createTodo);

        } else if ($currentFilterValue.innerText == 'Completed') {
          const completedTodos = todos.filter(item => item.status == 'completed');
          renderHTML(completedTodos);

          $modalText.innerText = 'Ошибка, добавлять можно только в режиме All';

          $addTodo.removeEventListener('click', createTodo);
          $addTodo.addEventListener('click', errorModalWindow);
        } else {
          const activeTodos = todos.filter(item => item.status == 'active');
          renderHTML(activeTodos);

          $modalText.innerText = 'Ошибка, добавлять можно только в режиме All';

          $addTodo.removeEventListener('click', createTodo);
          $addTodo.addEventListener('click', errorModalWindow);
        }
      });
    }
  });
}

function errorModalWindow() {
  const $modalWindow = document.getElementById('modalAddError');
  $modalWindow.classList.add('addError');

  setTimeout(() => {
    $modalWindow.classList.remove('addError');
  }, 1500);
}




