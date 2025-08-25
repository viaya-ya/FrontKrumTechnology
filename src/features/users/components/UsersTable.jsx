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
  Card,
  Select,
} from "antd";
import {
  EditOutlined,
  DeleteOutlined,
  SaveOutlined,
  CloseOutlined,
  PlusOutlined,
  UserOutlined,
  MailOutlined,
  PhoneOutlined,
} from "@ant-design/icons";
import dayjs from "dayjs";
import {
  useGetAllUsersQuery,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useCreateUserMutation,
} from "../usersApi";

import { useGetAddressesWithoutUsersQuery } from "../../addresses/addressesApi";

export default function UsersTable() {
  const [messageApi, contextHolder] = message.useMessage();

  const [users, setUsers] = useState([]);
  const [editingKey, setEditingKey] = useState("");
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

  const { data: arrayAddressesWithoutUsers } =
    useGetAddressesWithoutUsersQuery();

  const [updateUser] = useUpdateUserMutation();
  const [deleteUser] = useDeleteUserMutation();
  const [createUser] = useCreateUserMutation();

  useEffect(() => {
    if (arrayUsers?.length > 0) {
      const usersWithKey = arrayUsers.map((item) => ({
        ...item,
        key: item.id || Math.random().toString(36).substr(2, 9),
        birthDateFormatted: item.birthDate
          ? dayjs(item.birthDate).format("DD.MM.YYYY")
          : "",
      }));
      setUsers(usersWithKey);
    }
  }, [arrayUsers]);

  const handleEdit = (record) => {
    console.log("record", record);
    setEditingKey(record.key);
    setCurrentRecord(record);
    form.setFieldsValue({
      ...record,
      birthDate: record.birthDate ? dayjs(record.birthDate) : null,
      addressId: record?.address?.id
    });
    setIsModalVisible(true);
  };

  const handleCreate = () => {
    setIsCreateModalVisible(true);
    createForm.resetFields();
  };

  const handleCancel = () => {
    setEditingKey("");
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

      const cleanedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          value === "" ? null : value,
        ])
      );

      const updatedUser = {
        ...currentRecord,
        ...cleanedValues,
        birthDate: cleanedValues.birthDate
          ? cleanedValues.birthDate.format("YYYY-MM-DD")
          : null,
      };

      await updateUser(updatedUser).unwrap();

      setUsers((prev) =>
        prev.map((item) =>
          item.key === currentRecord.key ? updatedUser : item
        )
      );

      messageApi.success("Пользователь успешно обновлен");
      handleCancel();
    } catch (error) {
      messageApi.error("Ошибка при обновлении пользователя");
      console.error("Update error:", error);
    }
  };

  const handleCreateSave = async () => {
    try {
      const values = await createForm.validateFields();
      const cleanedValues = Object.fromEntries(
        Object.entries(values).map(([key, value]) => [
          key,
          value === "" ? null : value,
        ])
      );
      const newUser = {
        ...cleanedValues,
        birthDate: cleanedValues.birthDate
          ? cleanedValues.birthDate.format("YYYY-MM-DD")
          : null,
      };

      await createUser(newUser).unwrap();

      messageApi.success("Пользователь успешно создан");
      handleCreateCancel();
    } catch (error) {
      messageApi.error("Ошибка при создании пользователя");
      console.error("Create error:", error);
    }
  };

  const handleDelete = async (record) => {
    try {
      await deleteUser(record.id).unwrap();
      setUsers((prev) => prev.filter((item) => item.key !== record.key));
      messageApi.success("Пользователь успешно удален");
    } catch (error) {
      messageApi.error("Ошибка при удалении пользователя");
      console.error("Delete error:", error);
    }
  };

  const columns = [
    {
      title: "№",
      key: "index",
      width: 60,
      render: (_, __, index) => index + 1,
    },
    {
      title: "Имя",
      dataIndex: "firstName",
      key: "firstName",
      filterSearch: true,
      filters: Array.from(new Set(users.map((item) => item.firstName))).map(
        (name) => ({
          text: name,
          value: name,
        })
      ),
      onFilter: (value, record) => record.firstName.includes(value),
    },
    {
      title: "Фамилия",
      dataIndex: "lastName",
      key: "lastName",
      filterSearch: true,
      filters: Array.from(new Set(users.map((item) => item.lastName))).map(
        (name) => ({
          text: name,
          value: name,
        })
      ),
      onFilter: (value, record) => record.lastName.includes(value),
    },
    {
      title: "Отчество",
      dataIndex: "middleName",
      key: "middleName",
      render: (middleName) => middleName || "-",
      filterSearch: true,
      filters: Array.from(
        new Set(users.map((item) => item.middleName || "").filter(Boolean))
      ).map((name) => ({
        text: name,
        value: name,
      })),
      onFilter: (value, record) => (record.middleName || "").includes(value),
    },
    {
      title: "Телефон",
      dataIndex: "phone",
      key: "phone",
      render: (phone) => phone || "-",
      filterSearch: true,
      filters: Array.from(
        new Set(users.map((item) => item.phone || "").filter(Boolean))
      ).map((phone) => ({
        text: phone,
        value: phone,
      })),
      onFilter: (value, record) => (record.phone || "").includes(value),
    },
    {
      title: "Email",
      dataIndex: "email",
      key: "email",
      render: (email) => email || "-",
      filterSearch: true,
      filters: Array.from(
        new Set(users.map((item) => item.email || "").filter(Boolean))
      ).map((email) => ({
        text: email,
        value: email,
      })),
      onFilter: (value, record) => (record.email || "").includes(value),
    },
    {
      title: "Дата рождения",
      dataIndex: "birthDateFormatted",
      key: "birthDate",
      render: (date) => date || "-",
      filterSearch: true,
      filters: Array.from(
        new Set(
          users.map((item) => item.birthDateFormatted || "").filter(Boolean)
        )
      ).map((date) => ({
        text: date,
        value: date,
      })),
      onFilter: (value, record) =>
        (record.birthDateFormatted || "").includes(value),
    },
    {
      title: "Адрес",
      dataIndex: "address",
      key: "address",
      render: (_, record) => {
        if (!record?.address) return "-";

        const { region, city, street, house, apartment } = record.address;
        const addressParts = [
          region,
          city,
          street,
          house,
          apartment ? `кв. ${apartment}` : null,
        ].filter(Boolean);

        return addressParts.length > 0 ? addressParts.join(", ") : "-";
      },
      filterSearch: true,
      filters: Array.from(
        new Set(
          users.map((item) => {
            if (!item?.address) return "-";

            const { region, city, street, house, apartment } = item.address;
            const addressParts = [
              region,
              city,
              street,
              house,
              apartment ? `кв. ${apartment}` : null,
            ].filter(Boolean);

            return addressParts.length > 0 ? addressParts.join(", ") : "-";
          })
        )
      ).map((address) => ({
        text: address,
        value: address,
      })),
      onFilter: (value, record) => {
        if (!record?.address) return value === "-";

        const { region, city, street, house, apartment } = record.address;
        const addressParts = [
          region,
          city,
          street,
          house,
          apartment ? `кв. ${apartment}` : null,
        ].filter(Boolean);

        const addressStr =
          addressParts.length > 0 ? addressParts.join(", ") : "-";
        return addressStr.includes(value);
      },
    },
    {
      title: "Действия",
      key: "actions",
      width: 150,
      fixed: "right",
      render: (_, record) => (
        <Space size="small">
          <Button
            type="primary"
            icon={<EditOutlined />}
            size="small"
            onClick={() => handleEdit(record)}
            disabled={editingKey !== ""}
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
              disabled={editingKey !== ""}
            ></Button>
          </Popconfirm>
        </Space>
      ),
    },
  ];

  if (isLoading) {
    return (
      <div style={{ textAlign: "center", padding: "50px" }}>
        <Spin size="large" />
      </div>
    );
  }

  if (isError) {
    return (
      <div style={{ textAlign: "center", padding: "50px", color: "red" }}>
        Ошибка загрузки данных
      </div>
    );
  }

  return (
    <>
      {contextHolder}

      <Card
        title="Пользователи"
        extra={
          <Button type="primary" icon={<PlusOutlined />} onClick={handleCreate}>
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
        >
          <Form.Item
            label="Имя"
            name="firstName"
            rules={[
              { required: true, message: "Пожалуйста, введите имя" },
              {
                pattern: /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
                message: "Разрешены только буквы",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Введите имя" />
          </Form.Item>

          <Form.Item
            label="Фамилия"
            name="lastName"
            rules={[
              {
                pattern: /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
                message: "Разрешены только буквы",
              },
            ]}
          >
            <Input placeholder="Введите фамилию" />
          </Form.Item>

          <Form.Item
            label="Отчество"
            name="middleName"
            rules={[
              {
                pattern: /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
                message: "Разрешены только буквы",
              },
            ]}
          >
            <Input placeholder="Введите отчество" />
          </Form.Item>

          <Form.Item
            label="Телефон"
            name="phone"
            rules={[
              {
                pattern: /^\d+$/,
                message: "Телефон должен содержать только цифры",
              },
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Введите телефон" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: "email", message: "Некорректный формат email" }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Введите email" />
          </Form.Item>

          <Form.Item label="Дата рождения" name="birthDate">
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Выберите дату рождения"
            />
          </Form.Item>

          <Form.Item label="Адрес" name="addressId">
            <Select
              allowClear
              placeholder="Выберите адрес"
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
              options={[
                ...(currentRecord?.address
                  ? [
                      {
                        value: currentRecord.address.id,
                        label: `${currentRecord.address.region}, ${
                          currentRecord.address.city
                        }, ${currentRecord.address.street}, ${
                          currentRecord.address.house
                        }${
                          currentRecord.address.apartment
                            ? `, кв. ${currentRecord.address.apartment}`
                            : ""
                        }`,
                      },
                    ]
                  : []),
                ...(arrayAddressesWithoutUsers?.map((item) => ({
                  value: item.id,
                  label: `${item.region}, ${item.city}, ${item.street}, ${
                    item.house
                  }${item.apartment ? `, кв. ${item.apartment}` : ""}`,
                })) || []),
              ]}
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
          <Button
            key="cancel"
            icon={<CloseOutlined />}
            onClick={handleCreateCancel}
          >
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
        <Form form={createForm} layout="vertical">
          <Form.Item
            label="Имя"
            name="firstName"
            rules={[
              { required: true, message: "Пожалуйста, введите имя" },
              {
                pattern: /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
                message: "Разрешены только буквы",
              },
            ]}
          >
            <Input prefix={<UserOutlined />} placeholder="Введите имя" />
          </Form.Item>

          <Form.Item
            label="Фамилия"
            name="lastName"
            rules={[
              {
                pattern: /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
                message: "Разрешены только буквы",
              },
            ]}
          >
            <Input placeholder="Введите фамилию" />
          </Form.Item>

          <Form.Item
            label="Отчество"
            name="middleName"
            rules={[
              {
                pattern: /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
                message: "Разрешены только буквы",
              },
            ]}
          >
            <Input placeholder="Введите отчество" />
          </Form.Item>

          <Form.Item
            label="Телефон"
            name="phone"
            rules={[
              {
                pattern: /^\d+$/,
                message: "Телефон должен содержать только цифры",
              },
            ]}
          >
            <Input prefix={<PhoneOutlined />} placeholder="Введите телефон" />
          </Form.Item>

          <Form.Item
            label="Email"
            name="email"
            rules={[{ type: "email", message: "Некорректный формат email" }]}
          >
            <Input prefix={<MailOutlined />} placeholder="Введите email" />
          </Form.Item>

          <Form.Item label="Дата рождения" name="birthDate">
            <DatePicker
              style={{ width: "100%" }}
              placeholder="Выберите дату рождения"
            />
          </Form.Item>

          <Form.Item label="Адрес" name="addressId">
            <Select
              allowClear
              placeholder="Выберите адрес"
              showSearch
              optionFilterProp="label"
              filterOption={(input, option) =>
                option?.label?.toLowerCase().includes(input.toLowerCase())
              }
              options={arrayAddressesWithoutUsers?.map((item) => ({
                value: item.id,
                label:
                  item.region +
                  " " +
                  item.city +
                  " " +
                  item.street +
                  " " +
                  item.house +
                  " " +
                  item.apartment,
              }))}
            />
          </Form.Item>
        </Form>
      </Modal>
    </>
  );
}
