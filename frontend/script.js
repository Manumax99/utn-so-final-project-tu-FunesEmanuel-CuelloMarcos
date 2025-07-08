// Function to load students
async function loadStudents() {
  const response = await fetch("/api/students");
  const students = await response.json();
  const tbody = document.querySelector("#studentsTable tbody");
  tbody.innerHTML = "";
  students.forEach((student) => {
    const row = document.createElement("tr");
    row.innerHTML = `<td>${student.id}</td><td>${student.name}</td>`;
    tbody.appendChild(row);
  });
}

// Event listener for load button
document.getElementById("loadButton").addEventListener("click", loadStudents);

// Event listener for the "Add Student" button
document.getElementById("addStudentButton").addEventListener("click", async () => {
  const nameInput = document.getElementById("newStudentName");
  const name = nameInput.value.trim();
  const messageDiv = document.getElementById("addStudentMessage");
  
  if (!name) {
    messageDiv.textContent = "Por favor, ingrese un nombre para el estudiante.";
    messageDiv.className = "message error";
    return;
  }
  
  try {
    const response = await fetch("/api/students", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({ name })
    });
    
    if (!response.ok) {
      throw new Error("Error al agregar estudiante");
    }
    
    const newStudent = await response.json();
    
    // Show success message
    messageDiv.textContent = `Estudiante "${newStudent.name}" agregado con éxito (ID: ${newStudent.id})`;
    messageDiv.className = "message success";
    
    // Clear input
    nameInput.value = "";
    
    // Reload student list
    await loadStudents();
    
  } catch (error) {
    console.error("Error:", error);
    messageDiv.textContent = "Error al agregar el estudiante.";
    messageDiv.className = "message error";
  }
});

// Greeting saying Hi to your name
document.getElementById("greetButton").addEventListener("click", async () => {
  const nameInput = document.getElementById("newStudentName");
  const name = nameInput.value.trim();
  const greetingMessage = document.getElementById("greetingMessage");
  
  if (name) {
    try {
      const response = await fetch(`/api/greet?name=${encodeURIComponent(name)}`);
      const data = await response.json();
      greetingMessage.textContent = data.message;
      greetingMessage.style.display = "block";
      // debug
      console.log(`${name}`)
    } catch (error) {
      console.error("Error fetching greeting:", error);
      greetingMessage.textContent = "Error al obtener el saludo.";
      greetingMessage.style.display = "block";
    }
  } else {
    greetingMessage.textContent = "Por favor, ingrese un nombre.";
    greetingMessage.style.display = "block";
    console.log("Ingrese un nombre valido")
  }
});

// Load students when the page loads
document.addEventListener("DOMContentLoaded", loadStudents);