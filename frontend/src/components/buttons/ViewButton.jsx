import Button from 'react-bootstrap/Button';
import { FaEye } from 'react-icons/fa';
import { useProductosStore } from '../../store/useProductosStore';

const ViewButton = ({ producto, onOpenModal }) => {
    const { setProductoSeleccionado } = useProductosStore();

    const handleView = () => {
        setProductoSeleccionado(producto);
        onOpenModal("ver");
    };

    return (
        <Button variant="outline-primary" onClick={handleView}>
            <FaEye />
        </Button>
    );
};

export default ViewButton;
