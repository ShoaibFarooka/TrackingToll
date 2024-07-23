import axiosInstance from './axiosInstance';

const orderService = {
    createOrder: async (payload) => {
        try {
            const response = await axiosInstance.post('/api/orders/create-new-order', payload);
            return response.data;
        } catch (error) {
            console.error('Error creating order:', error);
            throw error;
        }
    },

    getAllOrders: async () => {
        try {
            const response = await axiosInstance.get('/api/orders/get-all-orders');
            return response.data;
        } catch (error) {
            console.error('Error getting orders:', error);
            throw error;
        }
    },

    updateTeamResponse: async (id, payload) => {
        try {
            const response = await axiosInstance.patch(`/api/orders/update-order-team-response/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error('Error updating order team response:', error);
            throw error;
        }
    },
    completeOrder: async (id, payload) => {
        try {
            const response = await axiosInstance.post(`/api/orders/approve-order/${id}`, payload);
            return response.data;
        } catch (error) {
            console.error('Error updating order team response:', error);
            throw error;
        }
    },
    getOrderById: async (id) => {
        try {
            const response = await axiosInstance.get(`/api/orders/get-order-by-id/${id}`);
            return response.data;
        } catch (error) {
            console.error('Error updating order team response:', error);
            throw error;
        }
    },
    searchOrderItems: async (data) => {
        try {
            const response = await axiosInstance.get(`/api/orders/search-order-items`, { params: data });
            return response.data;
        } catch (error) {
            console.error('Error searching order items:', error);
            throw error;
        }
    },
    exportItemsCSV: async (payload) => {
        try {
            const response = await axiosInstance.post(`/api/orders/export-items-csv`, payload, {
                responseType: 'arraybuffer'
            });
            return response;
        } catch (error) {
            console.error('Error exporting items csv:', error);
            throw error;
        }
    },
    downloadOrderPDF: async (id) => {
        try {
            const response = await axiosInstance.get(`/api/orders/download-order-pdf/${id}`, {
                responseType: 'blob'
            });
            return response;
        } catch (error) {
            throw error;
        }
    },
};

export default orderService;
