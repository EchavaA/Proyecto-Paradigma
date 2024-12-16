document.getElementById("newsForm").addEventListener("submit", async function (event) {
  event.preventDefault(); // Evitar el comportamiento predeterminado del formulario
  const resultDiv = document.getElementById("result");
  resultDiv.innerHTML = "Procesando...";
  // Crear un objeto FormData para enviar los datos
  const formData = new FormData();
  const imageFile = document.getElementById("newsImage").files[0];
  const newsText = document.getElementById("newsText").value.trim();
  if (imageFile) {
    formData.append("image", imageFile);
  }
  if (newsText) {
    formData.append("text", newsText);
  }

  if (!imageFile && !newsText) {
    resultDiv.innerHTML = "Por favor, proporciona una imagen o un texto para verificar.";
    return;
  }

  try {
    // Realizar la solicitud POST al backend
    const response = await fetch("http://127.0.0.1:5500/check-url", {
      method: "POST",
      body: formData,
    });

    if (!response.ok) {
      throw new Error("Error al procesar la solicitud");
    }

    const result = await response.json();

    // Mostrar el resultado al usuario
    resultDiv.innerHTML = `
<p>${result.message}</p>
<p><strong>¿Es confiable?</strong> ${result.isReliable ? "Sí" : "No"}</p>
    `;
  } catch (error) {
    console.error("Error:", error);
    resultDiv.innerHTML = "Ocurrió un error al verificar la noticia. Inténtalo de nuevo.";
  }
});