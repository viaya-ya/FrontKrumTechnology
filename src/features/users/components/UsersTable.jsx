import { useState, useEffect } from "react";
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  DatePicker,
  message,
  Popconfirm,
  Spin,
  Card
} from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  SaveOutlined, 
  CloseOutlined,
  PlusOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined 
} from "@ant-design/icons";
import dayjs from 'dayjs';
import { 
  useGetAllUsersQuery, 
  useUpdateUserMutation, 
  useDeleteUserMutation,
  useCreateUserMutation
} from "../usersApi";

export default function UsersTable() {
  const [users, setUsers] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  const {
    data: arrayUsers,
    isLoading,
    isFetching,
    isError,
  } = useGetAllUsersQuery();

  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [createUser] = useCreateUserMutation();

  useEffect(() => {
    if (arrayUsers?.length > 0) {
      const usersWithKey = arrayUsers.map(item => ({
        ...item,
        key: item.id || Math.random().toString(36).substr(2, 9),
        // Форматируем дату для отображения
        birthDateFormatted: item.birthDate ? dayjs(item.birthDate).format('DD.MM.YYYY') : ''
      }));
      setUsers(usersWithKey);
    }
  }, [arrayUsers]);

  const handleEdit = (record) => {
    setEditingKey(record.key);
    setCurrentRecord(record);
    form.setFieldsValue({
      ...record,
      birthDate: record.birthDate ? dayjs(record.birthDate) : null
    });
    setIsModalVisible(true);
  };

  const handleCreate = () => {
    setIsCreateModalVisible(true);
    createForm.resetFields();
  };

  const handleCancel = () => {
    setEditingKey('');
    setCurrentRecord(null);
    setIsModalVisible(false);
    form.resetFields();
  };

  const handleCreateCancel = () => {
    setIsCreateModalVisible(false);
    createForm.resetFields();
  };

  const handleSave = async () => {
    try {
      const values = await form.validateFields();
      const updatedUser = { 
        ...currentRecord, 
        ...values,
        birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null,
        addressId: currentRecord.address?.id
      };
      
      await updateUser(updatedUser).unwrap();
      
      setUsers(prev => prev.map(item => 
        item.key === currentRecord.key ? updatedUser : item
      ));
      
      message.success('Пользователь успешно обновлен');
      handleCancel();
    } catch (error) {
      message.error('Ошибка при обновлении пользователя');
      console.error('Update error:', error);
    }
  };

  const handleCreateSave = async () => {
    try {
      const values = await createForm.validateFields();
      const newUser = {
        ...values,
        birthDate: values.birthDate ? values.birthDate.format('YYYY-MM-DD') : null
      };
      
      await createUser(newUser).unwrap();
      
      message.success('Пользователь успешно создан');
      handleCreateCancel();
    } catch (error) {
      message.error('Ошибка при создании пользователя');
      console.error('Create error:', error);
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteUser(record.id).unwrap();
      setUsers(prev => prev.filter(item => item.key !== record.key));
      message.success('Пользователь успешно удален');
    } catch (error) {
      message.error('Ошибка при удалении пользователя');
      console.error('Delete error:', error);
    }
  };

  const columns = [
    {
      title: "ID",
      dataIndex: "id",
      key: "id",
      width: 60,
    },
    {
      title: "Имя",
      dataIndex: "firstName",
      key: "firstName",
    },
    {
      title: "Фамилия",
      dataIndex: "lastName",
      key: "lastName",
    },
    {
      title: "Отчество",
      dataIndex: "middleName",
      key: "middleName",
      render: (middleName) => middleName || '-',
    },
    {
      title: "Телефон",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || '-',
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => email || '-',
    },
    {
      title: "Дата рождения",
      dataIndex: "birthDateFormatted",
      key: "birthDate",
      render: (date) => date || '-',
    },
    {
      title: "Адрес",
      dataIndex: ["address", "city"],
      key: "address",
      render: (city, record) => 
        record.address ? `${record.address.city}, ${record.address.street}` : '-',
    },
    {
      title: "Действия",
      key: "actions",
      width: 150,
      fixed: 'right',
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
            disabled={editingKey !== ''}
          >
            Изменить
          </Button>
          
          <Popconfirm
            title="Удалить пользователя?"
            description="Вы уверены, что хотите удалить этого пользователя?"
            onConfirm={() => handleDelete(record)}
            okText="Да"
            cancelText="Нет"
          >
            <Button
              type="primary"
              danger
              icon={<DeleteOutlined />}
              size="small"
              disabled={editingKey !== ''}
            >
              Удалить
            </Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ textAlign: 'center', padding: '50px' }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ textAlign: 'center', padding: '50px', color: 'red' }}>
        Ошибка загрузки данных
      </div>
    );
  }

  return (
    <>
      <Card 
        title="Пользователи" 
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreate}
          >
            Добавить пользователя
          </Button>
        }
      >
        <Table 
          dataSource={users} 
          columns={columns} 
          loading={isFetching}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 1200 }}
          rowKey="id"
        />
      </Card>

      {/* Модальное окно для редактирования */}
      <Modal
        title="Редактирование пользователя"
        open={isModalVisible}
        onCancel={handleCancel}
        footer={[
          <Button key="cancel" icon={<CloseOutlined />} onClick={handleCancel}>
            Отмена
          </Button>,
          <Button 
            key="save" 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleSave}
            loading={isFetching}
          >
            Сохранить
          </Button>,
        ]}
        width={600}
      >
        <Form
          form={form}
          layout="vertical"
          initialValues={currentRecord ? {
            ...currentRecord,
            birthDate: currentRecord.birthDate ? dayjs(currentRecord.birthDate) : null
          } : {}}
        >
          <Form.Item
            label="Имя"
            name="firstName"
            rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Введите имя" />
          </Form.Item>

          <Form.Item
            label="Фамилия"
            name="lastName"
          >
            <Input placeholder="Введите фамилию" />
          </Form.Item>

          <Form.Item
            label="Отчество"
            name="middleName"
          >
            <Input placeholder="Введите отчество" />
          </Form.Item>

          <Form.Item
            label="Телефон"
            name="phone"
            rules={[{ pattern: /^\d+$/, message: 'Телефон должен содержать только цифры' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Введите телефон" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: 'email', message: 'Некорректный формат email' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Введите email" />
          </Form.Item>

          <Form.Item
            label="Дата рождения"
            name="birthDate"
          >
            <DatePicker 
              style={{ width: '100%' }} 
              placeholder="Выберите дату рождения" 
            />
          </Form.Item>
        </Form>
      </Modal>

      {/* Модальное окно для создания */}
      <Modal
        title="Создание нового пользователя"
        open={isCreateModalVisible}
        onCancel={handleCreateCancel}
        footer={[
          <Button key="cancel" icon={<CloseOutlined />} onClick={handleCreateCancel}>
            Отмена
          </Button>,
          <Button 
            key="save" 
            type="primary" 
            icon={<SaveOutlined />} 
            onClick={handleCreateSave}
            loading={isFetching}
          >
            Создать
          </Button>,
        ]}
        width={600}
      >
        <Form
          form={createForm}
          layout="vertical"
        >
          <Form.Item
            label="Имя"
            name="firstName"
            rules={[{ required: true, message: 'Пожалуйста, введите имя' }]}
          >
            <Input prefix={<UserOutlined />} placeholder="Введите имя" />
          </Form.Item>

          <Form.Item
            label="Фамилия"
            name="lastName"
          >
            <Input placeholder="Введите фамилию" />
          </Form.Item>

          <Form.Item
            label="Отчество"
            name="middleName"
          >
            <Input placeholder="Введите отчество" />
          </Form.Item>

          <Form.Item
            label="Телефон"
            name="phone"
            rules={[{ pattern: /^\d+$/, message: 'Телефон должен содержать только цифры' }]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Введите телефон" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: 'email', message: 'Некорректный формат email' }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Введите email" />
          </Form.Item>

          <Form.Item
            label="Дата рождения"
            name="birthDate"
          >
            <DatePicker 
              style={{ width: '100%' }} 
              placeholder="Выберите дату рождения" 
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}