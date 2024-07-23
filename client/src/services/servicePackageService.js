import axiosInstance from './axiosInstance';

const servicePackageService = {
    searchPackages: async (params) => {
        try {
            const response = await axiosInstance.get('/api/service/search-service-packages', { params });
            return response.data;
        } catch (error) {
            console.error('Error searching service packages:', error);
            throw error;
        }
    },

    addPackage: async (payload) => {
        try {
            const response = await axiosInstance.post('/api/service/add-service-packages', payload);
            return response.data;
        } catch (error) {
            console.error('Error adding service package:', error);
            throw error;
        }
    },

    updatePackage: async (id, payload) => {
        try {
            const response = await axiosInstance.put(`/api/service/update-service-packages/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error('Error updating service package:', error);
            throw error;
        }
    },

    removePackage: async (id) => {
        try {
            const response = await axiosInstance.delete(`/api/service/remove-service-packages/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error removing service package:', error);
            throw error;
        }
    },
};

export default servicePackageService;
