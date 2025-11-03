import "../../styles/tips.css";
const MainTips = () => {
  return (
    <div className="card-consejo">
      <div className="overlay"></div>

      <div className="contenido">
        <h2>🌱 ¿Cómo regar correctamente las plantas?</h2>

        <p>
          Uno de los problemas más frecuentes al cuidar nuestras plantas es el{" "}
          <strong>descontrol de riego</strong>. Por lo general, regamos en
          exceso las plantas de interior, lo que daña sus raíces y hojas.
        </p>

        <p>
          Aprender a regar correctamente es una de las tareas más difíciles.
          Aquí te contamos los factores más importantes y cómo hacerlo bien.
        </p>

        <div className="bloque">
          <h3>🌼 Señales de descontrol de riego</h3>
          <ul>
            <li>Puntas de hojas amarillentas o secas.</li>
            <li>Hojas caídas o blandas.</li>
            <li>Hojas nuevas que se secan antes de crecer.</li>
            <li>Sustrato duro o con exceso de humedad.</li>
          </ul>
        </div>

        <div className="bloque">
          <h3>💧 ¿Cómo regar correctamente?</h3>
          <p>
            Antes de regar, toca la tierra. Si está seca, riega abundantemente
            cubriendo toda la superficie. Si está húmeda, espera un poco más
            para evitar exceso de agua.
          </p>
        </div>

        <div className="bloque">
          <h3>⏰ ¿Cuándo regar?</h3>
          <p>
            Depende de la humedad ambiental, el viento y la temperatura. La
            mejor forma de comprobarlo es enterrar un dedo o un palito: si sale
            seco, ¡es hora de regar!
          </p>
        </div>

        <div className="nota">
          🌸 Consejo: Mejor esperar un día más que regar de más.
        </div>
      </div>
    </div>
  );
};

export default MainTips;
