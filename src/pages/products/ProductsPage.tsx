import { useState } from "react";
import { ProductList } from "../../components/Products/List/ProductList";
import { LoadMoreButton } from "../../components/Products/LoadMoreButton";
import { SearchBar } from "../../components/Products/SearchBar";
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
    <main className="product-page">
      <div className="product-page__content">
        <section className="product-controls">
          <div className="product-controls__filters">
            <Button
              className="button-filter"
              onClick={() => {
                setSearchTerm("");
                void loadFirstPage();
              }}
            >
              Todos
            </Button>

            <Button
              className="button-filter"
              onClick={() => {
                setSearchTerm("");
                void loadFirstPage({ genderFilter: "female" });
              }}
            >
              Femenino
            </Button>

            <Button
              className="button-filter"
              onClick={() => {
                setSearchTerm("");
                void loadFirstPage({ genderFilter: "male" });
              }}
            >
              Masculino
            </Button>

            <Button
              className="button-filter"
              onClick={() => {
                setSearchTerm("");
                void loadFirstPage({ genderFilter: "unisex" });
              }}
            >
              Unisex
            </Button>
          </div>

          <details className="brands-dropdown">
            <summary>
              <span className="brands-title">Marcas</span>
            </summary>

            <div className="brands-options">
              <Button
                className="button-filter"
                onClick={() => {
                  setSearchTerm("");
                  void loadFirstPage({ brandFilter: "Dior" });
                }}
              >
                Dior
              </Button>

              <Button
                className="button-filter"
                onClick={() => {
                  setSearchTerm("");
                  void loadFirstPage({ brandFilter: "Giorgio Armani" });
                }}
              >
                Giorgio Armani
              </Button>

              <Button
                className="button-filter"
                onClick={() => {
                  setSearchTerm("");
                  void loadFirstPage({ brandFilter: "Chanel" });
                }}
              >
                Chanel
              </Button>

              <Button
                className="button-filter"
                onClick={() => {
                  setSearchTerm("");
                  void loadFirstPage({ brandFilter: "Yves Saint Laurent" });
                }}
              >
                Yves Saint Laurent
              </Button>

              <Button
                className="button-filter"
                onClick={() => {
                  setSearchTerm("");
                  void loadFirstPage({ brandFilter: "Tom Ford" });
                }}
              >
                Tom Ford
              </Button>

              <Button
                className="button-filter"
                onClick={() => {
                  setSearchTerm("");
                  void loadFirstPage({ brandFilter: "Creed" });
                }}
              >
                Creed
              </Button>

              <Button
                className="button-filter"
                onClick={() => {
                  setSearchTerm("");
                  void loadFirstPage({
                    brandFilter: "Maison Francis Kurkdjian",
                  });
                }}
              >
                Maison Francis Kurkdjian
              </Button>
            </div>
          </details>

          <SearchBar
            value={searchTerm}
            onSearch={handleSearch}
            onReset={() => {
              setSearchTerm("");
              void loadFirstPage();
            }}
          />
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

        {!loading && (
          <LoadMoreButton
            hasMore={hasMore}
            loadingMore={loadingMore}
            onLoadMore={loadMore}
          />
        )}
      </div>
    </main>
  );
}
