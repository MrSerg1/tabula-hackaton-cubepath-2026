import products from '../assets/menuProducts.json';

export const toSlug = (text) =>
  text
    .toLowerCase()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');

export const slugToProduct = new Map(products.map((p) => [toSlug(p.title), p]));
