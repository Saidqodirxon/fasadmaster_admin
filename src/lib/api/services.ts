import api from "./axios";

export interface ImageData {
  url: string;
  id: string;
}

export interface ServiceData {
  _id?: string;
  name_uz: string;
  name_ru: string;
  name_en: string;
  description_uz: string;
  description_ru: string;
  description_en: string;
  is_visible: boolean;
  view: "1" | "2";
  categoryId: string;
  price: string;
  image: ImageData[];
}

export const getServices = async (
  endpoint: string,
  filters: {
    is_visible?: boolean;
    view?: "1" | "2";
    categoryId?: string;
    q?: string;
  } = {}
): Promise<{
  data: ServiceData[];
  total: number;
  offset: number;
  limit: number;
}> => {
  try {
    // Build query string from filters
    const query = new URLSearchParams();
    if (filters.is_visible !== undefined) {
      query.append("is_visible", filters.is_visible.toString());
    }
    if (filters.view) {
      query.append("view", filters.view);
    }
    if (filters.categoryId) {
      query.append("categoryId", filters.categoryId);
    }
    if (filters.q) {
      console.log("Query string:", filters.q);

      query.append("q", filters.q);
    }

    const queryString = query.toString();
    console.log("Fetching services with query:", `/services?${queryString}`);

    const response = await api.get(`/services?${queryString}`);
    console.log("Get services response:", response.data);

    // Ensure response.data is an array
    const responseData = Array.isArray(response.data) ? response.data : [];

    // Normalize image field to ensure it's always an array
    const normalizedServices = responseData.map((service: ServiceData) => ({
      ...service,
      image: Array.isArray(service.image)
        ? service.image
        : service.image
        ? [service.image]
        : [],
    }));

    // Return paginated result
    return {
      data: normalizedServices,
      total: response.data?.pageInfo?.total ?? 0,
      offset: response.data?.pageInfo?.offset ?? 0,
      limit: response.data?.pageInfo?.limit ?? 0,
    };
  } catch (error: any) {
    console.error(
      "Get services error:",
      error.response?.data || error.message,
      { filters, endpoint }
    );
    throw new Error(
      error.response?.data?.message || "Failed to fetch services"
    );
  }
};

// Other functions remain unchanged
export const getService = async (id: string): Promise<ServiceData> => {
  try {
    const response = await api.get(`/services/${id}`);
    console.log("Get service response:", response.data);

    // Ensure image is always an array
    if (response.data && !Array.isArray(response.data.image)) {
      response.data.image = response.data.image ? [response.data.image] : [];
    }

    return response.data;
  } catch (error: any) {
    console.error("Get service error:", error.response?.data || error.message);
    throw new Error(error.response?.data?.message || "Failed to fetch service");
  }
};

export const createService = async (
  data: ServiceData
): Promise<ServiceData> => {
  try {
    console.log("Creating service with data:", data);
    const response = await api.post("/services", data);
    console.log("Create service response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Create service error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to create service"
    );
  }
};

export const updateService = async (
  id: string,
  data: ServiceData
): Promise<ServiceData> => {
  try {
    console.log("Updating service with data:", data);
    const response = await api.patch(`/services/${id}`, data);
    console.log("Update service response:", response.data);
    return response.data;
  } catch (error: any) {
    console.error(
      "Update service error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to update service"
    );
  }
};

export const deleteService = async (id: string): Promise<void> => {
  try {
    await api.delete(`/services/${id}`);
  } catch (error: any) {
    console.error(
      "Delete service error:",
      error.response?.data || error.message
    );
    throw new Error(
      error.response?.data?.message || "Failed to delete service"
    );
  }
};
