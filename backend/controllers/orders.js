import { OrderModel } from '../models/order.js';

function parsePositiveInteger(value) {
	const parsed = Number.parseInt(value, 10);
	if (!Number.isInteger(parsed) || parsed <= 0) return null;
	return parsed;
}

function sanitizeItems(items) {
	if (!Array.isArray(items) || items.length === 0) {
		return { ok: false, error: 'El campo items es obligatorio y debe contener al menos un producto' };
	}

	const normalizedItems = [];

	for (const item of items) {
		if (!item || typeof item !== 'object') {
			return { ok: false, error: 'Cada item del pedido debe ser un objeto valido' };
		}

		if (typeof item.id !== 'string' || item.id.trim() === '') {
			return { ok: false, error: 'Cada item debe incluir un id de producto valido' };
		}

		const quantity = parsePositiveInteger(item.quantity);
		if (quantity === null) {
			return { ok: false, error: 'La cantidad de cada item debe ser un entero mayor a 0' };
		}

		const unitPrice = typeof item.price === 'number' && Number.isFinite(item.price) && item.price >= 0
			? item.price
			: 0;

		normalizedItems.push({
			id: item.id,
			title: typeof item.title === 'string' ? item.title : '',
			quantity,
			price: unitPrice,
			excludedIngredients: Array.isArray(item.excludedIngredients)
				? item.excludedIngredients.filter((value) => typeof value === 'string')
				: [],
		});
	}

	return { ok: true, value: normalizedItems };
}

function calculateTotal(items) {
	return Number(items.reduce((sum, item) => sum + item.price * item.quantity, 0).toFixed(2));
}

export class OrderController {
	static async create(req, res) {
		try {
			const mesa = parsePositiveInteger(req.body?.mesa);
			if (mesa === null) {
				return res.status(400).json({ error: 'El campo mesa es obligatorio' });
			}

			const itemsValidation = sanitizeItems(req.body?.items);
			if (!itemsValidation.ok) {
				return res.status(400).json({ error: itemsValidation.error });
			}

			const items = itemsValidation.value;
			const total = calculateTotal(items);

			const order = await OrderModel.create({
				mesa,
				items,
				total,
			});

			return res.status(201).json({ data: order });
		} catch (error) {
			return res.status(500).json({ error: 'Error al crear la orden' });
		}
	}
}