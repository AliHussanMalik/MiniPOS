// Sale repository
// Responsible for sale data access and database communication.

const pool = require("../../config/db");
const { buildUpdateQuery } = require("../../utils/repository.helpers");

const saleReturning = `
  id,
  customer_id AS "customerId",
  user_id AS "userId",
  subtotal,
  discount,
  tax,
  total_amount AS "totalAmount",
  payment_method AS "paymentMethod",
  status,
  created_at AS "createdAt",
  updated_at AS "updatedAt"
`;

const saleItemReturning = `
  id,
  sale_id AS "saleId",
  product_id AS "productId",
  quantity,
  unit_price AS "unitPrice",
  subtotal,
  created_at AS "createdAt"
`;

const attachItems = async (sale) => {
  if (!sale) return undefined;

  const items = await pool.query(
    `
      SELECT ${saleItemReturning}
      FROM sale_items
      WHERE sale_id = $1
      ORDER BY id;
    `,
    [sale.id]
  );

  return {
    ...sale,
    items: items.rows,
  };
};

const insertSaleItems = async (client, saleId, items) => {
  const savedItems = [];

  for (const item of items) {
    const result = await client.query(
      `
        INSERT INTO sale_items (sale_id, product_id, quantity, unit_price, subtotal)
        VALUES ($1, $2, $3, $4, $5)
        RETURNING ${saleItemReturning};
      `,
      [saleId, item.productId, item.quantity, item.unitPrice, item.subtotal]
    );

    savedItems.push(result.rows[0]);
  }

  return savedItems;
};

const createSale = async ({
  customerId = null,
  userId,
  subtotal,
  discount = 0,
  tax = 0,
  totalAmount,
  paymentMethod,
  status = "COMPLETED",
  items,
}) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const saleResult = await client.query(
      `
        INSERT INTO sales (
          customer_id,
          user_id,
          subtotal,
          discount,
          tax,
          total_amount,
          payment_method,
          status
        )
        VALUES ($1, $2, $3, $4, $5, $6, $7, $8)
        RETURNING ${saleReturning};
      `,
      [customerId, userId, subtotal, discount, tax, totalAmount, paymentMethod, status]
    );

    const sale = saleResult.rows[0];
    const savedItems = await insertSaleItems(client, sale.id, items);

    await client.query("COMMIT");

    return {
      ...sale,
      items: savedItems,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const findAllSales = async () => {
  const result = await pool.query(`
    SELECT ${saleReturning}
    FROM sales
    ORDER BY id;
  `);

  return result.rows;
};

const findSalesByUserId = async (userId) => {
  const result = await pool.query(
    `
      SELECT ${saleReturning}
      FROM sales
      WHERE user_id = $1
      ORDER BY id;
    `,
    [userId]
  );

  return result.rows;
};

const findSaleById = async (id) => {
  const result = await pool.query(
    `
      SELECT ${saleReturning}
      FROM sales
      WHERE id = $1;
    `,
    [id]
  );

  return attachItems(result.rows[0]);
};

const updateSale = async (id, data) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    let sale;
    const query = buildUpdateQuery({
      table: "sales",
      id,
      data,
      columns: {
        customerId: "customer_id",
        userId: "user_id",
        subtotal: "subtotal",
        discount: "discount",
        tax: "tax",
        totalAmount: "total_amount",
        paymentMethod: "payment_method",
        status: "status",
      },
      returning: saleReturning,
    });

    if (query) {
      const saleResult = await client.query(query.text, query.values);
      sale = saleResult.rows[0];
    } else {
      const saleResult = await client.query(
        `
          SELECT ${saleReturning}
          FROM sales
          WHERE id = $1;
        `,
        [id]
      );
      sale = saleResult.rows[0];
    }

    if (!sale) {
      await client.query("COMMIT");
      return undefined;
    }

    let items;
    if (data.items) {
      await client.query("DELETE FROM sale_items WHERE sale_id = $1;", [id]);
      items = await insertSaleItems(client, id, data.items);
    } else {
      const itemResult = await client.query(
        `
          SELECT ${saleItemReturning}
          FROM sale_items
          WHERE sale_id = $1
          ORDER BY id;
        `,
        [id]
      );
      items = itemResult.rows;
    }

    await client.query("COMMIT");

    return {
      ...sale,
      items,
    };
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

const deleteSale = async (id) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");
    await client.query("DELETE FROM sale_items WHERE sale_id = $1;", [id]);

    const result = await client.query(
      `
        DELETE FROM sales
        WHERE id = $1
        RETURNING ${saleReturning};
      `,
      [id]
    );

    await client.query("COMMIT");

    return result.rows[0];
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

module.exports = {
  createSale,
  findAllSales,
  findSalesByUserId,
  findSaleById,
  updateSale,
  deleteSale,
};
