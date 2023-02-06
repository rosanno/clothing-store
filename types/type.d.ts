interface User {
  id: string;
  createdAt: string;
  email: string;
  emailVerified: null;
  name: string;
  image: null;
  address: string;
  phone: string;
  password: string;
  role: string;
}

interface Sessions {
  user: User;
}

interface CartItems {
  id: number;
  quantity: number;
  total: number;
  subTotal: number;
  size: string;
  productsId: number;
  userId: string;
  createdAt: string;
  updatedAt: string;
  Products: Products;
}

interface Products {
  id: string;
  name: string;
  description: string;
  price: string;
  createdAt: number;
  productImg: string;
  favorites?: Favorites;
  size?: Size[];
  review?: Review[];
  color: Color[];
}

interface Color {
  id: number;
  color: string;
}

interface Review {
  id: number;
  review: string;
  rating: number;
  createdAt: string;
  productsId: number;
  userId: string;
  user: User;
}

interface Size {
  id: string;
  size: string;
  productsId: Number;
}

interface Favorites {
  isFavorite: boolean;
  userId: string;
}

interface Props {
  products: Products[];
  query?: string;
}
