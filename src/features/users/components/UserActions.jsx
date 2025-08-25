import { Space, Button, Popconfirm } from "antd";
import { EditOutlined, DeleteOutlined } from "@ant-design/icons";
import { useDeleteUserMutation } from "../usersApi";

export default function UserActions({ record, editingKey, onEdit, onDeleteSuccess }) {
  const [deleteUser] = useDeleteUserMutation();

  const handleDelete = async () => {
    try {
      await deleteUser(record.id).unwrap();
      onDeleteSuccess();
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
        title="Удалить пользователя?"
        description="Вы уверены, что хотите удалить этого пользователя?"
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