document.getElementById('newsForm').addEventListener("submit", async (event) => {
  event.preventDefault(); // Prevenir la recarga de la página

  const newsText = document.getElementById('newsText').value;
  const newsImage = document.getElementById('newsImage').files[0];
  const resultElement = document.getElementById('result');

  // Validar que haya texto en la noticia
  if (!newsText && !newsImage) {
    resultElement.textContent = 'Por favor, escribe o sube una noticia.';
    return;
  }

  const formData = new FormData();
  formData.append("text", newsText);
  if (newsImage) {
    formData.append("image", newsImage);
  }

  try {
    const response = await fetch('http://localhost:5000/verify', {
      method: 'POST',
      body: formData,
    });

    if (!response.ok) {
      throw new Error('Error al comunicarse con el servidor.');
    }

    const data = await response.json();
    resultElement.textContent = data.message;
  } catch (error) {
    console.error('Error:', error);
    resultElement.textContent = 'Hubo un error al verificar la noticia.';
  }
});
