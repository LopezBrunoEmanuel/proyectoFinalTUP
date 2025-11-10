import Carrusel from '../components/ui/Carrusel'
import MainHome from '../components/ui/MainHome';
import ProductosDestacados from '../components/ui/ProductosDestacados';
import Visitanos from '../components/ui/Visitanos';
import "../styles/home.css"


const Home = () => {
    return (
        <div className="home-container">
            <section className="home-section">
                <Carrusel />
            </section>

            <section className="home-section">
                <MainHome />
            </section>

            <section className="home-section">
                <ProductosDestacados />
            </section>

            <section className="home-section">
                <Visitanos />
            </section>
        </div>
    )
}

export default Home