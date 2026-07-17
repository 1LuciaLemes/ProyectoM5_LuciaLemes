import type { Product } from "../../contexts/Products/product.type";
import "./Table/ProductTable.css"


type ProductTableProps = {
  products: Product[];
  onEdit: (id: string) => void;
  onDelete: (id: string) => void;
};


export function ProductTable({
  products,
  onEdit,
  onDelete,
}: ProductTableProps) {

  return (
    <div className="product-table">

      {products.map((product) => (

        <article
          key={product.id}
          className="product-table-row"
        >

          <img
            className="product-table-image"
            src={product.image}
            alt={product.title}
          />


          <div className="product-table-info">

            <h2>
              {product.title}
            </h2>

            <p>
              {product.description}
            </p>

          </div>


          <div className="product-table-price">

            <span>
              Precio
            </span>

            <strong>
              US${product.price}
            </strong>

          </div>


          <div className="product-table-stock">

            <span>
              Stock
            </span>

            <strong>
              {product.stock}
            </strong>

          </div>


          <div className="product-table-actions">

            <button
              className="product-table-edit"
              onClick={() => onEdit(product.id)}
            >
              Editar
            </button>


            <button
              className="product-table-delete"
              onClick={() => onDelete(product.id)}
            >
              Eliminar
            </button>

          </div>


        </article>

      ))}

    </div>
  );
}
