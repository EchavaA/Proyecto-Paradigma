document.getElementById('newsForm').addEventListener("submit", async () => {
    const urlInput = document.getElementById('urlInput').value;
    const resultElement = document.getElementById('result');
  
    if (!urlInput) {
      resultElement.textContent = 'Por favor, ingresa un URL.';
      return;
    }
  try {
      // Llama al backend para verificar el URL
      const response = await fetch('http://localhost:5500/check-url', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ url: urlInput }),
      });
  
      if (!response.ok) {
        throw new Error('Error al comunicarse con el servidor.');
      }
  
      const data = await response.json();
      resultElement.textContent = `Resultado: ${data.message}`;
    } catch (error) {
      console.error('Error:', error);
      resultElement.textContent = 'Hubo un error al verificar el URL.';
    }
  });



/*document.getElementById("newsForm").addEventListener("submit", async (event) => {
    event.preventDefault(); // Evitar que el formulario recargue la página

    const resultDiv = document.getElementById("result");
    resultDiv.textContent = "Verificando la noticia...";
    resultDiv.className = "result";

    // Construir el FormData con los datos del formulario
    const formData = new FormData();
    const imageFile = document.getElementById("newsImage").files[0];
    const newsText = document.getElementById("newsText").value;

    if (imageFile) {
        formData.append("image", imageFile); // Adjuntar archivo de imagen
    }
    if (newsText) {
        formData.append("text", newsText); // Adjuntar texto
    }

    console.log("FormData enviado:", [...formData.entries()]); // Log para verificar los datos enviados

    try {
        // Enviar los datos al backend con fetch
        const response = await fetch("http://127.0.0.1:5000/verify", {
            method: "POST", // Método POST
            body: formData, // FormData como cuerpo de la solicitud
        });

        const data = await response.json(); // Convertir la respuesta a JSON

        console.log("Respuesta del backend:", data); // Log para verificar la respuesta del backend

        // Mostrar el resultado al usuario
        resultDiv.textContent = data.message;
        resultDiv.className = data.isReliable ? "result success" : "result error";
    } catch (error) {
        console.error("Error al enviar la solicitud:", error); // Log de error
        resultDiv.textContent = "Error al verificar la noticia. Intenta de nuevo.";
        resultDiv.className = "result error";
    }
});*/
