export interface NSTCategories {
  id: string;
  function_id?: string;
  code: string;
  name: string;
  description?: string;
};

export interface NSTControlExamples {
  id: string;
  subcategory_id?: string;
  example: string;
};

export interface NSTFunctions {
  id: string;
  code: string;
  name: string;
  description?: string;
};

export interface NSTSubcategories {
  id: string;
  category_id?: string;
  code: string;
  description: string;
};