import Carrusel from '../../components/home/Carrusel'
import MainHome from '../../components/home/MainHome';
import ProductosDestacados from '../../components/productos/ProductosDestacados';
import Visitanos from '../../components/layout/Visitanos';
import "../../styles/pages/home.css"


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