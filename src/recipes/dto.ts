interface IComponent {
  name: string;
}

export class CreateRecipeDto {
  title: string;
  description: string;
  steps: string;
  ingredients: string;
  typeId: number;
  nationalCuisineId: number;
  holidayId: number;
}

export class QueryParamsGetRecipes {
  search?: string;
  page: string;
  // steps: JSON;
  // ingredients: JSON;
  typeId?: string | string[];
  nationalCuisineId?: string | string[];
  holidayId?: string | string[];
  orderBy?: 'asc' | 'desc';
}
