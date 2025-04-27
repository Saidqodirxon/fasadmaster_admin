import api from "./axios";

export interface AboutData {
  _id?: string;
  about_uz: string;
  about_ru: string;
  about_en: string;
  history_uz: string;
  history_ru: string;
  history_en: string;
  adventages_uz: string;
  adventages_ru: string;
  adventages_en: string;
}

export const getAbout = async (id: string): Promise<AboutData[]> => {
  try {
    const response = await api.get("/abouts");
    console.log("Get About response:", response.data);
    // Ensure we always return an array
    return Array.isArray(response.data) ? response.data : [];
  } catch (error: any) {
    console.error("Get About error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch About");
  }
};

export const getCategory = async (id: string): Promise<AboutData> => {
  try {
    const response = await api.get(`/abouts/${id}`);
    console.log("Get About response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Get About error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch About");
  }
};

export const createAbout = async (data: AboutData): Promise<AboutData> => {
  try {
    console.log("Creating About with data:", data);
    const response = await api.post("/abouts", data);
    console.log("Create About response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Create About error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to create About");
  }
};

export const updateAbout = async (
  id: string,
  data: AboutData
): Promise<AboutData> => {
  try {
    console.log("Updating About with data:", data);
    const response = await api.patch(`/abouts/${id}`, data);
    console.log("Update About response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error("Update About error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to update About");
  }
};

export const deleteAbout = async (id: string): Promise<void> => {
  try {
    await api.delete(`/abouts/${id}`);
  } catch (error: any) {
    console.error("Delete About error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to delete About");
  }
};
