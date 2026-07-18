import { useState } from "react";
import { Link } from "react-router-dom";
import { LoadMoreButton } from "../../components/Products/LoadMoreButton";
import { SearchBar } from "../../components/Products/SearchBar";
import { useProducts } from "../../contexts/Products/useProducts";
import { deleteProduct } from "../../services/products/productsService";
import "./admin.css";

export const AdminProductsPage = () => {
  const { products, loading, error, setProducts, loadFirstPage, loadMore, hasMore, loadingMore } = useProducts();
  const [searchTerm, setSearchTerm] = useState("");

  const handleDelete = async (id: string) => {
    const shouldDelete = window.confirm("¿Seguro que querés eliminar este producto? Esta acción no se puede deshacer.");
    if (!shouldDelete) {
      return;
    }

    try {
      await deleteProduct(id);
      setProducts((previousProducts) =>
        previousProducts.filter((product) => product.id !== id),
      );
    } catch {
      window.alert("No se pudo eliminar el producto. Intentá nuevamente.");
    }
  };

  const handleSearch = async (value: string) => {
    setSearchTerm(value);

    const trimmedValue = value.trim();

    if (trimmedValue.length === 0) {
      await loadFirstPage();
      return;
    }

    if (trimmedValue.length >= 2) {
      await loadFirstPage({ searchTerm: trimmedValue });
    }
  };

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">Productos</h1>
        </div>
        <div className="admin-page-actions">
          <Link to="/admin/products/form" className="admin-btn admin-btn-primary">
            Crear producto
          </Link>
        </div>
      </header>

      <section className="admin-search-panel">
        <SearchBar
          value={searchTerm}
          onSearch={handleSearch}
          onReset={() => {
            setSearchTerm("");
            void loadFirstPage();
          }}
          placeholder="Escribe 3 letras para buscar..."
          className="admin-search-input"
        />
      </section>

      {loading && <p className="admin-state-message">Cargando productos...</p>}
      {error && <p className="admin-state-message">Hubo un error al cargar productos.</p>}

      {!loading && !error && (
        <>
          <section className="admin-card admin-list" aria-label="Lista de productos">
            {products.map((product) => (
              <article key={product.id} className="admin-list-item">
              <div className="admin-list-item-visual">
                <img src={product.image} alt={product.title} className="admin-list-item-image" />
              </div>
              <div className="admin-list-item-info">
                <h2 className="admin-list-item-title">{product.title}</h2>
                <p className="admin-list-item-meta">
                  {product.brand} • {product.gender} • Stock {product.stock}
                </p>
              </div>
              <div className="admin-list-actions">
                <Link to={`/admin/products/form/${product.id}`} className="admin-btn admin-btn-secondary">
                  Editar
                </Link>
                <button type="button" onClick={() => handleDelete(product.id)} className="admin-btn danger">
                  Eliminar
                </button>
              </div>
            </article>
            ))}
          </section>
          <LoadMoreButton
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={loadMore}
          />
        </>
      )}
    </main>
  );
};
