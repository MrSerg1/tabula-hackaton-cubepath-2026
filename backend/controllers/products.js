import { ProductModel } from '../models/product.js';

const DEFAULT_LIMIT = 6;

function parsePositiveInteger(value) {
    if (value === undefined) return null;
    const parsed = Number.parseInt(value, 10);
    if (!Number.isInteger(parsed) || parsed <= 0) return null;
    return parsed;
}

function parseNonNegativeInteger(value) {
    if (value === undefined) return null;
    const parsed = Number.parseInt(value, 10);
    if (!Number.isInteger(parsed) || parsed < 0) return null;
    return parsed;
}

function validateMesa(rawMesa) {
    const mesa = parsePositiveInteger(rawMesa);
    if (mesa === null) {
        return { ok: false, error: 'El parametro mesa es obligatorio y debe ser un entero mayor a 0' };
    }
    return { ok: true, value: mesa };
}

export class ProductController {
    static async getAll(req, res) {
        try {
            const mesaValidation = validateMesa(req.query.mesa);
            if (!mesaValidation.ok) {
                return res.status(400).json({ error: mesaValidation.error });
            }

            const limit = req.query.limit === undefined
                ? DEFAULT_LIMIT
                : parsePositiveInteger(req.query.limit);
            if (limit === null) {
                return res.status(400).json({ error: 'El parametro limit debe ser un entero mayor a 0' });
            }

            const offset = req.query.offset === undefined
                ? 0
                : parseNonNegativeInteger(req.query.offset);
            if (offset === null) {
                return res.status(400).json({ error: 'El parametro offset debe ser un entero mayor o igual a 0' });
            }

            const result = await ProductModel.getAll({ limit, offset });
            res.json({ mesa: mesaValidation.value, limit, offset, total: result.total, data: result.data });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener los productos' });
        }
    }

    static async getById(req, res) {
        try {
            const mesaValidation = validateMesa(req.query.mesa);
            if (!mesaValidation.ok) {
                return res.status(400).json({ error: mesaValidation.error });
            }

            const { id } = req.params;
            const product = await ProductModel.getById(id);
            if (!product) {
                return res.status(404).json({ error: 'Producto no encontrado' });
            }
            res.json({ mesa: mesaValidation.value, data: product });
        } catch (error) {
            res.status(500).json({ error: 'Error al obtener el producto' });
        }
    }
}
