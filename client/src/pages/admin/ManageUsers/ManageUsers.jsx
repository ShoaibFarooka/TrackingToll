import { useState, useEffect, useCallback } from 'react';
import './ManageUsers.css';
import { message, Button, Form } from 'antd';
import { useDispatch } from 'react-redux';
import { HideLoading, ShowLoading } from '../../../redux/loaderSlice';
import UserTable from './components/UserTable/UserTable';
import UserFormModal from './components/UserFormModal/UserFormModal';
import userService from '../../../services/userService';

const ManageUsers = () => {
    const [users, setUsers] = useState([]);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [editingUser, setEditingUser] = useState(null);
    const [form] = Form.useForm();
    const dispatch = useDispatch();

    const fetchUsers = useCallback(async () => {
        dispatch(ShowLoading());
        try {
            const response = await userService.getAllUsers();
            if (response.users) {
                setUsers(response.users);
            }
        } catch (error) {
            message.error(error.response.data);
        } finally {
            dispatch(HideLoading());
        }
    }, [dispatch]);

    useEffect(() => {
        fetchUsers();
    }, [fetchUsers]);

    const handleDelete = useCallback(async (userId) => {
        dispatch(ShowLoading());
        try {
            const response = await userService.deleteUser(userId);
            message.success(response);
            fetchUsers();
        } catch (error) {
            message.error(error.response.data);
        } finally {
            dispatch(HideLoading());
        }
    }, [dispatch, fetchUsers]);

    const handleAddEdit = useCallback((user) => {
        setEditingUser(user);
        setIsModalVisible(true);
        form.setFieldsValue(user || { name: '', email: '', team: '', password: '' });
    }, [form]);

    const handleSave = useCallback(async () => {
        try {
            const values = await form.validateFields();
            dispatch(ShowLoading());
            if (editingUser) {
                const response = await userService.updateUser(editingUser._id, values);
                message.success(response);
            } else {
                const response = await userService.addUser(values);
                message.success(response);
            }
            form.resetFields();
            setIsModalVisible(false);
            fetchUsers();
        } catch (error) {
            message.error(error.response.data);
        } finally {
            dispatch(HideLoading());
        }
    }, [dispatch, form, editingUser, fetchUsers]);

    const handleCancel = useCallback(() => {
        setIsModalVisible(false);
    }, []);

    return (
        <div className="manage-users">
            <Button className='add-btn' type="primary" onClick={() => handleAddEdit(null)}>Add User</Button>
            <UserTable users={users} handleEdit={handleAddEdit} handleDelete={handleDelete} />
            <UserFormModal
                form={form}
                isModalVisible={isModalVisible}
                handleSave={handleSave}
                handleCancel={handleCancel}
                editingUser={editingUser}
            />
        </div>
    );
};

export default ManageUsers;
