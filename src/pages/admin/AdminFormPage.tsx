import { useState, type ChangeEvent, type FormEvent } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import type {
  Product,
  ProductBrand,
  ProductGender,
} from "../../contexts/Products/product.type";
import { useProducts } from "../../contexts/Products/useProducts";
import {
  addProduct,
  updateProduct,
} from "../../services/products/productsService";
import "./admin.css";
import { uploadImage } from "../../services/imgPresign/img.service";

type ProductFormFields = {
  title: string;
  brand: ProductBrand | "";
  description: string;
  price: string;
  stock: string;
  gender: ProductGender | "";
  image: string;
};

type ProductFormErrors = Partial<Record<keyof ProductFormFields, string>>;
type ProductFormStatus = "editing" | "submitting" | "success" | "error";

const createInitialFields = (): ProductFormFields => ({
  title: "",
  brand: "",
  description: "",
  price: "",
  stock: "",
  gender: "",
  image: "",
});

const availableBrands: ProductBrand[] = [
  "Dior",
  "Giorgio Armani",
  "Chanel",
  "Yves Saint Laurent",
  "Tom Ford",
  "Creed",
  "Maison Francis Kurkdjian",
];

const toFormFields = (product?: Product | null): ProductFormFields => ({
  title: product?.title ?? "",
  brand: product?.brand ?? "",
  description: product?.description ?? "",
  price: product?.price?.toString() ?? "",
  stock: product?.stock?.toString() ?? "",
  gender: product?.gender ?? "",
  image: product?.image ?? "",
});

const validateField = (field: keyof ProductFormFields, value: string) => {
  switch (field) {
    case "title":
      return value.trim()
        ? undefined
        : "El nombre del producto es obligatorio.";
    case "brand":
      return value ? undefined : "Seleccioná una marca.";
    case "description":
      return value.trim() ? undefined : "La descripción es obligatoria.";
    case "price": {
      const parsedPrice = Number(value);
      if (!value.trim()) {
        return "El precio es obligatorio.";
      }
      return Number.isFinite(parsedPrice) && parsedPrice > 0
        ? undefined
        : "El precio debe ser mayor a 0.";
    }
    case "stock": {
      const parsedStock = Number(value);
      if (!value.trim()) {
        return "El stock es obligatorio.";
      }
      return Number.isFinite(parsedStock) && parsedStock >= 0
        ? undefined
        : "El stock no puede ser negativo.";
    }
    case "gender":
      return value ? undefined : "Seleccioná un género.";
    case "image":
      return undefined;
    default:
      return undefined;
  }
};

const validateForm = (fields: ProductFormFields): ProductFormErrors => {
  const nextErrors: ProductFormErrors = {};

  (Object.keys(fields) as Array<keyof ProductFormFields>).forEach((field) => {
    const error = validateField(field, fields[field]);
    if (error) {
      nextErrors[field] = error;
    }
  });

  return nextErrors;
};

