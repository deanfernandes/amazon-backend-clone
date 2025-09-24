export interface UserPaymentMethod {
  id: number;
  type: UserPaymentMethodType;
  card_number: string | null;
  cardholder_name: string | null;
  security_code: string | null;
  expiry_month: string | null;
  expiry_year: string | null;
  paypal_email: string | null;
  user_id: number;
}

export enum UserPaymentMethodType {
  CreditCard = "CREDIT_CARD",
  Paypal = "PAYPAL",
}
