import { useState } from "react";
import { Modal, Form, Input, DatePicker, Button } from "antd";
import { CloseOutlined, SaveOutlined, UserOutlined, MailOutlined, PhoneOutlined } from "@ant-design/icons";
import dayjs from "dayjs";
import { useUpdateUserMutation } from "../usersApi";

export default function UserEditModal({ visible, record, onCancel, onSuccess }) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [updateUser] = useUpdateUserMutation();

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

      const updatedUser = {
        ...record,
        ...cleanedValues,
        birthDate: cleanedValues.birthDate
          ? cleanedValues.birthDate.format("YYYY-MM-DD")
          : null,
        addressId: record.address?.id,
      };

      await updateUser(updatedUser).unwrap();
      onSuccess();
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Редактирование пользователя"
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
          Сохранить
        </Button>,
      ]}
      width={600}
    >
      <Form
        form={form}
        layout="vertical"
        initialValues={
          record
            ? {
                ...record,
                birthDate: record.birthDate ? dayjs(record.birthDate) : null,
              }
            : {}
        }
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
      </Form>
    </Modal>
  );
}