import axiosInstance from './axiosInstance';

const salesPackageService = {
    searchPackages: async (params) => {
        try {
            const response = await axiosInstance.get('/api/sales/search-sales-packages', { params });
            return response.data;
        } catch (error) {
            console.error('Error searching sales packages:', error);
            throw error;
        }
    },

    addPackage: async (payload) => {
        try {
            const response = await axiosInstance.post('/api/sales/add-sales-packages', payload);
            return response.data;
        } catch (error) {
            console.error('Error adding sales package:', error);
            throw error;
        }
    },

    updatePackage: async (id, payload) => {
        try {
            const response = await axiosInstance.put(`/api/sales/update-sales-packages/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error('Error updating sales package:', error);
            throw error;
        }
    },

    removePackage: async (id) => {
        try {
            const response = await axiosInstance.delete(`/api/sales/remove-sales-packages/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error removing sales package:', error);
            throw error;
        }
    },
};

export default salesPackageService;
