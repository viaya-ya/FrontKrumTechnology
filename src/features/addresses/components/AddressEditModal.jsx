import { useState } from "react";
import { Modal, Form, Input, Button } from "antd";
import { CloseOutlined, SaveOutlined } from "@ant-design/icons";
import { useUpdateAddressMutation } from "../addressesApi";

export default function AddressEditModal({ visible, record, onCancel, onSuccess }) {
  const [form] = Form.useForm();
  const [isLoading, setIsLoading] = useState(false);
  const [updateAddress] = useUpdateAddressMutation();

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

      const updatedAddress = { ...record, ...cleanedValues };
      await updateAddress(updatedAddress).unwrap();
      onSuccess();
    } catch (error) {
      console.error("Update error:", error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Modal
      title="Редактирование адреса"
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
        initialValues={record || {}}
      >
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
          <Input placeholder="Введите номер квартиры" />
        </Form.Item>
      </Form>
    </Modal>
  );
}