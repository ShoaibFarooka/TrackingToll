import axiosInstance from './axiosInstance';

const userService = {
    getUserById: async (userId) => {
        try {
            const response = await axiosInstance.get(`/api/users/${userId}`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },
    getUserInfo: async () => {
        try {
            const response = await axiosInstance.get(`/api/users/fetch-user-info`);
            return response.data;
        } catch (error) {
            console.error('Error fetching user:', error);
            throw error;
        }
    },
    loginUser: async (payload) => {
        try {
            const response = await axiosInstance.post('/api/users/login', payload, { withCredentials: true, skipAuthRefresh: true });
            console.log('Response: ', response);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    refreshToken: async (payload) => {
        try {
            const response = await axiosInstance.post('/api/users/refresh-token', payload, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    logoutUser: async (payload) => {
        try {
            const response = await axiosInstance.post('/api/users/logout', payload, { withCredentials: true });
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    getAllUsers: async () => {
        try {
            const response = await axiosInstance.get(`/api/users/fetch-all-users-info`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    addUser: async (payload) => {
        try {
            const response = await axiosInstance.post(`/api/users/add-user`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    updateUser: async (userId, payload) => {
        try {
            const response = await axiosInstance.patch(`/api/users/update-user-info/${userId}`, payload);
            return response.data;
        } catch (error) {
            throw error;
        }
    },
    deleteUser: async (userId) => {
        try {
            const response = await axiosInstance.delete(`/api/users/delete-user/${userId}`);
            return response.data;
        } catch (error) {
            throw error;
        }
    },

};

export default userService;