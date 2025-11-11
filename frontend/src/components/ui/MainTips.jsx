import "../../styles/tips.css";

const MainTips = () => {
  const tips = [
    {
      id: 1,
      titulo: "💧 Riego adecuado",
      texto:
        "Evitá regar en exceso: tocá la tierra antes de hacerlo. Si está húmeda, esperá un poco más.",
      detalle: "Regar de más puede pudrir las raíces y dañar las hojas.",
      imagen:
        "https://images.unsplash.com/photo-1515150144380-bca9f1650ed9?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 2,
      titulo: "🌤️ Luz natural",
      texto:
        "Colocá tus plantas en lugares bien iluminados, pero evitá el sol directo en horas intensas.",
      detalle:
        "Un buen balance de luz mejora el crecimiento y color del follaje.",
      imagen:
        "https://images.unsplash.com/photo-1760633331239-fd32e3244ab5?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 3,
      titulo: "🌱 Sustrato aireado",
      texto:
        "Usá tierra liviana y con buen drenaje. Una mezcla con perlita o corteza es ideal.",
      detalle:
        "El sustrato correcto permite que el agua circule sin encharcar las raíces.",
      imagen:
        "https://images.unsplash.com/photo-1693414854278-6b3703411629?auto=format&fit=crop&w=800&q=80",
    },
    {
      id: 4,
      titulo: "🌸 Cuidados generales",
      texto:
        "Retirá hojas secas y limpialas con un paño húmedo para que respiren mejor.",
      detalle: "Pequeños cuidados hacen una gran diferencia a largo plazo.",
      imagen:
        "https://plus.unsplash.com/premium_photo-1677756271467-e4394aeb315c?auto=format&fit=crop&w=800&q=80",
    },
  ];

  return (
    <section className="tips-section">
      <h2 className="tips-title">Consejos para tus plantas 🌿</h2>
      <p className="tips-subtitle">
        Cuidar tus plantas no tiene por qué ser complicado. Con estos simples
        consejos, tus espacios verdes van a florecer.
      </p>

      <div className="tips-grid">
        {tips.map((tip) => (
          <div key={tip.id} className="tip-card">
            <div
              className="tip-img"
              style={{ backgroundImage: `url(${tip.imagen})` }}
            >
              <div className="tip-overlay"></div>
              <div className="tip-content">
                <h3>{tip.titulo}</h3>
                <p>{tip.texto}</p>
                <span className="tip-detail">{tip.detalle}</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
};

export default MainTips;
