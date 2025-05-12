import { Router } from "express";
import { wpDB } from "../config/externalDatabase";
import { FieldPacket } from "mysql2";
import { generatePagination } from "../helper/commonFunction";

const router = Router();

router.get("/bdd/d", async (req, res) => {
  try {
    const query = `
     SELECT 
    o.ID AS order_id,
    o.post_date AS order_date,
    o.post_status AS order_status,
    cm.meta_value AS customer_id,
    be.meta_value AS billing_email,
    bn.meta_value AS billing_name,
    bp.meta_value AS billing_phone,
    bs.meta_value AS billing_address,
    sn.meta_value AS shipping_name,
    sa.meta_value AS shipping_address,
    ot.meta_value AS order_total,
    pm.meta_value AS payment_method,
    tax.meta_value AS tax_amount,
    ship.meta_value AS shipping_cost,
    CONCAT('[', GROUP_CONCAT(
        JSON_OBJECT(
            'product_name', oi.order_item_name,
            'product_qty', COALESCE(qim.meta_value, 0),
            'product_price', COALESCE(qp.meta_value, 0)
        )
    ), ']') AS product_details
FROM wp_posts o
LEFT JOIN wp_postmeta cm ON o.ID = cm.post_id AND cm.meta_key = '_customer_user'
LEFT JOIN wp_postmeta be ON o.ID = be.post_id AND be.meta_key = '_billing_email'
LEFT JOIN wp_postmeta bn ON o.ID = bn.post_id AND bn.meta_key = '_billing_first_name'
LEFT JOIN wp_postmeta bp ON o.ID = bp.post_id AND bp.meta_key = '_billing_phone'
LEFT JOIN wp_postmeta bs ON o.ID = bs.post_id AND bs.meta_key = '_billing_address_1'
LEFT JOIN wp_postmeta sn ON o.ID = sn.post_id AND sn.meta_key = '_shipping_first_name'
LEFT JOIN wp_postmeta sa ON o.ID = sa.post_id AND sa.meta_key = '_shipping_address_1'
LEFT JOIN wp_postmeta ot ON o.ID = ot.post_id AND ot.meta_key = '_order_total'
LEFT JOIN wp_postmeta pm ON o.ID = pm.post_id AND pm.meta_key = '_payment_method_title'
LEFT JOIN wp_postmeta tax ON o.ID = tax.post_id AND tax.meta_key = '_order_tax'
LEFT JOIN wp_postmeta ship ON o.ID = ship.post_id AND ship.meta_key = '_order_shipping'
LEFT JOIN wp_woocommerce_order_items oi ON o.ID = oi.order_id
LEFT JOIN wp_woocommerce_order_itemmeta qim ON oi.order_item_id = qim.order_item_id AND qim.meta_key = '_qty'
LEFT JOIN wp_woocommerce_order_itemmeta qp ON oi.order_item_id = qp.order_item_id AND qp.meta_key = '_line_total'
WHERE o.post_type = 'shop_order'
GROUP BY o.ID
ORDER BY o.post_date DESC
LIMIT 1000;

    `;

    const [rows] = await wpDB.query(query);
    res.json({ success: true, data: rows });
  } catch (error) {
    console.error("Error fetching orders:", error);
    res.status(500).json({ success: false, message: "Internal Server Error" });
  }
});

