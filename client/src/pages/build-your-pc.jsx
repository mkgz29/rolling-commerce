import { useEffect, useMemo, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import ProductBuildCard from '../components/ProductBuildCard';
import BuildSidebar from '../components/BuildSidebar';
import BuildHeader from '../components/BuildHeader';
import BuildSummary from '../components/BuildSummary';
import {
  BUILD_PC_CATEGORIES,
  getBuildCategoryId,
  getProductBrand,
} from '../constants/buildPcCategories';
import { useAuth } from '../hooks/useAuth';
import { useCart } from '../hooks/useCart';
import { getProductsRequest } from '../routes/productService';
import '../styles/build.css';

const BUILD_STORAGE_KEY = 'tech-core-build-components';

const normalizeProducts = (data) => {
  if (Array.isArray(data)) return data;
  if (Array.isArray(data?.products)) return data.products;
  if (Array.isArray(data?.data)) return data.data;
  if (Array.isArray(data?.items)) return data.items;
  return [];
};

const getProductId = (product) => product?._id || product?.id || '';

const STEP_COPY = {
  processors: {
    title: 'Elegí tu procesador',
    subtitle: 'Definí la base de rendimiento para gaming, creación o trabajo diario.',
  },
  'graphics-cards': {
    title: 'Elegí tu placa de video',
    subtitle: 'Seleccioná la GPU que va a mover tus juegos, renders o flujos visuales.',
  },
  ram: {
    title: 'Elegí tu memoria RAM',
    subtitle: 'Asegurá fluidez en multitarea, gaming y aplicaciones exigentes.',
  },
  storage: {
    title: 'Elegí tu almacenamiento',
    subtitle: 'Sumá velocidad y capacidad para sistema, juegos y archivos pesados.',
  },
  'power-supplies': {
    title: 'Elegí tu fuente',
    subtitle: 'Prepará energía estable para sostener el armado completo.',
  },
  cases: {
    title: 'Elegí tu gabinete',
    subtitle: 'Cerrá el equipo con el formato y flujo de aire adecuados.',
  },
};

const readStoredBuild = () => {
  try {
    const storedBuild = window.localStorage.getItem(BUILD_STORAGE_KEY);
    const parsedBuild = storedBuild ? JSON.parse(storedBuild) : {};

    return parsedBuild && typeof parsedBuild === 'object' && !Array.isArray(parsedBuild) ? parsedBuild : {};
  } catch {
    return {};
  }
};

const BuildYourPc = () => {
  const navigate = useNavigate();
  const { isAuthenticated } = useAuth();
  const { addItem } = useCart();
  const [activeCategory, setActiveCategory] = useState(BUILD_PC_CATEGORIES[0].id);
  const [selectedBrand, setSelectedBrand] = useState('');
  const [sortOrder, setSortOrder] = useState('');
  const [catalogProducts, setCatalogProducts] = useState([]);
  const [selectedComponents, setSelectedComponents] = useState(readStoredBuild);
  const [viewMode, setViewMode] = useState('builder');
  const [cartPending, setCartPending] = useState(false);
  const [buildFeedback, setBuildFeedback] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const handleSelectCategory = (categoryId) => {
    setActiveCategory(categoryId);
    setSelectedBrand('');
    setViewMode('builder');
    setBuildFeedback('');
  };

  const handleAddToBuild = (product) => {
    const categoryId = getBuildCategoryId(product);

    if (!categoryId) return;

    setSelectedComponents((currentComponents) => ({
      ...currentComponents,
      [categoryId]: product,
    }));

    setBuildFeedback('');

    const currentStepIndex = BUILD_PC_CATEGORIES.findIndex((category) => category.categoryKey === categoryId);
    const nextCategory = BUILD_PC_CATEGORIES[currentStepIndex + 1];

    if (nextCategory) {
      setActiveCategory(nextCategory.categoryKey);
      setSelectedBrand('');
      setViewMode('builder');
    } else {
      setViewMode('summary');
    }
  };

  const handleRemoveFromBuild = (categoryId) => {
    setSelectedComponents((currentComponents) => {
      const nextComponents = { ...currentComponents };
      delete nextComponents[categoryId];
      return nextComponents;
    });
    setBuildFeedback('');
  };

  const handleClearBuild = () => {
    setSelectedComponents({});
    setActiveCategory(BUILD_PC_CATEGORIES[0].categoryKey);
    setSelectedBrand('');
    setViewMode('builder');
    setBuildFeedback('');
  };

  const selectedEntries = useMemo(
    () =>
      BUILD_PC_CATEGORIES.map((category) => ({
        category,
        product: selectedComponents[category.categoryKey],
      })).filter((entry) => Boolean(entry.product)),
    [selectedComponents],
  );
  const selectedCount = selectedEntries.length;
  const missingCount = BUILD_PC_CATEGORIES.length - selectedCount;
  const totalPrice = selectedEntries.reduce((total, entry) => total + Number(entry.product?.price || 0), 0);

  const handleEditCategory = (categoryId) => {
    handleSelectCategory(categoryId);
  };

  const addBuildToCart = async (nextPath = '/cart') => {
    if (missingCount > 0) {
      setBuildFeedback('Completá todas las categorías antes de continuar.');
      return;
    }

    if (!isAuthenticated) {
      navigate('/login', { state: { from: { pathname: '/build-your-pc' } } });
      return;
    }

    try {
      setCartPending(true);
      setBuildFeedback('');

      for (const { product } of selectedEntries) {
        const productId = getProductId(product);
        if (!productId) {
          throw new Error('Hay un producto seleccionado sin ID válido.');
        }

        await addItem(productId, 1);
      }

      navigate(nextPath);
    } catch (requestError) {
      setBuildFeedback(requestError.message || 'No se pudo agregar el armado al carrito.');
    } finally {
      setCartPending(false);
    }
  };

  useEffect(() => {
    try {
      if (Object.keys(selectedComponents).length === 0) {
        window.localStorage.removeItem(BUILD_STORAGE_KEY);
        return;
      }

      window.localStorage.setItem(BUILD_STORAGE_KEY, JSON.stringify(selectedComponents));
    } catch {
      // Persistencia no crítica: si localStorage falla, el armado sigue funcionando en memoria.
    }
  }, [selectedComponents]);

  useEffect(() => {
    let active = true;

    const loadProducts = async () => {
      try {
        setLoading(true);
        setError('');
        const data = await getProductsRequest();
        if (active) {
          setCatalogProducts(normalizeProducts(data));
        }
      } catch (requestError) {
        if (active) {
          setCatalogProducts([]);
          setError(requestError.message || 'No se pudo cargar el catálogo.');
        }
      } finally {
        if (active) {
          setLoading(false);
        }
      }
    };

    queueMicrotask(() => {
      loadProducts();
    });

    return () => {
      active = false;
    };
  }, []);

  const categoryProducts = useMemo(
    () => catalogProducts.filter((product) => getBuildCategoryId(product) === activeCategory),
    [activeCategory, catalogProducts],
  );

  const brands = useMemo(
    () =>
      [...new Set(categoryProducts.map(getProductBrand).filter(Boolean))].sort((firstBrand, secondBrand) =>
        firstBrand.localeCompare(secondBrand),
      ),
    [categoryProducts],
  );

  const effectiveSelectedBrand = selectedBrand && brands.includes(selectedBrand) ? selectedBrand : '';

  const products = useMemo(() => {
    const filteredByBrand = effectiveSelectedBrand
      ? categoryProducts.filter((product) => getProductBrand(product) === effectiveSelectedBrand)
      : categoryProducts;

    return [...filteredByBrand].sort((firstProduct, secondProduct) => {
      if (!sortOrder) return 0;

      const firstPrice = Number(firstProduct?.price || 0);
      const secondPrice = Number(secondProduct?.price || 0);

      return sortOrder === 'asc' ? firstPrice - secondPrice : secondPrice - firstPrice;
    });
  }, [categoryProducts, effectiveSelectedBrand, sortOrder]);

  const activeStepIndex = BUILD_PC_CATEGORIES.findIndex((category) => category.categoryKey === activeCategory);
  const activeStepNumber = Math.max(activeStepIndex + 1, 1);
  const activeStepCopy = STEP_COPY[activeCategory] || {};
  const activeCategoryLabel = BUILD_PC_CATEGORIES.find((category) => category.categoryKey === activeCategory)?.label;
  const uncategorizedCount = useMemo(
    () => catalogProducts.filter((product) => !getBuildCategoryId(product)).length,
    [catalogProducts],
  );
  const selectedProductForActiveCategory = selectedComponents[activeCategory];
  const selectedProductIdForActiveCategory = getProductId(selectedProductForActiveCategory);
  const hasProductsForCategory = categoryProducts.length > 0;
  const emptyMessage = `No hay productos para ${activeCategoryLabel?.toLowerCase() || 'esta categoría'}.`;
  const catalogHint = uncategorizedCount > 0
    ? `${uncategorizedCount} productos del catálogo no coinciden con categorías de armado.`
    : '';

  return (
    <div className="ensambly-layout d-flex">
      <BuildSidebar
        categories={BUILD_PC_CATEGORIES}
        activeCategory={activeCategory}
        onSelectCategory={handleSelectCategory}
        selectedComponents={selectedComponents}
        onRemoveComponent={handleRemoveFromBuild}
        onClearBuild={handleClearBuild}
      />

      <main className="ensambly-content flex-grow-1 p-4">
        {viewMode === 'summary' ? (
          <BuildSummary
            categories={BUILD_PC_CATEGORIES}
            selectedComponents={selectedComponents}
            totalPrice={totalPrice}
            missingCount={missingCount}
            onEditCategory={handleEditCategory}
            onAddBuildToCart={() => addBuildToCart('/cart')}
            onContinueCheckout={() => addBuildToCart('/checkout')}
            pending={cartPending}
            feedback={buildFeedback}
          />
        ) : (
          <>
            <BuildHeader
              categories={BUILD_PC_CATEGORIES}
              activeCategory={activeCategory}
              resultCount={products.length}
              brands={brands}
              selectedBrand={effectiveSelectedBrand}
              onBrandChange={setSelectedBrand}
              sortOrder={sortOrder}
              onSortChange={setSortOrder}
              title={activeStepCopy.title}
              subtitle={activeStepCopy.subtitle}
              stepLabel={`Paso ${activeStepNumber} de ${BUILD_PC_CATEGORIES.length} - ${selectedCount} / ${BUILD_PC_CATEGORIES.length} componentes`}
            />

            <div className="build-progress mb-4" aria-label="Progreso del armado">
              {BUILD_PC_CATEGORIES.map((category, index) => {
                const isActive = category.categoryKey === activeCategory;
                const isCompleted = Boolean(selectedComponents[category.categoryKey]);

                return (
                  <button
                    key={category.categoryKey}
                    type="button"
                    className={`build-progress-step ${isActive ? 'active' : ''} ${isCompleted ? 'completed' : ''}`}
                    onClick={() => handleSelectCategory(category.categoryKey)}
                    aria-label={`Ir a ${category.label}`}
                  >
                    <span>{index + 1}</span>
                    <strong>{category.label}</strong>
                  </button>
                );
              })}
            </div>

            {loading && <p className="text-secondary">Cargando productos...</p>}
            {!loading && error && <p className="text-warning">{error}</p>}
            {!loading && !error && !hasProductsForCategory && (
              <div className="home-state-panel mb-4">
                <div className="state-copy">
                  <p className="state-eyebrow">Categoría sin productos</p>
                  <h3>{emptyMessage}</h3>
                  {catalogHint && <p>{catalogHint}</p>}
                </div>
              </div>
            )}

            {!loading && !error && hasProductsForCategory && products.length === 0 && (
              <div className="home-state-panel mb-4">
                <div className="state-copy">
                  <p className="state-eyebrow">Sin coincidencias</p>
                  <h3>No hay productos para la marca seleccionada.</h3>
                </div>
              </div>
            )}

            <div className="row g-4">
              {products.map((product, index) => (
                <ProductBuildCard
                  key={product._id || product.id || `${product.name || 'product'}-${index}`}
                  product={product}
                  isSelected={Boolean(
                    selectedProductIdForActiveCategory && getProductId(product) === selectedProductIdForActiveCategory,
                  )}
                  onAddToBuild={handleAddToBuild}
                />
              ))}
            </div>

            <div className="text-center mt-5 mb-5">
              <button className="btn btn-outline-secondary px-5 py-2" disabled>
                CARGAR MÁS PRODUCTOS
              </button>
            </div>
          </>
        )}
      </main>
    </div>
  );
};

export default BuildYourPc;
