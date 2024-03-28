interface IComponent {
  name: string;
}

export class CreateRecipeDto {
  title: string;
  description: string;
  steps: any[] | any;
  ingredients: any[] | any;
  typeId: number;
  nationalCuisineId: number;
  holidayId: number;
}

export class QueryParamsGetRecipes {
  search?: string;
  page?: string;
  typeId?: string | string[];
  nationalCuisineId?: string | string[];
  holidayId?: string | string[];
  orderBy?: 'asc' | 'desc' | 'none';
}

export class QueryParamsGetOwnRecipes extends QueryParamsGetRecipes {
  isRejected: string;
  isChecked: string;
}

export class QueryParamsGetUsersRecipes {
  search: string;
  page: string;
  id: string;
}

export class QueryParamsGetLikedRecipes {
  page: string;
  search: string;
}

export class GetUserRecipesDto {
  page: number;
  search: string;
  isChecked?: string;
  isRejected?: string;
}

export class GetRecipesDto {
  typeId: IComponent[] | IComponent;
  nationalCuisineId: IComponent[] | IComponent;
  holidayId: IComponent[] | IComponent;
  orderBy: 'asc' | 'desc' | 'none';
  page: number;
  search: string;
  isChecked?: string;
  isRejected?: string;
}
