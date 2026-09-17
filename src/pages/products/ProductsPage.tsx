import { useEffect, useState } from "react";
import { ProductList } from "../../components/Products/List/ProductList";
import { LoadMoreButton } from "../../components/Products/LoadMoreButton";
import { SearchBar } from "../../components/Products/SearchBar";
import { LoadingState } from "../../components/State/Loading.State";
import { ErrorState } from "../../components/State/Error.State";
import { EmptyState } from "../../components/State/Empty.State";
import { ProductGridSkeleton } from "../../components/State/Skeleton";
import { Button } from "../../UI/Button";
import { useProducts } from "../../contexts/Products/useProducts";
import { useDebounce } from "../../hooks/useDebounce";
import type { ProductBrand, ProductGender } from "../../contexts/Products/product.type";
import "./ProductsPage.css";

type ProductPageProps = {
  initialGender?: ProductGender;
};

export function ProductPage({ initialGender }: ProductPageProps) {
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
  const [gender, setGender] = useState<ProductGender | undefined>(initialGender);
  const debouncedSearch = useDebounce(searchTerm, 300);

  useEffect(() => {
    const trimmedValue = debouncedSearch.trim();

    const params = {
      ...(gender ? { genderFilter: gender } : {}),
      ...(trimmedValue.length >= 2 ? { searchTerm: trimmedValue } : {}),
    };

    void loadFirstPage(params);
  }, [debouncedSearch, gender, loadFirstPage]);

  const handleSearch = (value: string) => {
    setSearchTerm(value);
  };

  const handleSelectBrand = (brandFilter: ProductBrand) => {
    setSearchTerm("");
    void loadFirstPage({
      ...(gender ? { genderFilter: gender } : {}),
      brandFilter,
    });
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
                setGender(undefined);
              }}
            >
              Todos
            </Button>

            <Button
              className={`button-filter${gender === "female" ? " is-active" : ""}`}
              onClick={() => {
                setSearchTerm("");
                setGender("female");
              }}
            >
              Mujer
            </Button>

            <Button
              className={`button-filter${gender === "male" ? " is-active" : ""}`}
              onClick={() => {
                setSearchTerm("");
                setGender("male");
              }}
            >
              Hombre
            </Button>

            <Button
              className={`button-filter${gender === "unisex" ? " is-active" : ""}`}
              onClick={() => {
                setSearchTerm("");
                setGender("unisex");
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
                onClick={() => handleSelectBrand("Dior")}
              >
                Dior
              </Button>

              <Button
                className="button-filter"
                onClick={() => handleSelectBrand("Giorgio Armani")}
              >
                Giorgio Armani
              </Button>

              <Button
                className="button-filter"
                onClick={() => handleSelectBrand("Chanel")}
              >
                Chanel
              </Button>

              <Button
                className="button-filter"
                onClick={() => handleSelectBrand("Yves Saint Laurent")}
              >
                Yves Saint Laurent
              </Button>

              <Button
                className="button-filter"
                onClick={() => handleSelectBrand("Tom Ford")}
              >
                Tom Ford
              </Button>

              <Button
                className="button-filter"
                onClick={() => handleSelectBrand("Creed")}
              >
                Creed
              </Button>

              <Button
                className="button-filter"
                onClick={() => handleSelectBrand("Maison Francis Kurkdjian")}
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
            fallback={<ProductGridSkeleton count={6} />}
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
