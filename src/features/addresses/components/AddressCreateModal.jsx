import { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { useCreateAddressMutation } from "../addressesApi";

export default function AddressCreateModal({ visible, onCancel, onSuccess }) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [createAddress] = useCreateAddressMutation();

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

      await createAddress(cleanedValues).unwrap();
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
      title="Создание нового адреса"
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
          label="Регион"
          name="region"
          rules={[
            { required: true, message: "Пожалуйста, введите регион" },
            {
              pattern: /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
              message: "Разрешены только буквы",
            },
          ]}
        >
          <Input placeholder="Введите регион" />
        </Form.Item>

        <Form.Item
          label="Город"
          name="city"
          rules={[
            { required: true, message: "Пожалуйста, введите город" },
            {
              pattern: /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
              message: "Разрешены только буквы",
            },
          ]}
        >
          <Input placeholder="Введите город" />
        </Form.Item>

        <Form.Item
          label="Улица"
          name="street"
          rules={[
            { required: true, message: "Пожалуйста, введите улицу" },
            {
              pattern: /^[a-zA-Zа-яА-ЯёЁ\s]+$/,
              message: "Разрешены только буквы",
            },
          ]}
        >
          <Input placeholder="Введите улицу" />
        </Form.Item>

        <Form.Item
          label="Дом"
          name="house"
          rules={[
            { required: true, message: "Пожалуйста, введите номер дома" },
            {
              pattern: /^\d+$/,
              message: "Разрешены только цифры",
            },
          ]}
        >
          <Input placeholder="Введите номер дома" />
        </Form.Item>

        <Form.Item
          label="Квартира"
          name="apartment"
          rules={[
            {
              pattern: /^\d+$/,
              message: "Разрешены только цифры",
            },
          ]}
        >
          <Input placeholder="Введите номер квартиры (опционально)" />
        </Form.Item>
      </Form>
    </Modal>
  );
}