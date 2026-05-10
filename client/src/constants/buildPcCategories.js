import {
  Box,
  CircuitBoard,
  Cpu,
  HardDrive,
  MemoryStick,
  PlugZap,
} from 'lucide-react';

export const BUILD_PC_CATEGORIES = [
  { id: 'processors', categoryKey: 'processors', label: 'PROCESADORES', icon: Cpu },
  { id: 'graphics-cards', categoryKey: 'graphics-cards', label: 'PLACAS DE VIDEO', icon: CircuitBoard },
  { id: 'ram', categoryKey: 'ram', label: 'MEMORIA RAM', icon: MemoryStick },
  { id: 'storage', categoryKey: 'storage', label: 'ALMACENAMIENTO', icon: HardDrive },
  { id: 'power-supplies', categoryKey: 'power-supplies', label: 'FUENTES', icon: PlugZap },
  { id: 'cases', categoryKey: 'cases', label: 'GABINETES', icon: Box },
];

export const normalizeBuildText = (value = '') =>
  String(value)
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase()
    .trim();

const CATEGORY_VARIANTS = {
  processors: ['procesador', 'procesadores', 'cpu', 'processor', 'processors'],
  'graphics-cards': ['placa de video', 'placas de video', 'gpu', 'tarjeta grafica', 'tarjetas graficas', 'graphics card', 'graphics-cards'],
  ram: ['ram', 'memoria ram', 'memory'],
  storage: ['disco', 'ssd', 'hdd', 'almacenamiento', 'storage', 'nvme'],
  'power-supplies': ['fuente', 'fuentes', 'psu', 'power supply', 'power-supplies'],
  cases: ['gabinete', 'gabinetes', 'case', 'cases', 'chasis', 'chassis'],
};

const getProductCategoryValue = (product) => {
  if (typeof product?.category === 'object') {
    return product.category?.name || product.category?.title || product.category?.slug || product.category?._id || '';
  }

  return product?.category || product?.categoryId || product?.type || '';
};

export const getBuildCategoryId = (product) => {
  const normalizedCategory = normalizeBuildText(getProductCategoryValue(product));

  return (
    Object.entries(CATEGORY_VARIANTS).find(([, variants]) =>
      variants.some((variant) => normalizedCategory.includes(normalizeBuildText(variant))),
    )?.[0] || null
  );
};

export const getProductBrand = (product) => {
  const explicitBrand = product?.brand || product?.brandName || product?.manufacturer || product?.maker;

  if (explicitBrand) {
    return String(explicitBrand).trim();
  }

  return String(product?.name || product?.title || '').trim().split(/\s+/)[0] || 'Sin marca';
};
