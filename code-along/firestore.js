document.addEventListener('DOMContentLoaded', async function(event) {
  // Step 1: Make the world's tiniest to-do app

  document.querySelector('form').addEventListener('submit', async function(event){
    event.preventDefault()
    console.log('form was submitted')

    let todoText = document.querySelector('#todo').value
    console.log(todoText)

    let docRef = await db.collection('todos').add({
      text: todoText
      // id isn't specified so will auto generate
    })
    let todoID = docRef.id

    if (todoText.length >0) {
      document.querySelector('.todos').insertAdjacentHTML('beforeend', `
      <div class="todo-${todoID} py-4 text-xl border-b-2 border-purple-500 w-full">
      <a href="#" class="done p-2 text-sm bg-green-500 text-white">Done</a>
      ${todoText}
      </div>
    `)
    document.querySelector('#todo').value = ''

    document.querySelector(`.todo-${todoID} .done`).addEventListener('click', async function(event) {
      console.log(`todo with ${todoID} clicked!`)
      event.preventDefault()
      document.querySelector(`.todo-${todoID}`).classList.add('opacity-20')
      await db.collection('todos').doc(todoID).delete()
    })
    }
  })

  // Step 2: Read existing to-dos from Firestore

  let db = firebase.firestore()
  let querySnapshot = await db.collection('todos').get()
  // console.log(querySnapshot.size)

  let todos = querySnapshot.docs
  // console.log(todos)

  for (let i=0; i<todos.length; i++) {
    let todoID = todos[i].id // only way to get id out, can't do todoData.id
    let todoData = todos[i].data() // needed before extracting text, we named it text in the firestore
    let todoText = todoData.text
    // console.log(todoText)
    document.querySelector('.todos').insertAdjacentHTML('beforeend', `
      <div class="todo-${todoID} py-4 text-xl border-b-2 border-purple-500 w-full">
      <a href="#" class="done p-2 text-sm bg-green-500 text-white">Done</a>
      ${todoText}
      </div>
    `)
    document.querySelector(`.todo-${todoID} .done`).addEventListener('click', async function(event) {
      console.log(`todo with ${todoID} clicked!`)
      event.preventDefault()
      document.querySelector(`.todo-${todoID}`).classList.add('opacity-20')
      await db.collection('todos').doc(todoID).delete()
    })
  }

  // Step 3: Add code to Step 1 to add todo to Firestore
  // Step 4: Add code to allow completing todos



})