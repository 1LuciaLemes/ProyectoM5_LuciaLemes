import { useState } from "react";
import { ProductList } from "../../components/Products/List/ProductList";
import { LoadingState } from "../../components/State/Loading.State";
import { ErrorState } from "../../components/State/Error.State";
import { EmptyState } from "../../components/State/Empty.State";
import { Button } from "../../UI/Button";
import { useProducts } from "../../contexts/Products/useProducts";
import "./ProductsPage.css";

export function ProductPage() {
  const {
    products,
    loading,
    loadingMore,
    error,
    hasMore,
    loadFirstPage,
    loadMore,
  } = useProducts();

  const [searchTerm, setSearchTerm] = useState("");

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
    <main>
      <h1>ƒragranza</h1>

      <section className="product-controls">
        <div className="product-controls__search">
          <label htmlFor="product-search">Buscar</label>
          <input
            id="product-search"
            value={searchTerm}
            onChange={(event) => void handleSearch(event.target.value)}
            placeholder="Escribe 3 letras para buscar..."
          />
        </div>

        <div className="product-controls__filters">
          <Button
            onClick={() => {
              setSearchTerm("");
              void loadFirstPage();
            }}
          >
            Todos
          </Button>
          <Button
            onClick={() => {
              setSearchTerm("");
              void loadFirstPage({ genderFilter: "female" });
            }}
          >
            Femenino
          </Button>
          <Button
            onClick={() => {
              setSearchTerm("");
              void loadFirstPage({ genderFilter: "male" });
            }}
          >
            Masculino
          </Button>
          <Button
            onClick={() => {
              setSearchTerm("");
              void loadFirstPage({ genderFilter: "unisex" });
            }}
          >
            Unisex
          </Button>
        </div>

        <div className="product-controls__filters">
          <Button
            onClick={() => {
              setSearchTerm("");
              void loadFirstPage({ brandFilter: "Dior" });
            }}
          >
            Dior
          </Button>
          <Button
            onClick={() => {
              setSearchTerm("");
              void loadFirstPage({ brandFilter: "Giorgio Armani" });
            }}
          >
            Giorgio Armani
          </Button>
          <Button
            onClick={() => {
              setSearchTerm("");
              void loadFirstPage({ brandFilter: "Chanel" });
            }}
          >
            Chanel
          </Button>
          <Button
            onClick={() => {
              setSearchTerm("");
              void loadFirstPage({ brandFilter: "Yves Saint Laurent" });
            }}
          >
            Yves Saint Laurent
          </Button>
          <Button
            onClick={() => {
              setSearchTerm("");
              void loadFirstPage({ brandFilter: "Tom Ford" });
            }}
          >
            Tom Ford
          </Button>
          <Button
            onClick={() => {
              setSearchTerm("");
              void loadFirstPage({ brandFilter: "Creed" });
            }}
          >
            Creed
          </Button>
          <Button
            onClick={() => {
              setSearchTerm("");
              void loadFirstPage({ brandFilter: "Maison Francis Kurkdjian" });
            }}
          >
            Maison Francis Kurkdjian
          </Button>
        </div>
      </section>

      <ErrorState
        id="products"
        error={error}
        fallback={<p>No se pudieron cargar los productos.</p>}
      >
        <LoadingState
          id="products"
          loading={loading}
          fallback={<p>Cargando productos...</p>}
        >
          <EmptyState id="products" isEmpty={products.length === 0}>
            <ProductList />
          </EmptyState>
        </LoadingState>
      </ErrorState>

      {hasMore && !loading && (
        <div className="load-more-container">
          <Button onClick={() => void loadMore()} disabled={loadingMore}>
            {loadingMore ? "Cargando más..." : "Cargar más"}
          </Button>
        </div>
      )}
    </main>
  );
}
