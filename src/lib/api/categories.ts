import api from "./axios";

export interface ImageData {
  url: string;
  id: string;
}

export interface CategoriesData {
  _id?: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
}

export const getCategories = async (id: string): Promise<CategoriesData[]> => {
  try {
    const response = await api.get("/categories");
    console.log("Get Categories response:", response.data);
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error(
      "Get Categories error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch Categories"
    );
  }
};

export const getCategory = async (id: string): Promise<CategoriesData> => {
  try {
    const response = await api.get(`/categories/${id}`);
    console.log("Get Categories response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Get Categories error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch Categories"
    );
  }
};

export const createCategories = async (
  data: CategoriesData
): Promise<CategoriesData> => {
  try {
    console.log("Creating Categories with data:", data);
    const response = await api.post("/categories", data);
    console.log("Create Categories response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Create Categories error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create Categories"
    );
  }
};

export const updateCategories = async (
  id: string,
  data: CategoriesData
): Promise<CategoriesData> => {
  try {
    console.log("Updating Categories with data:", data);
    const response = await api.patch(`/categories/${id}`, data);
    console.log("Update Categories response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Update Categories error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update Categories"
    );
  }
};

export const deleteCategories = async (id: string): Promise<void> => {
  try {
    await api.delete(`/categories/${id}`);
  } catch (error: any) {
    console.error(
      "Delete Categories error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete Categories"
    );
  }
};
