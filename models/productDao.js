import prisma from '../prisma';

const getMainCategory = async () =>
  await prisma.$queryRaw`
    SELECT
      id, name
    FROM
      main_categories
    ORDER BY
      id
  `;

const getSubCategory = async mainCategoryId =>
  await prisma.$queryRaw`
    SELECT
      id, name
    FROM
      sub_categories
    WHERE
      main_category_id = ${mainCategoryId};
  `;

const getNewestProductOfEachCategory = async mainCategoryId =>
  await prisma.$queryRaw`
    SELECT
      p.id,
      p.name,
      p.main_category_id,
      i.image_url
    FROM
      products p
    JOIN
      products_thumbnails i
    ON
      i.product_id = p.id
    WHERE
      p.main_category_id = ${mainCategoryId}
    ORDER BY
      updated_at DESC LIMIT 1
  `;

const getSpecialProduct = async () => {
  const [specialProduct] = await prisma.$queryRaw`
    SELECT
      p.id,
      p.name,
      p.description,
      p.price,
      p.discounted_price,
      i.image_url,
      DATE_FORMAT(DATE_ADD(p.created_at, INTERVAL 10 DAY), '%m/%d/%Y') AS expire_date
    FROM
      products p
    JOIN
      products_thumbnails i
    ON
      i.product_id = p.id
    ORDER BY
      updated_at DESC LIMIT 1
  `;
  return specialProduct;
};

const getShipmentsOfProduct = async productId =>
  await prisma.$queryRaw`
    SELECT
      s.shipment
    FROM
      shipments s
    JOIN
      products_shipments p
    ON
      p.product_id = ${productId}
    WHERE
      s.id = p.shipment_id
    ORDER BY
      s.id
  `;

const getProductNavBar = async productId => {
  const [productNavBar] = await prisma.$queryRaw`
    SELECT
      main_categories.name AS mainCategoryName,
      sub_categories.name AS subCategoryName
    FROM
      products
    JOIN
      main_categories
    ON
      main_categories.id = products.main_category_id
    JOIN
      sub_categories
    ON
      sub_categories.id = products.sub_category_id
    WHERE
      products.id = ${productId};
  `;
  return productNavBar;
};

const getProductDetail = async productId => {
  const [product] = await prisma.$queryRaw`
    SELECT
      p.id,
      p.name,
      p.price,
      p.discounted_price,
      p.description,
      p.storage,
      p.shipping_company,
      p.created_at
    FROM
      products as p
    where
      p.id=${productId};`;
  return product;
};

const getProductShipment = async productId => {
  const productShipment = await prisma.$queryRaw`
    SELECT
      s.shipment
    FROM
      products_shipments as ps
    JOIN
      shipments s
    ON
      s.id = ps.shipment_id
    WHERE
      ps.product_id = ${productId};`;
  return productShipment;
};

const getProductThumbNail = async productId => {
  const productThumbNail = await prisma.$queryRaw`
    SELECT
      t.id,
      t.image_url,
      t.is_main
    FROM
      products_thumbnails as t
    WHERE
      product_id = ${productId};`;
  return productThumbNail;
};

const getProductDescriptionImage = async productId => {
  const descriptionImage = await prisma.$queryRaw`
    SELECT
      d.id,
      d.image_url,
      d.product_id
    FROM
      description_images as d
    WHERE
      product_id = ${productId};`;
  return descriptionImage;
};

// comment API Test
const getProductCommentList = async productId => {
  const commentList = await prisma.$queryRaw`
    SELECT
      c.product_id,
      c.user_id,
      u.nickname,
      c.scores,
      c.comment,
      c.image_url
    FROM
      comments c
    JOIN
      users u
    ON
      c.user_id = u.id
    WHERE
      c.product_id = ${productId}
    ORDER BY
      c.created_at DESC
  `;
  return commentList;
};

const getLikedProduct = async (productId, userId) => {
  const [isLiked] = await prisma.$queryRaw`
    SELECT COUNT(*) AS result
    FROM 
      likes 
    WHERE 
      product_id=${productId}
    AND
      user_id=${userId}
  `;
  return isLiked.result;
};

const addLike = async (productId, userId) => {
  return await prisma.$queryRaw`
    INSERT INTO 
      likes 
      (product_id, user_id) 
    VALUE 
      (${productId}, ${userId})
  `;
};

const deleteLike = async (productId, userId) => {
  return await prisma.$queryRaw`
    DELETE FROM
      likes 
    WHERE 
      product_id=${productId} 
    AND 
      user_id=${userId}
  `;
};

const isProduct = async productId => {
  const [isProduct] = await prisma.$queryRaw`
    SELECT COUNT(*) AS result
    FROM 
      products 
    WHERE 
      id=${productId}
  `;
  return isProduct.result;
};

export default {
  getMainCategory,
  getSubCategory,
  getNewestProductOfEachCategory,
  getSpecialProduct,
  getShipmentsOfProduct,
  getProductNavBar,
  getProductDetail,
  getProductShipment,
  getProductThumbNail,
  getProductDescriptionImage,
  getProductCommentList,
  getLikedProduct,
  addLike,
  deleteLike,
  isProduct,
};
