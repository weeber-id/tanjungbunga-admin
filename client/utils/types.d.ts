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
  id: string;
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
  operation_time?: OperationTimeState;
  facilities_id?: string[];
  active: boolean;
  recommendation?: boolean;
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
  operation_time?: OperationTimeState;
  active: boolean;
  recommendation?: boolean;
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
  recommendation?: boolean;
};

export type Travel = {
  id: string;
  name: string;
  image: string;
  slug: string;
  price: string;
  short_description: string;
  description: string;
  operation_time?: OperationTimeState;
  active: boolean;
  recommendation?: boolean;
};

export type DashboardInfo = {
  article?: {
    count: number;
  };
  handcraft: {
    count: number;
  };
  culinary: {
    count: number;
  };
  lodging: {
    count: number;
  };
  travel?: {
    count: number;
  };
};

export type Discussion = {
  body: string;
  content_id: string;
  content_name: 'article' | 'travel' | 'culinary' | 'handcraft' | 'lodging';
  created_at: string;
  email: string;
  id: string;
  name: string;
  questions: Discussion[] | null;
};

export type Article = {
  id: string;
  author: string;
  body: string;
  created_at: string;
  recommendation: boolean;
  slug: string;
  title: string;
  updated_at: string;
  active: boolean;
  image_cover: string;
};

export type About = {
  id: string;
  name: string;
  profile_picture: string;
  position: string;
  body: string;
};
