import { useState } from "react";
import { Modal, Form, Input, DatePicker, Select, Button  } from "antd";
import { CloseOutlined, SaveOutlined, UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import { useCreateUserMutation } from "../usersApi";

export default function UserCreateModal({ 
  visible, 
  onCancel, 
  onSuccess, 
  addressesWithoutUsers 
}) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [createUser] = useCreateUserMutation();

  const handleSave = async () => {
    try {
      setIsLoading(true);
      const values = await form.validateFields();
      
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
      form.resetFields();
      onSuccess();
    } catch (error) {
      console.error("Create error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Создание нового пользователя"
      open={visible}
      onCancel={onCancel}
      footer={[
        <Button key="cancel" icon={<CloseOutlined />} onClick={onCancel}>
          Отмена
        </Button>,
        <Button
          key="save"
          type="primary"
          icon={<SaveOutlined />}
          onClick={handleSave}
          loading={isLoading}
        >
          Создать
        </Button>,
      ]}
      width={600}
    >
      <Form form={form} layout="vertical">
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
            options={addressesWithoutUsers?.map((item) => ({
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
                (item.apartment || ""),
            }))}
          />
        </Form.Item>
      </Form>
    </Modal>
  );
}