export const AdminFormPage = () => {
  const { productId } = useParams();
  const navigate = useNavigate();
  const { products, setProducts } = useProducts();
  const initialProduct = productId
    ? products.find((currentProduct) => currentProduct.id === productId)
    : null;
  const [formFields, setFormFields] = useState<ProductFormFields>(() =>
    toFormFields(initialProduct),
  );
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null);
  const [formErrors, setFormErrors] = useState<ProductFormErrors>({});
  const [formStatus, setFormStatus] = useState<ProductFormStatus>("editing");
  const [globalError, setGlobalError] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [selectedProductId, setSelectedProductId] = useState<string | null>(
    productId ?? null,
  );
  const [touchedFields, setTouchedFields] = useState<
    Partial<Record<keyof ProductFormFields, boolean>>
  >({});

  const resetForm = () => {
    setFormFields(createInitialFields());
    setFormErrors({});
    setTouchedFields({});
    setGlobalError(null);
    setSuccessMessage(null);
    setFormStatus("editing");
    setSelectedProductId(null);
    navigate("/admin/products/form");
    setSelectedImageFile(null);
  };

  const handleFieldChange = (field: keyof ProductFormFields, value: string) => {
    setFormFields((previousFields) => ({ ...previousFields, [field]: value }));
    setGlobalError(null);
    setSuccessMessage(null);

    if (formStatus === "success") {
      setFormStatus("editing");
    }

    if (touchedFields[field] || formErrors[field]) {
      const fieldError = validateField(field, value);
      setFormErrors((previousErrors) => {
        const nextErrors = { ...previousErrors };
        if (fieldError) {
          nextErrors[field] = fieldError;
        } else {
          delete nextErrors[field];
        }
        return nextErrors;
      });
    }
  };

  const handleFieldBlur = (field: keyof ProductFormFields) => {
    setTouchedFields((previousTouched) => ({
      ...previousTouched,
      [field]: true,
    }));
    const fieldError = validateField(field, formFields[field]);
    setFormErrors((previousErrors) => {
      const nextErrors = { ...previousErrors };
      if (fieldError) {
        nextErrors[field] = fieldError;
      } else {
        delete nextErrors[field];
      }
      return nextErrors;
    });
  };

  const handleSubmit = async (event: FormEvent<HTMLFormElement>) => {
      console.log("entre al handlesubmit");
    event.preventDefault();

    const allTouched = Object.keys(formFields).reduce(
      (accumulator, field) => ({ ...accumulator, [field]: true }),
      {},
    ) as Partial<Record<keyof ProductFormFields, boolean>>;

    setTouchedFields(allTouched);
    const nextErrors = validateForm(formFields);
    setFormErrors(nextErrors);

    if (Object.keys(nextErrors).length > 0) {
      console.log("Errores del formulario:", nextErrors);
      setFormStatus("error");
      setGlobalError(null);
      return;
    }

    setFormStatus("submitting");
    setGlobalError(null);

    try {
      console.log("entre al try del handlesubmit");
      let imageUrl = formFields.image.trim();

      if (selectedImageFile) {
        imageUrl = await uploadImage(selectedImageFile);
      }

      const productPayload = {
        title: formFields.title.trim(),
        brand: formFields.brand as ProductBrand,
        description: formFields.description.trim(),
        price: Number(formFields.price),
        stock: Number(formFields.stock),
        gender: formFields.gender as ProductGender,
        image: imageUrl || "https://placehold.co/300x300?text=Sin+imagen",
      };

      if (selectedProductId) {
        const updatedProduct = await updateProduct(
          selectedProductId,
          productPayload,
        );
        setProducts((previousProducts) =>
          previousProducts.map((product) =>
            product.id === selectedProductId ? updatedProduct : product,
          ),
        );
        setSuccessMessage("Producto actualizado con éxito.");
      } else {
        const createdProduct = await addProduct(productPayload);
        setProducts((previousProducts) => [
          createdProduct,
          ...previousProducts,
        ]);
        setSuccessMessage("Producto creado con éxito.");
      }

      setFormErrors({});
      setFormStatus("success");
      setGlobalError(null);
      setFormFields(createInitialFields());
      setSelectedProductId(null);
      navigate("/admin/products");
    } catch {
      setFormStatus("error");
      setGlobalError(
        selectedProductId
          ? "No se pudo actualizar el producto. Intentá nuevamente."
          : "No se pudo crear el producto. Intentá nuevamente.",
      );
    }
  };

  return (
    <main className="admin-page">
      <header className="admin-page-header">
        <div>
          <h1 className="admin-page-title">
            {selectedProductId ? "Editar producto" : "Crear producto"}
          </h1>
        </div>
        <div className="admin-page-actions">
          <Link to="/admin/products" className="admin-btn admin-btn-primary">
            Volver a productos
          </Link>
          <button
            type="button"
            onClick={resetForm}
            className="admin-btn admin-btn-primary"
          >
            Limpiar
          </button>
        </div>
      </header>

      {successMessage && (
        <p className="form-success-banner">{successMessage}</p>
      )}
      {globalError && <p className="form-global-error">{globalError}</p>}

      <section
        className="admin-card admin-form-card"
        aria-labelledby="product-form-title"
      >
        <form className="product-form" onSubmit={handleSubmit} noValidate>
          <div className="form-grid">
            <label className="form-field">
              <span>Nombre</span>
              <input
                type="text"
                value={formFields.title}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleFieldChange("title", event.target.value)
                }
                onBlur={() => handleFieldBlur("title")}
                disabled={formStatus === "submitting"}
                placeholder="Ej. Dolce & Gabbana"
              />
              {formErrors.title && (
                <small className="form-field-error">{formErrors.title}</small>
              )}
            </label>

            <label className="form-field">
              <span>Imagen</span>

              <input
                type="file"
                accept="image/jpeg,image/png,image/webp"
                onChange={(event: ChangeEvent<HTMLInputElement>) => {
                  const file = event.target.files?.[0] ?? null;
                  setSelectedImageFile(file);
                }}
                disabled={formStatus === "submitting"}
              />

              <small className="form-hint">
                Si editás un producto y no elegís una imagen nueva, se conserva
                la anterior.
              </small>
            </label>

            <label className="form-field">
              <span>Precio</span>
              <input
                type="number"
                min="0"
                step="0.01"
                value={formFields.price}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleFieldChange("price", event.target.value)
                }
                onBlur={() => handleFieldBlur("price")}
                disabled={formStatus === "submitting"}
                placeholder="120"
              />
              {formErrors.price && (
                <small className="form-field-error">{formErrors.price}</small>
              )}
            </label>

            <label className="form-field">
              <span>Stock</span>
              <input
                type="number"
                min="0"
                step="1"
                value={formFields.stock}
                onChange={(event: ChangeEvent<HTMLInputElement>) =>
                  handleFieldChange("stock", event.target.value)
                }
                onBlur={() => handleFieldBlur("stock")}
                disabled={formStatus === "submitting"}
                placeholder="15"
              />
              {formErrors.stock && (
                <small className="form-field-error">{formErrors.stock}</small>
              )}
            </label>

            <label className="form-field">
              <span>Marca</span>
              <select
                value={formFields.brand}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  handleFieldChange("brand", event.target.value)
                }
                onBlur={() => handleFieldBlur("brand")}
                disabled={formStatus === "submitting"}
              >
                <option value="">Seleccioná una marca</option>
                {availableBrands.map((brand) => (
                  <option key={brand} value={brand}>
                    {brand}
                  </option>
                ))}
              </select>
              {formErrors.brand && (
                <small className="form-field-error">{formErrors.brand}</small>
              )}
            </label>

            <label className="form-field">
              <span>Género</span>
              <select
                value={formFields.gender}
                onChange={(event: ChangeEvent<HTMLSelectElement>) =>
                  handleFieldChange("gender", event.target.value)
                }
                onBlur={() => handleFieldBlur("gender")}
                disabled={formStatus === "submitting"}
              >
                <option value="">Seleccioná un género</option>
                <option value="female">Femenino</option>
                <option value="male">Masculino</option>
                <option value="unisex">Unisex</option>
              </select>
              {formErrors.gender && (
                <small className="form-field-error">{formErrors.gender}</small>
              )}
            </label>
          </div>

          <label className="form-field">
            <span>Descripción</span>
            <textarea
              rows={4}
              value={formFields.description}
              onChange={(event: ChangeEvent<HTMLTextAreaElement>) =>
                handleFieldChange("description", event.target.value)
              }
              onBlur={() => handleFieldBlur("description")}
              disabled={formStatus === "submitting"}
              placeholder="Describí el producto para el catálogo"
            />
            {formErrors.description && (
              <small className="form-field-error">
                {formErrors.description}
              </small>
            )}
          </label>

          {(selectedImageFile || formFields.image) && (
            <div className="image-preview">
              <img
                src={
                  selectedImageFile
                    ? URL.createObjectURL(selectedImageFile)
                    : formFields.image
                }
                alt="Preview del producto"
              />
            </div>
          )}

          <div className="form-actions">
            <button
              type="submit"
              disabled={formStatus === "submitting"}
              className="admin-btn admin-btn-primary"
            >
              {formStatus === "submitting"
                ? "Guardando..."
                : selectedProductId
                  ? "Guardar cambios"
                  : "Crear producto"}
            </button>
          </div>
        </form>
      </section>
    </main>
  );
};
