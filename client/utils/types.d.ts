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

export type OperationTimeState = {
  monday: {
    open: boolean;
    from: string;
    to: string;
  };
  tuesday: {
    open: boolean;
    from: string;
    to: string;
  };
  wednesday: {
    open: boolean;
    from: string;
    to: string;
  };
  thursday: {
    open: boolean;
    from: string;
    to: string;
  };
  friday: {
    open: boolean;
    from: string;
    to: string;
  };
  saturday: {
    open: boolean;
    from: string;
    to: string;
  };
  sunday: {
    open: boolean;
    from: string;
    to: string;
  };
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

export type Commodity = {
  id: string;
  name: string;
  image: string;
  slug: string;
  price: {
    unit: string;
    start: string;
    end: string;
  };
  links?: Link[];
  short_description: string;
  description: string;
  operation_time?: OperationTimeState;
  active: boolean;
};

export type Travel = {
  id: string;
  name: string;
  image: string;
  slug: string;
  price: string;
  short_description: string;
  description: string;
};
