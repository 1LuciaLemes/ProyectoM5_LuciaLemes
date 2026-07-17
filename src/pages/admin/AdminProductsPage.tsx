import { useProducts } from "../../contexts/Products/useProducts";
import { ProductTable } from "../../components/Products/Table/ProductTable";
import "./AdminProductsPage.css";

export const AdminProductsPage = () => {
  const { products, loading, error } = useProducts();

  const handleEdit = (id: string) => {
    console.log("Editar producto:", id);
  };

  const handleDelete = (id: string) => {
    console.log("Eliminar producto:", id);
  };

  return (
    <main className="admin-products-page">

      <header>
        <h1>Productos del admin</h1>
        <p>
          Desde aquí puedes gestionar los productos disponibles.
        </p>
      </header>


      {loading && <p>Cargando productos...</p>}

      {error && (
        <p>
          Hubo un error al cargar productos.
        </p>
      )}


      {!loading && !error && (
        <section className="admin-product-list">

          <ProductTable
            products={products}
            onEdit={handleEdit}
            onDelete={handleDelete}
          />

        </section>
      )}

    </main>
  );
};
