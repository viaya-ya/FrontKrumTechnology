import { useState, useEffect } from "react";
import { 
  Table, 
  Button, 
  Space, 
  Modal, 
  Form, 
  Input, 
  message,
  Popconfirm,
  Spin,
  Card,
  Row,
  Col
} from "antd";
import { 
  EditOutlined, 
  DeleteOutlined, 
  SaveOutlined, 
  CloseOutlined,
  PlusOutlined 
} from "@ant-design/icons";
import { 
  useGetAllAddressesQuery, 
  useUpdateAddressMutation, 
  useDeleteAddressMutation,
  useCreateAddressMutation // ✅ Импортируем хук создания
} from "../addressesApi";

export default function AddressesTable() {
  const [addresses, setAddresses] = useState([]);
  const [editingKey, setEditingKey] = useState('');
  const [isModalVisible, setIsModalVisible] = useState(false);
  const [isCreateModalVisible, setIsCreateModalVisible] = useState(false);
  const [currentRecord, setCurrentRecord] = useState(null);
  const [form] = Form.useForm();
  const [createForm] = Form.useForm();

  const {
    data: arrayAddresses,
    isLoading,
    isFetching,
    isError,
  } = useGetAllAddressesQuery();

  const [updateAddress] = useUpdateAddressMutation();
  const [deleteAddress] = useDeleteAddressMutation();
  const [createAddress] = useCreateAddressMutation();

  useEffect(() => {
    if (arrayAddresses?.length > 0) {
      const addressesWithKey = arrayAddresses.map(item => ({
        ...item,
        key: item.id || Math.random().toString(36).substr(2, 9)
      }));
      setAddresses(addressesWithKey);
    }
  }, [arrayAddresses]);

  const handleEdit = (record) => {
    setEditingKey(record.key);
    setCurrentRecord(record);
    form.setFieldsValue(record);
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
      const updatedAddress = { ...currentRecord, ...values };
      
      await updateAddress(updatedAddress).unwrap();
      
      setAddresses(prev => prev.map(item => 
        item.key === currentRecord.key ? updatedAddress : item
      ));
      
      message.success('Адрес успешно обновлен');
      handleCancel();
    } catch (error) {
      message.error('Ошибка при обновлении адреса');
      console.error('Update error:', error);
    }
  };

  const handleCreateSave = async () => {
    try {
      const values = await createForm.validateFields();
      
      await createAddress(values).unwrap();
      
      message.success('Адрес успешно создан');
      handleCreateCancel();
    } catch (error) {
      message.error('Ошибка при создании адреса');
      console.error('Create error:', error);
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteAddress(record.id).unwrap();
      setAddresses(prev => prev.filter(item => item.key !== record.key));
      message.success('Адрес успешно удален');
    } catch (error) {
      message.error('Ошибка при удалении адреса');
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
      title: "Регион",
      dataIndex: "region",
      key: "region",
    },
    {
      title: "Город",
      dataIndex: "city",
      key: "city",
    },
    {
      title: "Улица",
      dataIndex: "street",
      key: "street",
    },
    {
      title: "Дом",
      dataIndex: "house",
      key: "house",
    },
    {
      title: "Квартира",
      dataIndex: "apartment",
      key: "apartment",
      render: (apartment) => apartment || '-',
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
            title="Удалить адрес?"
            description="Вы уверены, что хотите удалить этот адрес?"
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
        title="Адреса" 
        extra={
          <Button 
            type="primary" 
            icon={<PlusOutlined />} 
            onClick={handleCreate}
          >
            Добавить адрес
          </Button>
        }
      >
        <Table 
          dataSource={addresses} 
          columns={columns} 
          loading={isFetching}
          pagination={{ pageSize: 10, showSizeChanger: true }}
          scroll={{ x: 1000 }}
          rowKey="id"
        />
      </Card>

      {/* Модальное окно для редактирования */}
      <Modal
        title="Редактирование адреса"
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
          initialValues={currentRecord || {}}
        >
          <Form.Item
            label="Регион"
            name="region"
            rules={[{ required: true, message: 'Пожалуйста, введите регион' }]}
          >
            <Input placeholder="Введите регион" />
          </Form.Item>

          <Form.Item
            label="Город"
            name="city"
            rules={[{ required: true, message: 'Пожалуйста, введите город' }]}
          >
            <Input placeholder="Введите город" />
          </Form.Item>

          <Form.Item
            label="Улица"
            name="street"
            rules={[{ required: true, message: 'Пожалуйста, введите улицу' }]}
          >
            <Input placeholder="Введите улицу" />
          </Form.Item>

          <Form.Item
            label="Дом"
            name="house"
            rules={[{ required: true, message: 'Пожалуйста, введите номер дома' }]}
          >
            <Input placeholder="Введите номер дома" />
          </Form.Item>

          <Form.Item
            label="Квартира"
            name="apartment"
          >
            <Input placeholder="Введите номер квартиры" />
          </Form.Item>
        </Form>
      </Modal>

      {/* Модальное окно для создания */}
      <Modal
        title="Создание нового адреса"
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
            label="Регион"
            name="region"
            rules={[{ required: true, message: 'Пожалуйста, введите регион' }]}
          >
            <Input placeholder="Введите регион" />
          </Form.Item>

          <Form.Item
            label="Город"
            name="city"
            rules={[{ required: true, message: 'Пожалуйста, введите город' }]}
          >
            <Input placeholder="Введите город" />
          </Form.Item>

          <Form.Item
            label="Улица"
            name="street"
            rules={[{ required: true, message: 'Пожалуйста, введите улицу' }]}
          >
            <Input placeholder="Введите улицу" />
          </Form.Item>

          <Form.Item
            label="Дом"
            name="house"
            rules={[{ required: true, message: 'Пожалуйста, введите номер дома' }]}
          >
            <Input placeholder="Введите номер дома" />
          </Form.Item>

          <Form.Item
            label="Квартира"
            name="apartment"
          >
            <Input placeholder="Введите номер квартиры (опционально)" />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}