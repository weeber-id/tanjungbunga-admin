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

export type Link = {
  name: string;
  link: string;
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
  links: Link[];
  short_description: string;
  description: string;
  facilities: Facility[] | null;
};

export type Handcraft = {
  id: string;
  name: string;
  image: string;
  slug: string;
  price: string;
  links: Link[];
  short_description: string;
  description: string;
};
