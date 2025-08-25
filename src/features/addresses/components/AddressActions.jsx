import { Space, Button, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDeleteAddressMutation } from "../addressesApi";

export default function AddressActions({ record, editingKey, onEdit, onDelete }) {
  const [deleteAddress] = useDeleteAddressMutation();

  const handleDelete = async () => {
    try {
      await deleteAddress(record.id).unwrap();
      onDelete();
    } catch (error) {
      console.error("Delete error:", error);
    }
  };

  return (
    <Space size="small">
      <Button
        type="primary"
        icon={<EditOutlined />}
        size="small"
        onClick={() => onEdit(record)}
        disabled={editingKey !== ""}
      >
        Изменить
      </Button>

      <Popconfirm
        title="Удалить адрес?"
        description="Вы уверены, что хотите удалить этот адрес?"
        onConfirm={handleDelete}
        okText="Да"
        cancelText="Нет"
      >
        <Button
          type="primary"
          danger
          icon={<DeleteOutlined />}
          size="small"
          disabled={editingKey !== ""}
        >
          Удалить
        </Button>
      </Popconfirm>
    </Space>
  );
}