export const CATEGORY_TYPE = {
    company: 1,
    other: 2,
  };
  
export const STATUS = {
  active : 1,
  delete : 2
}

export const ROLES = {
  admin : 1,
  customer : 2,
  wholesaler : 3
}

export const DEPARTMENT_VIEW = {
  header : 1,
  not_in_header : 0
}

export const IS_REQUIRED = 1;

export const DEFAULD_PASSWORD = "$#@!@##Awe2001";
export const PAYMENT_METHODS = {
  square_card : 1,
  afterpay :2,
  square_gpay:3,
  paypal :4,
  apple_pay :5,
  stripe :6,
  zip_pay : 7
}

export const ORDER_STATUS = {
  processing : 1,
  shipped : 2,
  delivered : 3,
  canceled : 4,
  returned :  5,
  failed_payment : 6,
  trashed : 7
}

export const PAYMENT_STATUS = {
  pending : 0,
  paid : 1
}

export const PAYMENT_PAID = 1

export const SHIPPMENT_METHOD = {
  australia_post :1,
  direct_freight_express : 2 
}

export const SHIPPMENT_TYPE = {
  manual : 1,
  automatic : 2
}


export const COUPEN_TYPE = {
  product: 1,
  discount: 2,
  free_shiipping :3
};

export const COUPEN_DISCOUNT_TYPE = {
  parcentage: 1,
  value: 2,
};
export const COUPEN_PRICE_VALIDATION = {
  all: 1,
  based_on_price: 2,
};
export const COUPEN_CATEGORY_VALIDATION = {
  all: 1,
  department: 2,
  category: 3,
  product: 4,
};

export const COUPEN_APPLY_WITH_OTHER_COUPONS = {
  YES:1,
  NO : 0
}
export const COUPEN_APPLY_ON_DISCOUNTED_PRODUCT = {
  YES:1,
  NO : 0
}

export const COUPEN_APPLY_FOR_ALL_TIME = {
  YES:1,
  NO : 0
}

export const COUPEN_ACTIVATE = {
  YES:1,
  NO : 0
}

export const   OPTION_TYPE = {
  custom :1,
  checkbox : 0
  }

export const STANDARD_DELIVERY = 1;
export const LOCAL_PICKUP = 2;

export const WHOLESALE_REQUEST_STATUS ={
  pending : 0,
  approved : 1,
  rejected : 2,
  in_progress : 3
}

export const SALE_TARGET_TYPE = {
   yearly : 1,
   monthly : 2 ,
   weekly : 4,
   daily : 3 ,
}