router.get("/", async (req, res) => {
    try {
      const { page = 1, limit = 10, order_by = "o.post_date" } = req.query;
  
      const offset = (Number(page) - 1) * Number(limit);
  
      const query = `
      SELECT 
        o.ID AS order_id,
        o.post_date AS order_date,
        o.post_status AS order_status,
        cm.meta_value AS customer_id,
        be.meta_value AS billing_email,
        bn.meta_value AS billing_name,
        bp.meta_value AS billing_phone,
        bs.meta_value AS billing_address,
        sn.meta_value AS shipping_name,
        sa.meta_value AS shipping_address,
        ot.meta_value AS order_total,
        pm.meta_value AS payment_method,
        tax.meta_value AS tax_amount,
        ship.meta_value AS shipping_cost,
        CONCAT('[', GROUP_CONCAT(
            JSON_OBJECT(
                'product_name', oi.order_item_name,
                'product_qty', COALESCE(qim.meta_value, 0),
                'product_price', COALESCE(qp.meta_value, 0)
            )
        ), ']') AS product_details
      FROM wp_woocommerce_order_items oi
      LEFT JOIN wp_posts o ON oi.order_id = o.ID
      LEFT JOIN wp_postmeta cm ON o.ID = cm.post_id AND cm.meta_key = '_customer_user'
      LEFT JOIN wp_postmeta be ON o.ID = be.post_id AND be.meta_key = '_billing_email'
      LEFT JOIN wp_postmeta bn ON o.ID = bn.post_id AND bn.meta_key = '_billing_first_name'
      LEFT JOIN wp_postmeta bp ON o.ID = bp.post_id AND bp.meta_key = '_billing_phone'
      LEFT JOIN wp_postmeta bs ON o.ID = bs.post_id AND bs.meta_key = '_billing_address_1'
      LEFT JOIN wp_postmeta sn ON o.ID = sn.post_id AND sn.meta_key = '_shipping_first_name'
      LEFT JOIN wp_postmeta sa ON o.ID = sa.post_id AND sa.meta_key = '_shipping_address_1'
      LEFT JOIN wp_postmeta ot ON o.ID = ot.post_id AND ot.meta_key = '_order_total'
      LEFT JOIN wp_postmeta pm ON o.ID = pm.post_id AND pm.meta_key = '_payment_method_title'
      LEFT JOIN wp_postmeta tax ON o.ID = tax.post_id AND tax.meta_key = '_order_tax'
      LEFT JOIN wp_postmeta ship ON o.ID = ship.post_id AND ship.meta_key = '_order_shipping'
      LEFT JOIN wp_woocommerce_order_itemmeta qim ON oi.order_item_id = qim.order_item_id AND qim.meta_key = '_qty'
      LEFT JOIN wp_woocommerce_order_itemmeta qp ON oi.order_item_id = qp.order_item_id AND qp.meta_key = '_line_total'
      WHERE o.post_type = 'shop_order'
      GROUP BY o.ID
    `;
    
  
      const params:any[] = [];
      console.log("res==========");
      
      
      const paginatedResult = await executeQueryPagination(query, params, limit, Number(page), offset, order_by);
  
      res.json({ success: true, ...paginatedResult });
    } catch (error) {
      console.error("Error fetching orders:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });


  router.get("/:order_id", async (req, res) => {
    try {
      const { order_id } = req.params;
  
      const query = `
        SELECT 
          o.ID AS order_id,
          o.post_date AS order_date,
          o.post_status AS order_status,
          cm.meta_value AS customer_id,
          be.meta_value AS billing_email,
          bn.meta_value AS billing_name,
          bp.meta_value AS billing_phone,
          bs.meta_value AS billing_address,
          bc.meta_value AS billing_city,
          bst.meta_value AS billing_state,
          bpc.meta_value AS billing_postcode,
          bcn.meta_value AS billing_country,
          sn.meta_value AS shipping_name,
          sa.meta_value AS shipping_address,
          sc.meta_value AS shipping_city,
          sst.meta_value AS shipping_state,
          spc.meta_value AS shipping_postcode,
          scn.meta_value AS shipping_country,
          ot.meta_value AS order_total,
          pm.meta_value AS payment_method,
          tax.meta_value AS tax_amount,
          ship.meta_value AS shipping_cost,
          CONCAT('[', GROUP_CONCAT(
              JSON_OBJECT(
                  'product_name', oi.order_item_name,
                  'product_qty', COALESCE(qim.meta_value, 0),
                  'product_price', COALESCE(qp.meta_value, 0)
              )
          ), ']') AS product_details
        FROM wp_woocommerce_order_items oi
        LEFT JOIN wp_posts o ON oi.order_id = o.ID
        LEFT JOIN wp_postmeta cm ON o.ID = cm.post_id AND cm.meta_key = '_customer_user'
        LEFT JOIN wp_postmeta be ON o.ID = be.post_id AND be.meta_key = '_billing_email'
        LEFT JOIN wp_postmeta bn ON o.ID = bn.post_id AND bn.meta_key = '_billing_first_name'
        LEFT JOIN wp_postmeta bp ON o.ID = bp.post_id AND bp.meta_key = '_billing_phone'
        LEFT JOIN wp_postmeta bs ON o.ID = bs.post_id AND bs.meta_key = '_billing_address_1'
        LEFT JOIN wp_postmeta bc ON o.ID = bc.post_id AND bc.meta_key = '_billing_city'
        LEFT JOIN wp_postmeta bst ON o.ID = bst.post_id AND bst.meta_key = '_billing_state'
        LEFT JOIN wp_postmeta bpc ON o.ID = bpc.post_id AND bpc.meta_key = '_billing_postcode'
        LEFT JOIN wp_postmeta bcn ON o.ID = bcn.post_id AND bcn.meta_key = '_billing_country'
        LEFT JOIN wp_postmeta sn ON o.ID = sn.post_id AND sn.meta_key = '_shipping_first_name'
        LEFT JOIN wp_postmeta sa ON o.ID = sa.post_id AND sa.meta_key = '_shipping_address_1'
        LEFT JOIN wp_postmeta sc ON o.ID = sc.post_id AND sc.meta_key = '_shipping_city'
        LEFT JOIN wp_postmeta sst ON o.ID = sst.post_id AND sst.meta_key = '_shipping_state'
        LEFT JOIN wp_postmeta spc ON o.ID = spc.post_id AND spc.meta_key = '_shipping_postcode'
        LEFT JOIN wp_postmeta scn ON o.ID = scn.post_id AND scn.meta_key = '_shipping_country'
        LEFT JOIN wp_postmeta ot ON o.ID = ot.post_id AND ot.meta_key = '_order_total'
        LEFT JOIN wp_postmeta pm ON o.ID = pm.post_id AND pm.meta_key = '_payment_method_title'
        LEFT JOIN wp_postmeta tax ON o.ID = tax.post_id AND tax.meta_key = '_order_tax'
        LEFT JOIN wp_postmeta ship ON o.ID = ship.post_id AND ship.meta_key = '_order_shipping'
        LEFT JOIN wp_woocommerce_order_itemmeta qim ON oi.order_item_id = qim.order_item_id AND qim.meta_key = '_qty'
        LEFT JOIN wp_woocommerce_order_itemmeta qp ON oi.order_item_id = qp.order_item_id AND qp.meta_key = '_line_total'
        WHERE o.post_type = 'shop_order' AND o.ID = ?
        GROUP BY o.ID
      `;
  
      const params = [order_id];
  
      const { result } = await executeQuery(query, params);
  
      res.json({ success: true, order: result });
    } catch (error) {
      console.error("Error fetching order:", error);
      res.status(500).json({ success: false, message: "Internal Server Error" });
    }
  });
  
  
  export async function executeQuery(
    query: string,
    params: any[],
  
  ) {
    try {
      // Count total records
       
 
      const [results] = await wpDB.query(query, params);
  
     
      return {
        result: results,
 
        
      };
    } catch (error) {
      console.error("Error in executeQueryPagination:", error);
      throw error;
    }
  }

  export async function executeQueryPagination(
    query: string,
    params: any[],
    limit: any,
    page: number,
    offset: number,
    order_by: any
  ) {
    try {
      // Count total records
      const totalQuery = `SELECT COUNT(*) as total FROM (${query}) AS total_table`;
      const totalResult:[any[], FieldPacket[]] = await wpDB.query(totalQuery, params);
//       console.log(totalResult);
      
// console.log("totalResult",totalResult[0][0]);

      // Ensure totalResult is an array and has data
      const total = Array.isArray(totalResult[0]) && totalResult[0].length > 0 ? totalResult[0][0]?.total : 0;
  
    //   const totalResult = await wpDB.query(totalQuery, params);

  
      // Apply ordering, limit, and offset
      const paginatedQuery = `${query} ORDER BY ${order_by} DESC LIMIT ? OFFSET ?`;
      params.push(limit, offset);
      const [results] = await wpDB.query(paginatedQuery, params);
  
      // Generate pagination response

      var pagination =     generatePagination(page, total, limit)
      return {
        result: results,
        totalRecords: total,
        showPagination: pagination.showPagination,
        // currentPage: page,
        totalPages: Math.ceil(total / limit),
        // hasNextPage: page * limit < total,
        // hasPrevPage: page > 1,
      };
    } catch (error) {
      console.error("Error in executeQueryPagination:", error);
      throw error;
    }
  }
  
  

export default router;
