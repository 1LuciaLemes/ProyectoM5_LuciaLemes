import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import type { Product } from "../../contexts/Products/product.type";
import { ProductCard } from "../../components/Products/Card/ProductCard";
import { ProductCardSkeleton } from "../../components/State/Skeleton";
import { getProductsByTitles } from "../../services/products/productsService";
import "./HomePage.css";

const POPULAR_TITLES = ["J'adore", "Joy", "Libre"];

export function HomePage() {
  const [popular, setPopular] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    getProductsByTitles(POPULAR_TITLES)
      .then((products) => {
        if (!active) return;
        setPopular(products);
      })
      .catch(() => {
        if (!active) return;
        setPopular([]);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, []);

  return (
    <div className="home-page">
      {/* Hero */}
      <section className="home-hero">
        <div className="home-hero__grid">
          <div className="home-hero__content">
            <h1 className="home-hero__title">
              EL ARTE DEL PERFUME,
              <br />
              LA ESENCIA
              <br />
              DE LA FLOR
            </h1>
            <div className="home-hero__link-wrap">
              <Link to="/catalog" className="home-hero__link">
                Nuevos aromas aquí <ArrowRight size={14} />
              </Link>
            </div>
          </div>

          <div className="home-hero__image-wrap">
            <img
              className="home-hero__image"
              src="https://images.unsplash.com/photo-1541643600914-78b084683601?auto=format&fit=crop&w=1200&q=80"
              alt="Botella de perfume destacada"
            />
          </div>
        </div>

        <div className="home-hero__decoration" aria-hidden="true" />
      </section>

      {/* Populares */}
      <section className="home-section home-section--populars">
        <div className="home-section__header">
          <h2 className="home-section__title">POPULARES</h2>
          <Link to="/catalog" className="home-section__link">
            Ver más populares <ArrowRight size={14} />
          </Link>
        </div>

        <div className="home-product-grid">
          {loading
            ? [0, 1, 2].map((i) => <ProductCardSkeleton key={i} />)
            : popular.map((product) => (
                <ProductCard key={product.id} product={product} variant="home" />
              ))}
        </div>
      </section>

      {/* Nuestra historia */}
      <section className="home-story">
        <h2 className="home-story__title">NUESTRA HISTORIA</h2>
        <p className="home-story__text">
          Cada botella es un capítulo - una composición cuidadosamente elaborada
          de memoria, lugar y estación.
        </p>
      </section>
    </div>
  );
}
