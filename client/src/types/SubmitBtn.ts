export type OrderFormData = {
  id: string;
  name: string;
  quantity: number;
  price: number;
  img?: string;
  // creditCardInfo?: string;
};

export type Props = {
  formData: OrderFormData;
  toPage: string;
  creditCardInfo?: string;
  btnTxt: string;
};
