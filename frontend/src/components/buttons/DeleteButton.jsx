import Button from "react-bootstrap/Button";
import { FaRegTrashAlt } from "react-icons/fa";
import { useProductosStore } from "../../store/useProductosStore";
import { confirmDialog, toast } from "../utils/alerts";

const DeleteButton = ({ idProducto, onDeleteSuccess }) => {
    const { deleteProducto } = useProductosStore();

    const handleDelete = async () => {
        const confirmado = await confirmDialog({
            title: "Eliminar producto",
            text: "¿Seguro que desea eliminar este producto? Esta acción no se puede deshacer.",
            confirmButtonText: "Sí, eliminar",
            cancelButtonText: "Cancelar",
            icon: "warning",
        });

        if (!confirmado) return;

        try {
            await deleteProducto(idProducto);
            toast("success", "Producto eliminado correctamente");

            if (onDeleteSuccess) onDeleteSuccess();
        } catch (error) {
            console.error("Error al eliminar producto:", error);
            toast("error", "Error al eliminar producto");
        }
    };

    return (
        <Button
            variant="outline-danger"
            size="sm"
            onClick={handleDelete}
            title="Eliminar producto"
        >
            <FaRegTrashAlt />
        </Button>
    );
};

export default DeleteButton;

