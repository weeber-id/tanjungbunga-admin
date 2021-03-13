export type User = {
  name: string;
  id: string;
  role: 0 | 1;
  profile_picture: string;
  username: string;
  isLoggedIn?: boolean;
};

export type Facility = {
  name: string;
  icon: string;
};

export type Lodging = {
  id: string;
  name: string;
  image: string;
  slug: string;
  price: {
    value: string;
    unit: string;
  };
  links: {
    name: string;
    link: string;
  }[];
  short_description: string;
  description: string;
  facilities: Facility[] | null;
};
