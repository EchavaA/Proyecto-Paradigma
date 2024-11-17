
document.getElementById("newsForm").addEventListener("submit", async (event) => {
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
});
